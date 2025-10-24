// script.js
// Загрузка товаров из products.json, фильтрация по категориям и поиску.
// Внешний Telegram WebApp объект используется, если есть (не обязателен).

const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

// if inside Telegram — expand view (best effort)
try { tg && tg.expand && tg.expand(); } catch(e){/* ignore */}

// элементы
const grid = document.getElementById('grid');
const searchInput = document.getElementById('search');
const catsWrap = document.getElementById('cats');

let PRODUCTS = [];

// Загрузка JSON с cache-bust и fallback
async function loadProducts() {
  try {
    const res = await fetch('products.json?nocache=' + Date.now());
    if(!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    PRODUCTS = Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Не удалось загрузить products.json, используем встроенный fallback.', err);
    PRODUCTS = [
      { name: "Pizza", price: 699, image: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png", cat: "fast" },
      { name: "Burger", price: 349, image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", cat: "fast" },
      { name: "Sandwich", price: 299, image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", cat: "fast" },
      { name: "Hot Dog", price: 299, image: "https://cdn-icons-png.flaticon.com/512/1404/1404947.png", cat: "fast" }
    ];
  }
  renderProducts(PRODUCTS);
}

function renderProducts(items){
  grid.innerHTML = '';
  if(!items || items.length === 0){
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#6b7280;padding:30px 8px">No items found</div>';
    return;
  }

  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="badge" style="display:${p.rating? 'inline-block':'none'}">${p.rating||''}</div>
      <div class="img-wrap">
        <img src="${p.image || ''}" alt="${escapeHtml(p.name)}" onerror="this.onerror=null;this.src='https://via.placeholder.com/72?text=No';">
      </div>
      <div class="info">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">${p.price} ₽</div>
      </div>
    `;

    // карточка кликабельна (если нужно для Telegram - отправляет данные)
    card.addEventListener('click', () => {
      // отправляем выбранный товар боту через tg.sendData если доступно
      if(tg && tg.sendData){
        try {
          tg.sendData(JSON.stringify(p));
        } catch(e){ console.warn('tg.sendData error', e); }
      } else {
        // если не в Telegram, можно временно показать превью (alert)
        // alert(`${p.name} — ${p.price} ₽`);
      }
    });

    grid.appendChild(card);
  });
}

// категории
catsWrap.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.cat');
  if(!btn) return;
  document.querySelectorAll('.cat').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  const cat = btn.dataset.cat;
  applyFilters();
});

// поиск
searchInput.addEventListener('input', () => {
  applyFilters();
});

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const active = document.querySelector('.cat.active');
  const cat = active ? active.dataset.cat : 'all';

  let filtered = PRODUCTS.slice();
  if(cat !== 'all'){
    filtered = filtered.filter(p => (p.cat || '').toLowerCase() === cat);
  }
  if(q){
    filtered = filtered.filter(p => (p.name||'').toLowerCase().includes(q));
  }
  renderProducts(filtered);
}

// помощник защиты от XSS
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}

loadProducts();
