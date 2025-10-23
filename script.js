// Telegram WebApp API
if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

let items = [];
let hiddenItems = JSON.parse(localStorage.getItem("hiddenItems") || "[]");
let currentUserId = null;
let isAdmin = false;

// ПОЛНЫЕ URL-адреса для GitHub Pages
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

    // Получаем данные пользователя Telegram
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || { id: 0 };
    currentUserId = tgUser.id;
    console.log("Telegram user:", tgUser);

    // Проверяем админа
    isAdmin = adminsData.admins.includes(currentUserId);
    console.log("Is admin:", isAdmin);

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

document.getElementById("search").oninput = render;

// Запуск
loadData();

