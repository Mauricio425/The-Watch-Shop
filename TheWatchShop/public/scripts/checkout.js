document.addEventListener('DOMContentLoaded', () => {
    const previewEl = document.getElementById('preview');
    const form = document.getElementById('checkout-form');
    const confirmEl = document.getElementById('confirmation');
  

    fetch('/api/cart/checkout-preview')
      .then(res => res.json())
      .then(({ user_id, items }) => {
        if (items.length === 0) {
          previewEl.innerHTML = '<p>Your cart is empty.</p>';
          form.style.display = 'none';
          return;
        }
  
        let subtotal = 0;
        const rows = items.map(item => {
          subtotal += item.price * item.quantity;
          return `
            <div class="preview-item">
              <span>${item.name}</span>
              <span>Qty: ${item.quantity}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `;
        }).join('');
  
        const tax = subtotal * 0.0675;
        const total = subtotal + tax;
  
        previewEl.innerHTML = `
          ${rows}
          <hr>
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
          <p>Tax (6.75%): $${tax.toFixed(2)}</p>
          <p>Total: $${total.toFixed(2)}</p>
        `;
      })
      .catch(console.error);
  
     form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form);
      const address = formData.get('address');
  
      fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
        .then(res => res.json())
        .then(result => {
          confirmEl.style.display = 'block';
          confirmEl.innerHTML = `<p>${result.message}. Order #${result.order_id}</p>`;
          form.style.display = 'none';
          previewEl.style.display = 'none';
        })
        .catch(err => {
          console.error(err);
          alert('Checkout failed.');
        });
    });
  });
  