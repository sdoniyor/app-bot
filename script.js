const tg = window.Telegram.WebApp;

tg.expand();
tg.MainButton.hide();

async function loadProducts() {
  try {
    const res = await fetch('products.json?nocache=' + Date.now());
    const products = await res.json();
    renderProducts(products);
  } catch (e) {
    console.error('Ошибка загрузки JSON:', e);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="info">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>
      </div>
    `;

    // При клике можно, например, подсветить товар (если захочешь в будущем)
    card.addEventListener('click', () => {
      tg.sendData(JSON.stringify(p)); // Отправляем выбранный товар в бота
    });

    grid.appendChild(card);
  });
}

document.getElementById('search').addEventListener('input', async (e) => {
  const res = await fetch('products.json');
  const products = await res.json();
  const query = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  renderProducts(filtered);
});

loadProducts();
