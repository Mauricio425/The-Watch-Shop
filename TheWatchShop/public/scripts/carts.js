document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(items => {
        const container = document.getElementById('cart-items-container');
        const checkoutDetails = document.querySelector('.checkout-details');
        container.innerHTML = ''; 
  
        let subtotal = 0;
  
        // Loop through each cart item
        items.forEach(item => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
  
          const itemHTML = `
            <div class="cart-item">
              <div>
                <img src="${item.image_path}" alt="${item.name}">
              </div>
              <div class="cart-item-details">
                <div class="item-name">
                  <p>${item.name}</p>
                </div>
                <div class="item-info">
                  <table>
                    <tr>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Remove</th>
                    </tr>
                    <tr>
                      <td class="item-quantity">
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.product_id}" disabled>
                      </td>
                      <td class="item-price">$${item.price.toFixed(2)}</td>
                      <td class="remove-button">
                        <button onclick="removeFromCart(${item.product_id})">x</button>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          `;
  
          container.insertAdjacentHTML('beforeend', itemHTML);
        });
  
        const tax = subtotal * 0.0675;
        const total = subtotal + tax;

        checkoutDetails.innerHTML = `
          <h2>Checkout</h2>
          <p>Subtotal: $${subtotal.toFixed(2)}</p>
          <p>Tax (6.75%): $${tax.toFixed(2)}</p>
          <p>Total: $${total.toFixed(2)}</p>
        `;
      })
      .catch(err => {
        console.error('Failed to load cart:', err);
      });
  });
  
  function removeFromCart(productId) {
    fetch(`/api/cart/${productId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Item removed');
        location.reload(); 
      })
      .catch(err => {
        console.error('Remove failed:', err);
      });
  }
  