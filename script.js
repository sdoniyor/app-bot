const grid = document.getElementById('grid');
const searchInput = document.getElementById('search');
const catsWrap = document.getElementById('cats');
let PRODUCTS = [];

// === Загрузка продуктов из JSON ===
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

// === Отрисовка продуктов ===
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
      <div class="rating">⭐ ${p.rating || '0'}</div>
    `;
    grid.appendChild(card);
  });
}

// === Фильтры ===
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

// === Загрузка продуктов при старте ===
loadProducts();

// === Тема светлая / тёмная ===
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

// Проверка сохраненной темы
if(localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeBtn.textContent = '☀️';
} else {
  themeBtn.textContent = '🌙';
}

// Переключение темы
themeBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  if(body.classList.contains('dark')) {
    themeBtn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    themeBtn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
});
