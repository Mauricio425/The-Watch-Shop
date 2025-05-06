document.addEventListener('DOMContentLoaded', () => {
  const searchForm  = document.getElementById('search-form');
  const searchInput = searchForm.querySelector('input[name="q"]');

  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const term = searchInput.value.trim();
    if (!term) return;
    window.location.href = `products.html?q=${encodeURIComponent(term)}`;
  });
});

function clearInput() {
  const searchInput = document.querySelector('#search-form input[name="q"]');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
}
