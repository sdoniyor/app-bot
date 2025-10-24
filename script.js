const grid = document.getElementById('grid');
const searchInput = document.getElementById('search');
const catsWrap = document.getElementById('cats');
let PRODUCTS = [];

// Загружаем товары из products.json
async function loadProducts() {
  try {
    const res = await fetch('products.json?nocache=' + Date.now());
    if (!res.ok) throw new Error('Ошибка загрузки JSON');
    PRODUCTS = await res.json();
    renderProducts(PRODUCTS);
  } catch (err) {
    console.error('Ошибка загрузки продуктов:', err);
    grid.innerHTML = `<p style="color:red;">Не удалось загрузить продукты</p>`;
  }
}

function renderProducts(items) {
  grid.innerHTML = '';

  if (!items || items.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#666;">Нет товаров</p>';
    return;
  }

  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
    `;
    grid.appendChild(card);
  });
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const active = document.querySelector('.cat.active');
  const cat = active ? active.dataset.cat : 'all';

  let filtered = PRODUCTS;
  if (cat !== 'all') {
    filtered = filtered.filter(p => (p.cat || '').toLowerCase() === cat);
  }
  if (q) {
    filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(q));
  }
  renderProducts(filtered);
}

catsWrap.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.cat');
  if (!btn) return;
  document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
});

searchInput.addEventListener('input', applyFilters);

loadProducts();
