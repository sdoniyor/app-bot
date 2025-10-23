if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

let currentUserId = null;
let isAdmin = false;
let items = [];
let hiddenItems = JSON.parse(localStorage.getItem("hiddenItems") || "[]");

// Загружаем список админов и товаров
Promise.all([
  fetch("./admins.json").then(r => r.json()),
  fetch("./items.json").then(r => r.json())
]).then(([adminsData, itemsData]) => {
  items = itemsData;

  // Получаем ID пользователя из Telegram
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (tgUser) {
    currentUserId = tgUser.id;
  }

  // Проверяем, админ ли он
  if (adminsData.admins.includes(currentUserId)) {
    isAdmin = true;
  }

  render();
});

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

