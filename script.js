const BASE = "https://sdoniyor.github.io/app-bot";
const ADMINS_URL = `${BASE}/admins.json`;
const ITEMS_URL = `${BASE}/items.json`;

if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

let items = [];
let hiddenItems = JSON.parse(localStorage.getItem("hiddenItems") || "[]");
let currentUserId = 0;
let currentUsername = "Гость";
let currentFirstName = "";
let isAdmin = false;

async function loadData() {
  try {
    const [adminsResp, itemsResp] = await Promise.all([
      fetch(ADMINS_URL),
      fetch(ITEMS_URL)
    ]);

    if (!adminsResp.ok || !itemsResp.ok) throw new Error("JSON не найден");

    const adminsData = await adminsResp.json();
    const itemsData = await itemsResp.json();

    items = itemsData;

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user || { id: 0, username: "guest" };
    currentUserId = tgUser.id;
    currentUsername = tgUser.username || "Без ника";
    currentFirstName = tgUser.first_name || "Гость";

    isAdmin = adminsData.admins.includes(currentUserId);

    renderProfile(tgUser);
    render();
  } catch (e) {
    console.error("Ошибка:", e);
    document.getElementById("grid").innerHTML =
      `<div style="padding:20px; text-align:center;">⚠️ Не удалось загрузить данные. Проверь JSON и ссылки.</div>`;
  }
}

function renderProfile(tgUser) {
  const profileDiv = document.getElementById("profile");
  const avatar = document.getElementById("userAvatar");

  // Если Telegram прислал фото — показываем
  if (tgUser.photo_url) {
    avatar.src = tgUser.photo_url;
    avatar.style.display = "block";
  } else {
    // Если нет фото, показываем первую букву имени
    avatar.style.display = "none";
    const initial = document.createElement("div");
    initial.className = "avatar-initial";
    initial.textContent = (currentFirstName[0] || "?").toUpperCase();
    profileDiv.innerHTML = "";
    profileDiv.appendChild(initial);
  }

  profileDiv.onclick = () => {
    alert(`👤 Telegram ID: ${currentUserId}\n@${currentUsername}`);
  };
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
loadData();
