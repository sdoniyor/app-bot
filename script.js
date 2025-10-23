// Telegram WebApp API
if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

let items = [];
let hiddenItems = JSON.parse(localStorage.getItem("hiddenItems") || "[]");
let currentUserId = null;
let currentUsername = "Гость";
let currentAvatar = "https://i.imgur.com/1X5A3zM.png";
let isAdmin = false;

// Путь к GitHub Pages
const BASE = "https://sdoniyor.github.io/app-bot";
const ADMINS_URL = `${BASE}/admins.json`;
const ITEMS_URL = `${BASE}/items.json`;

async function loadData() {
  try {
    const [adminsData, itemsData] = await Promise.all([
      fetch(ADMINS_URL).then(r => r.json()),
      fetch(ITEMS_URL).then(r => r.json())
    ]);

    items = itemsData;

    // Данные Telegram пользователя
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || { id: 0, username: "guest" };
    currentUserId = tgUser.id;
    currentUsername = tgUser.username || "Без ника";
    currentAvatar = tgUser.photo_url || "https://i.imgur.com/1X5A3zM.png";

    document.getElementById("userAvatar").src = currentAvatar;

    // Проверка админа
    isAdmin = adminsData.admins.includes(currentUserId);

    render();
  } catch (e) {
    console.error("Ошибка загрузки данных:", e);
    document.getElementById("grid").innerHTML = `
      <div style="padding:20px; text-align:center;">
        ⚠️ Не удалось загрузить данные.<br>Проверь JSON и ссылки.
      </div>`;
  }
}

function render() {
  const grid = document.getElementById("grid");
  const q = document.getElementById("search").value.toLowerCase();
  grid.innerHTML = "";

  items
    .filter(i => i.name.toLowerCase().includes(q))
    .forEach(item => {
      const hidden = hiddenItems.includes(item.id);
      const visibleForUser = isAdmin || !hidden;
      if (!visibleForUser) return;

      const card = document.createElement("div");
      card.className = "card" + (hidden ? " disabled" : "");
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="title">${item.name}</div>
        <div class="price">₽${item.price}</div>
        ${
          isAdmin
            ? `<button class="hide-btn" data-id="${item.id}">
                ${hidden ? "Вернуть" : "Убрать"}
              </button>`
            : ""
        }
      `;
      grid.appendChild(card);
    });

  if (isAdmin) {
    document.querySelectorAll(".hide-btn").forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.dataset.id);
        if (hiddenItems.includes(id)) {
          hiddenItems = hiddenItems.filter(x => x !== id);
        } else {
          hiddenItems.push(id);
        }
        localStorage.setItem("hiddenItems", JSON.stringify(hiddenItems));
        render();
      };
    });
  }
}

// Показать инфо о пользователе
document.getElementById("profile").onclick = () => {
  alert(`👤 Telegram ID: ${currentUserId}\n@${currentUsername}`);
};

document.getElementById("search").oninput = render;

// Запуск
loadData();
// Telegram WebApp API
if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

let items = [];
let hiddenItems = JSON.parse(localStorage.getItem("hiddenItems") || "[]");
let currentUserId = null;
let currentUsername = "Гость";
let currentAvatar = "https://i.imgur.com/1X5A3zM.png";
let isAdmin = false;

// Путь к GitHub Pages
const BASE = "https://sdoniyor.github.io/app-bot";
const ADMINS_URL = `${BASE}/admins.json`;
const ITEMS_URL = `${BASE}/items.json`;

async function loadData() {
  try {
    const [adminsData, itemsData] = await Promise.all([
      fetch(ADMINS_URL).then(r => r.json()),
      fetch(ITEMS_URL).then(r => r.json())
    ]);

    items = itemsData;

    // Данные Telegram пользователя
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || { id: 0, username: "guest" };
    currentUserId = tgUser.id;
    currentUsername = tgUser.username || "Без ника";
    currentAvatar = tgUser.photo_url || "https://i.imgur.com/1X5A3zM.png";

    document.getElementById("userAvatar").src = currentAvatar;

    // Проверка админа
    isAdmin = adminsData.admins.includes(currentUserId);

    render();
  } catch (e) {
    console.error("Ошибка загрузки данных:", e);
    document.getElementById("grid").innerHTML = `
      <div style="padding:20px; text-align:center;">
        ⚠️ Не удалось загрузить данные.<br>Проверь JSON и ссылки.
      </div>`;
  }
}

function render() {
  const grid = document.getElementById("grid");
  const q = document.getElementById("search").value.toLowerCase();
  grid.innerHTML = "";

  items
    .filter(i => i.name.toLowerCase().includes(q))
    .forEach(item => {
      const hidden = hiddenItems.includes(item.id);
      const visibleForUser = isAdmin || !hidden;
      if (!visibleForUser) return;

      const card = document.createElement("div");
      card.className = "card" + (hidden ? " disabled" : "");
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="title">${item.name}</div>
        <div class="price">₽${item.price}</div>
        ${
          isAdmin
            ? `<button class="hide-btn" data-id="${item.id}">
                ${hidden ? "Вернуть" : "Убрать"}
              </button>`
            : ""
        }
      `;
      grid.appendChild(card);
    });

  if (isAdmin) {
    document.querySelectorAll(".hide-btn").forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.dataset.id);
        if (hiddenItems.includes(id)) {
          hiddenItems = hiddenItems.filter(x => x !== id);
        } else {
          hiddenItems.push(id);
        }
        localStorage.setItem("hiddenItems", JSON.stringify(hiddenItems));
        render();
      };
    });
  }
}

// Показать инфо о пользователе
document.getElementById("profile").onclick = () => {
  alert(`👤 Telegram ID: ${currentUserId}\n@${currentUsername}`);
};

document.getElementById("search").oninput = render;

// Запуск
loadData();
