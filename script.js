// Пример ID администратора Telegram (замени на свой)
const ADMIN_IDS = [123456789, 987654321];
const token = '7613626026:AAGQgSJWSIL4fqGOdYKh-n4sBxIG7HwfF7U';
// Имитация данных Telegram
const telegramUser = {
  id: 123456789, // ⚠️ Тут должен подставляться реальный Telegram WebApp user.id
  name: "Админ",
};

const menuData = [
  {
    category: "Бургеры",
    items: [
      { id: 1, name: "Чизбургер", price: 250, img: "https://i.imgur.com/3XyCNyQ.png", available: true },
      { id: 2, name: "Дабл Бургер", price: 320, img: "https://i.imgur.com/5M9r0Pp.png", available: true },
    ],
  },
  {
    category: "Пицца",
    items: [
      { id: 3, name: "Пепперони", price: 260, img: "https://i.imgur.com/Vy3XJh1.png", available: true },
    ],
  },
  {
    category: "Салаты",
    items: [
      { id: 4, name: "Цезарь", price: 180, img: "https://i.imgur.com/oMoQw3I.png", available: true },
    ],
  },
];

// Проверяем localStorage (чтобы сохранялись изменения)
const savedMenu = localStorage.getItem("menuData");
if (savedMenu) {
  const parsed = JSON.parse(savedMenu);
  menuData.forEach((cat, i) => {
    cat.items = parsed[i].items;
  });
}

const menuContainer = document.getElementById("menu");
renderMenu();

function renderMenu() {
  menuContainer.innerHTML = "";
  menuData.forEach((section) => {
    const category = document.createElement("div");
    category.className = "category";

    const title = document.createElement("h2");
    title.textContent = section.category;
    category.appendChild(title);

    section.items.forEach((item) => {
      if (!item.available && !ADMIN_IDS.includes(telegramUser.id)) return;

      const div = document.createElement("div");
      div.className = "item";
      if (!item.available) div.style.opacity = "0.4";

      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="info">
          <h3>${item.name}</h3>
          <p>${item.price} ₽</p>
        </div>
      `;

      // Панель администратора
      if (ADMIN_IDS.includes(telegramUser.id)) {
        const buttons = document.createElement("div");
        buttons.className = "admin-buttons";

        const hideBtn = document.createElement("button");
        hideBtn.textContent = "Убрать";
        hideBtn.className = "hide-btn";
        hideBtn.onclick = () => toggleAvailability(item.id, false);

        const showBtn = document.createElement("button");
        showBtn.textContent = "Вернуть";
        showBtn.className = "show-btn";
        showBtn.onclick = () => toggleAvailability(item.id, true);

        buttons.append(hideBtn, showBtn);
        div.appendChild(buttons);
      }

      category.appendChild(div);
    });

    menuContainer.appendChild(category);
  });
}

function toggleAvailability(id, state) {
  menuData.forEach((cat) => {
    cat.items.forEach((item) => {
      if (item.id === id) item.available = state;
    });
  });
  localStorage.setItem("menuData", JSON.stringify(menuData));
  renderMenu();
}





