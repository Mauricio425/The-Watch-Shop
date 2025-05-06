document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('edit-form');
  const resultDiv = document.getElementById('edit-result');
  const params    = new URLSearchParams(window.location.search);
  const id        = params.get('product_id');
  const isNew     = !id;

  if (isNew) {
    const idLabel = form.querySelector('input[name="product_id"]').closest('label');
    idLabel.style.display = 'none';
  } else {
    // Otherwise fetch existing product to populate the form
    fetch(`/api/admin/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(p => {
        form.elements.product_id.value  = p.product_id;
        form.elements.name.value        = p.name;
        form.elements.description.value = p.description;
        form.elements.price.value       = p.price;
        form.elements.image_path.value  = p.image_path;
        form.elements.category_id.value = p.category_id;
        form.elements.color.value       = p.color || '';
        form.elements.sex.value         = p.sex || 'Unisex';
        form.elements.active.checked    = p.active === 1;
      })
      .catch(err => {
        console.error(err);
        resultDiv.textContent = 'Error loading product.';
      });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    resultDiv.textContent = '';

    const payload = {
      name:        form.elements.name.value.trim(),
      description: form.elements.description.value.trim(),
      category_id: Number(form.elements.category_id.value),
      image_path:  form.elements.image_path.value.trim(),
      price:       parseFloat(form.elements.price.value),
      color:       form.elements.color.value.trim(),
      sex:         form.elements.sex.value,
      active:      form.elements.active.checked ? 1 : 0
    };

    const url    = isNew
      ? '/api/admin/products'
      : `/api/admin/products/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      resultDiv.innerHTML = `
        <p style="color:green;">
          ${isNew ? 'Created' : 'Updated'} successfully
          ${isNew ? `(ID ${data.product_id})` : ''}
        </p>
      `;
      setTimeout(() => {
        window.location.href = 'admin-products.html';
      }, 800);

    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  });
});
