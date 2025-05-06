document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product_id');
  
    if (!productId) {
      document.body.innerHTML = '<p>Product ID not specified in URL.</p>';
      return;
    }
  
    fetch(`/api/products/${productId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Product not found');
        }
        return response.json();
      })
      .then(product => {
        document.querySelector('.product-img').src = product.image_path;
        document.querySelector('.product-img').alt = product.name;
        document.querySelector('.product-title').textContent = product.name;
        document.querySelector('.product-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;
        document.querySelector('.product-description').textContent = product.description;
  
        document.querySelector('.tags-section').style.display = 'none';
      })
      .catch(err => {
        console.error(err);
        document.querySelector('.product-info').innerHTML = '<p>Failed to load product details.</p>';
      });
  });
  

  document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product_id');
  
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: parseInt(productId),
        quantity: 1
      })
    })
      .then(res => res.json())
      .then(result => {
        alert('Product added to cart!');
        console.log('Cart updated:', result);
      })
      .catch(err => {
        console.error('Failed to add to cart:', err);
        alert('Failed to add product to cart.');
      });
  });
  