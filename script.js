let dishes = [];
let isAdmin = false;
const adminPassword = "1234"; // простой пример

// Загружаем JSON
fetch('dishes.json')
    .then(response => response.json())
    .then(data => {
        dishes = data;
        showMenu();
    });

// Отображение меню для пользователей
function showMenu() {
    const menu = document.getElementById('menu');
    menu.innerHTML = '';
    const query = document.getElementById('search').value.toLowerCase();
    dishes.forEach(dish => {
        if (dish.enabled && dish.name.toLowerCase().includes(query)) {
            const div = document.createElement('div');
            div.textContent = `${dish.name} — ${dish.price}₽`;
            menu.appendChild(div);
        }
    });
}

// Поиск
document.getElementById('search').addEventListener('input', showMenu);

// Вход в админку
document.getElementById('adminLogin').addEventListener('click', () => {
    const password = document.getElementById('adminPassword').value;
    if (password === adminPassword) {
        isAdmin = true;
        document.getElementById('adminPanel').style.display = 'block';
        showAdminPanel();
    } else {
        alert("Неверный пароль!");
    }
});

// Админка
function showAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.innerHTML = '';
    dishes.forEach(dish => {
        const div = document.createElement('div');
        div.textContent = `${dish.name} — ${dish.price}₽ — ${dish.enabled ? 'Вкл' : 'Выкл'}`;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = dish.enabled ? 'Выключить' : 'Включить';
        toggleBtn.onclick = () => {
            dish.enabled = !dish.enabled;
            showAdminPanel();
            showMenu();
        };

        div.appendChild(toggleBtn);
        panel.appendChild(div);
    });
}
