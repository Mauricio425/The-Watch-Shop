document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('q');


  const endpoint = searchTerm
    ? `/api/products/search?q=${encodeURIComponent(searchTerm)}`
    : '/api/products';

  fetch(endpoint)
    .then(res => res.json())
    .then(products => {
      grid.innerHTML = '';

      if (!products.length) {
        grid.innerHTML = '<p style="text-align:center;">No products found.</p>';
        return;
      }

      products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
          <a href="details.html?product_id=${product.product_id}">
            <img src="${product.image_path}" class="product-image" alt="${product.name}">
          </a>
          <div class="product-info">
            <h5 class="product-name">${product.name}</h5>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <a href="details.html?product_id=${product.product_id}" class="view-button">View Product</a>
          </div>
        `;

        grid.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Failed to load products:', err);
      grid.innerHTML = '<p style="text-align:center;">Error loading products.</p>';
    });
});
