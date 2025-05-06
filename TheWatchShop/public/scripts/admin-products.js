document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('products-table');
  const tbody = table.querySelector('tbody');

  fetch('/api/admin/products')
    .then(res => res.json())
    .then(products => {
      tbody.innerHTML = '';
      products.forEach(p => {
        const tr = document.createElement('tr');
        tr.dataset.id = p.product_id;
        tr.innerHTML = `
          <td>${p.product_id}</td>
          <td>${p.name}</td>
          <td>${p.description}</td>
          <td>${p.category_id}</td>
          <td>${p.image_path}</td>
          <td>$${p.price.toFixed(2)}</td>
          <td class="actions">
          ${p.active
        ? `<button class="btn-delete">Delete</button>`
        : `<button class="btn-relist">Relist</button>`
      }
      <button class="btn-edit">Edit</button>
    </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error('Failed to load admin products:', err));

  table.addEventListener('click', async e => {
    const btn = e.target;
    const tr = btn.closest('tr');
    if (!tr) return;
    const id = tr.dataset.id;

    if (btn.classList.contains('btn-delete')) {
      if (!confirm('Delete product ID ' + id + '?')) return;
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        tr.remove();
        alert('Product deleted');
      } catch (err) {
        console.error(err);
        alert('Delete failed');
      }
    }

    if (btn.classList.contains('btn-edit')) {
      window.location.href = `admin-product-edit.html?product_id=${id}`;
    }
  });

  table.addEventListener('click', async e => {
    const btn = e.target;
    const tr  = btn.closest('tr');
    if (!tr) return;
    const id = tr.dataset.id;
  
    if (btn.classList.contains('btn-relist')) {
      try {
        const res = await fetch(`/api/admin/products/${id}/relist`, {
          method: 'PUT'
        });
        if (!res.ok) throw new Error(await res.text());
        tr.remove();                // or re‑fetch table
        alert('Product re‑listed');
      } catch (err) {
        console.error(err);
        alert('Relist failed');
      }
    }
  });
  
});
