document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('orders-list');
  
    fetch('/api/orders')
      .then(res => res.json())
      .then(orders => {
        if (!orders.length) {
          container.innerHTML = '<p>No past orders found.</p>';
          return;
        }
  
        container.innerHTML = '';
  
        orders.forEach(order => {

          const itemsHtml = order.items.map(item => `
            <div class="order-item">
              <span>${item.name} x${item.quantity}</span>
              <span>$${item.total.toFixed(2)}</span>
            </div>
          `).join('');
          const orderCard = document.createElement('section');
          orderCard.classList.add('order-card');
          orderCard.innerHTML = `
            <h2>Order #${order.order_id}</h2>
            <p><strong>Date:</strong> ${order.date_ordered}</p>
            <p><strong>Ship To:</strong> ${order.address}</p>
            <div class="order-items">
              ${itemsHtml}
            </div>
            <p class="order-subtotal"><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
          `;
  
          container.appendChild(orderCard);
        });
      })
      .catch(err => {
        console.error('Failed to load orders:', err);
        container.innerHTML = '<p>Error loading orders.</p>';
      });
  });
  