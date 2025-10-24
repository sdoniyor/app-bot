const grid = document.getElementById('grid');
const searchInput = document.getElementById('search');
const catsWrap = document.getElementById('cats');
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

let PRODUCTS = [];
let ADMIN_IDS = [];
let isAdmin = false;
let currentUserId = null;

// --- Для теста без Telegram WebApp ---
currentUserId = '1837175511'; // тестовый ID админа
isAdmin = true; // сразу включаем режим админа для теста

// --- Загрузка продуктов с сервера ---
async function loadProducts() {
  try {
    const res = await fetch('/products?nocache=' + Date.now());
    if (!res.ok) throw new Error('Ошибка загрузки JSON');
    PRODUCTS = await res.json();
    renderProducts(PRODUCTS);
  } catch (err) {
    console.error('Ошибка загрузки продуктов:', err);
    grid.innerHTML = `<p style="color:red;">Не удалось загрузить продукты</p>`;
  }
}

// --- Обновление продукта (для админа) ---
async function updateProduct(index, deleted) {
  try {
    const res = await fetch('/update-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index, deleted })
    });
    const data = await res.json();
    if (data.ok) {
      await loadProducts(); // обновляем всех пользователей
    }
  } catch (err) {
    console.error('Ошибка обновления продукта:', err);
  }
}

