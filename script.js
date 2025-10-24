const tg = window.Telegram.WebApp;

// Инициализация Telegram WebApp
tg.expand();
tg.MainButton.hide();

async function loadProducts() {
  console.log('Загрузка товаров...');
  try {
    const res = await fetch('products.json?v=1');
    const products = await res.json();
    console.log('✅ Загружено:', products);
    renderProducts(products);
  } catch (e) {
    console.error('❌ Ошибка при загрузке:', e);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">₹${p.price}</div>
      <button class="addBtn">Выбрать</button>
    `;

    // При нажатии — показать кнопку Telegram "Добавить"
    const btn = card.querySelector('.addBtn');
    btn.addEventListener('click', () => {
      tg.MainButton.text = `Добавить: ${p.name}`;
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify(p)); // Отправляем товар в Telegram Bot
      });
    });

    grid.appendChild(card);
  });
}

// Поиск по товарам
document.getElementById('search').addEventListener('input', async (e) => {
  const res = await fetch('products.json');
  const products = await res.json();
  const query = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  renderProducts(filtered);
});

loadProducts();