// --- Рендер ---
function renderProducts(items) {
  grid.innerHTML = '';
  if (!items || items.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#666;">Нет товаров</p>';
    return;
  }

  items.forEach((p, index) => {
    if (p.deleted && !isAdmin) return;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" width="100%">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <div class="rating">⭐ ${p.rating || '0'}</div>
    `;

    if (isAdmin) {
      const btn = document.createElement('button');
      btn.className = p.deleted ? 'admin-btn restore' : 'admin-btn delete';
      btn.textContent = p.deleted ? 'Вернуть' : 'Удалить';
      btn.addEventListener('click', () => updateProduct(index, !p.deleted));
      card.appendChild(btn);
    }

    grid.appendChild(card);
  });
}

// --- Фильтры ---
function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const active = document.querySelector('.cat.active');
  const cat = active ? active.dataset.cat : 'all';

  let filtered = PRODUCTS;
  if (cat !== 'all') filtered = filtered.filter(p => (p.cat || '').toLowerCase() === cat);
  if (q) filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(q));

  renderProducts(filtered);
}

// --- Категории ---
catsWrap.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.cat');
  if (!btn) return;
  document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
});

searchInput.addEventListener('input', applyFilters);

// --- Тема ---
if(localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeBtn.textContent = '☀️';
} else {
  themeBtn.textContent = '🌙';
}

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

// --- Периодически обновляем продукты у всех пользователей ---
setInterval(loadProducts, 3000);

// --- Инициализация ---
loadProducts();



// const grid = document.getElementById('grid');
// const searchInput = document.getElementById('search');
// const catsWrap = document.getElementById('cats');
// const themeBtn = document.getElementById('theme-btn');
// const body = document.body;

// let PRODUCTS = [];
// let ADMIN_IDS = [];
// let isAdmin = false;
// let currentUserId = null;

// // --- Получаем ID текущего пользователя из Telegram WebApp ---
// if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
//   currentUserId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
//   console.log('currentUserId (тип: ' + typeof currentUserId + '):', currentUserId);
// } else {
//   console.log('Не в Telegram WebApp, текущий пользователь считается обычным.');
// }


// if (!window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
//   console.log('Не в Telegram WebApp, используем тестовый ID для админа');
//   currentUserId = "1837175511"; // для теста
// }
// // --- Загружаем список админов ---
// async function loadAdmins() {
//   try {
//     const res = await fetch('admins.json?nocache=' + Date.now());
//     if (!res.ok) throw new Error('Ошибка загрузки admins.json');

//     // Преобразуем все ID в строки для корректного сравнения
//     ADMIN_IDS = (await res.json()).map(id => id.toString());

//     // Проверяем, является ли текущий пользователь админом
//     if (currentUserId && ADMIN_IDS.includes(currentUserId)) {
//       isAdmin = true;
//     } else {
//       isAdmin = false;
//     }

//     console.log('ADMIN_IDS:', ADMIN_IDS);
//     console.log('isAdmin после проверки:', isAdmin);
//   } catch (err) {
//     console.error('Ошибка загрузки админов:', err);
//   }
// }

// // --- Загружаем продукты ---
// async function loadProducts() {
//   try {
//     const saved = localStorage.getItem('products');
//     if (saved) {
//       PRODUCTS = JSON.parse(saved);
//     } else {
//       const res = await fetch('products.json?nocache=' + Date.now());
//       if (!res.ok) throw new Error('Ошибка загрузки products.json');
//       PRODUCTS = await res.json();
//     }
//     renderProducts(PRODUCTS);
//   } catch (err) {
//     console.error('Ошибка загрузки продуктов:', err);
//     grid.innerHTML = `<p style="color:red;">Не удалось загрузить продукты</p>`;
//   }
// }

// // --- Отрисовка продуктов ---
// function renderProducts(items) {
//   grid.innerHTML = '';

//   if (!items || items.length === 0) {
//     grid.innerHTML = '<p style="text-align:center;color:#666;">Нет товаров</p>';
//     return;
//   }

//   items.forEach((p, index) => {
//     // Скрываем удалённые товары для обычных пользователей
//     if (p.deleted && !isAdmin) return;

//     const card = document.createElement('div');
//     card.className = 'card';
//     card.innerHTML = `
//       <img src="${p.image}" alt="${p.name}" width="100%">
//       <h3>${p.name}</h3>
//       <p>${p.price} ₽</p>
//       <div class="rating">⭐ ${p.rating || '0'}</div>
//     `;

//     // --- Кнопка только для админов ---
//     if (isAdmin) {
//       const btn = document.createElement('button');
//       btn.className = p.deleted ? 'admin-btn restore' : 'admin-btn delete';
//       btn.textContent = p.deleted ? 'Вернуть' : 'Удалить';
//       btn.addEventListener('click', () => {
//         PRODUCTS[index].deleted = !PRODUCTS[index].deleted;
//         localStorage.setItem('products', JSON.stringify(PRODUCTS));
//         renderProducts(PRODUCTS);
//       });
//       card.appendChild(btn);
//     }

//     grid.appendChild(card);
//   });
// }

// // --- Фильтры ---
// function applyFilters() {
//   const q = searchInput.value.trim().toLowerCase();
//   const active = document.querySelector('.cat.active');
//   const cat = active ? active.dataset.cat : 'all';

//   let filtered = PRODUCTS;
//   if (cat !== 'all') filtered = filtered.filter(p => (p.cat || '').toLowerCase() === cat);
//   if (q) filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(q));

//   renderProducts(filtered);
// }

// // --- Категории ---
// catsWrap.addEventListener('click', (ev) => {
//   const btn = ev.target.closest('.cat');
//   if (!btn) return;
//   document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
//   btn.classList.add('active');
//   applyFilters();
// });

// searchInput.addEventListener('input', applyFilters);

// // --- Тема ---
// if(localStorage.getItem('theme') === 'dark') {
//   body.classList.add('dark');
//   themeBtn.textContent = '☀️';
// } else {
//   themeBtn.textContent = '🌙';
// }

// themeBtn.addEventListener('click', () => {
//   body.classList.toggle('dark');
//   if(body.classList.contains('dark')) {
//     themeBtn.textContent = '☀️';
//     localStorage.setItem('theme', 'dark');
//   } else {
//     themeBtn.textContent = '🌙';
//     localStorage.setItem('theme', 'light');
//   }
// });

// // --- Инициализация ---
// async function init() {
//   await loadAdmins();
//   await loadProducts();
// }

// init();
