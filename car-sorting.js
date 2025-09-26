const carsData = [
    {
        name: "TOYOTA COROLLA 2014",
        latinName: "toyota_corolla_2014",
        category: "Седаны",
        price: "900 000 ₽",
        specs: "1.5 л, 132 л.с., МКПП",
        image: "imgs/Toyota_Corolla.jpg",
        horsepower: 132,
        priceValue: 900000
    },
    {
        name: "Nissan Skyline X (R34)",
        latinName: "nissan_skyline_r34",
        category: "Седаны",
        price: "4 600 000 ₽",
        specs: "2.5 л, 200 л.с., МКПП",
        image: "imgs/Nissan_Skyline_R34_GT-R_Nür_002.jpg",
        horsepower: 200,
        priceValue: 4600000
    },
    {
        name: "Honda ZR-V Lifestyle",
        latinName: "honda_zrv_lifestyle",
        category: "Седаны",
        price: "3 218 000 ₽",
        specs: "1.5 л, 182 л.с., АКПП",
        image: "imgs/honda_zrv.jpg",
        horsepower: 182,
        priceValue: 3218000
    },
    {
        name: "Nissan PathFinder 2014",
        latinName: "nissan_pathfinder_2014",
        category: "Внедорожники",
        price: "800 000 ₽",
        specs: "3.5 л, 249 л.с., АКПП",
        image: "imgs/Pathfinder.jpg",
        horsepower: 249,
        priceValue: 800000
    },
    {
        name: "Daihatsu Rocky A200, 2020",
        latinName: "daihatsu_rocky_a200",
        category: "Внедорожники",
        price: "1 100 000 ₽",
        specs: "1.0 л, 98 л.с., АКПП",
        image: "imgs/Rocky_a200.jpg",
        horsepower: 98,
        priceValue: 1100000
    },
    {
        name: "Suzuki Grand Vitara II Рестайлинг, 2012",
        latinName: "suzuki_grand_vitara_2012",
        category: "Внедорожники",
        price: "789 000 ₽",
        specs: "2.4 л, 169 л.с., МКПП",
        image: "imgs/Suzuki_vitara.jpg",
        horsepower: 169,
        priceValue: 789000
    },
    {
        name: "SUZUKI WAGON R MH85S IAT, 2023",
        latinName: "suzuki_wagon_r_2023",
        category: "Кей-кары",
        price: "1 135 000 ₽",
        specs: "0.66 л, 64 л.с., АКПП",
        image: "imgs/Suzuki_wagon.jpg",
        horsepower: 64,
        priceValue: 1135000
    },
    {
        name: "Honda N-BOX, 2020",
        latinName: "honda_n_box_2020",
        category: "Кей-кары",
        price: "1 250 000 ₽",
        specs: "0.7 л, 58 л.с., АКПП",
        image: "imgs/Honda_N_Box.jpg",
        horsepower: 58,
        priceValue: 1250000
    },
    {
        name: "DAIHATSU TANTO X, 2024",
        latinName: "daihatsu_tanto_x_2024",
        category: "Кей-кары",
        price: "1 670 000 ₽",
        specs: "0.7 л, 52 л.с., АКПП",
        image: "imgs/Daihatsu_Tanto.jpg",
        horsepower: 52,
        priceValue: 1670000
    }
];

// Корзина для хранения выбранных автомобилей
let shoppingCart = [];
// Состояние фильтров для каждой категории
let filterState = {
    'Седаны': false,
    'Внедорожники': false,
    'Кей-кары': false
};

// Функция для создания HTML элемента автомобиля
function createCarElement(car) {
    const carElement = document.createElement('div');
    carElement.className = 'car-item';
    carElement.setAttribute('data-car', car.latinName);

    carElement.innerHTML = `
        <img src="${car.image}" alt="${car.name}">
        <p class="car-price">${car.price}</p>
        <p class="car-name">${car.name}</p>
        <p class="car-specs">${car.specs}</p>
        <button class="add-to-cart-btn" data-car='${JSON.stringify(car).replace(/'/g, "&#39;")}'>Добавить в корзину</button>
    `;

    return carElement;
}

// Функция для добавления автомобиля в корзину
function addToCart(car) {
    shoppingCart.push(car);
    updateOrderForm();
    showCartNotification(car.name);
}

// Функция для показа уведомления о добавлении в корзину
function showCartNotification(carName) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <span>✅ "${carName}" добавлен в корзину</span>
    `;

    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Функция для обновления формы заказа
function updateOrderForm() {
    const orderInfo = document.getElementById('orderInfo');
    const totalPriceElement = document.getElementById('totalPrice');
    const cartDataInput = document.getElementById('cartData');

    // Сохраняем данные корзины в скрытое поле формы
    cartDataInput.value = JSON.stringify(shoppingCart);

    if (shoppingCart.length === 0) {
        orderInfo.innerHTML = '<p class="empty-cart">Корзина пуста. Добавьте автомобили из каталога.</p>';
        totalPriceElement.textContent = '0 ₽';
        return;
    }

    let totalPrice = 0;
    let orderHTML = '<div class="cart-items">';

    shoppingCart.forEach((car, index) => {
        totalPrice += car.priceValue;
        orderHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${car.name}</strong>
                    <span class="cart-item-specs">${car.specs}</span>
                    <span class="cart-item-price">${car.price}</span>
                </div>
                <button class="remove-from-cart-btn" data-index="${index}">✕</button>
            </div>
        `;
    });

    orderHTML += '</div>';
    orderInfo.innerHTML = orderHTML;
    totalPriceElement.textContent = formatPrice(totalPrice) + ' ₽';

    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

// Функция для удаления автомобиля из корзины
function removeFromCart(index) {
    shoppingCart.splice(index, 1);
    updateOrderForm();
}

// Функция для форматирования цены
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Функция для фильтрации автомобилей по лошадиным силам
function filterCarsByHorsepower(cars, maxHorsepower = 160) {
    return cars.filter(car => car.horsepower <= maxHorsepower);
}

// Функция для создания элементов управления фильтрацией
function createFilterControls(category) {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-controls';

    const filterId = `filter-${category.replace(/\s+/g, '-').toLowerCase()}`;

    filterContainer.innerHTML = `
        <label class="filter-checkbox">
            <input type="checkbox" id="${filterId}" class="util-filter">
            <span class="checkmark"></span>
            Повышенный утиль сбор (до 160 л.с.)
        </label>
    `;

    // Обработчик для чекбокса фильтра
    const checkbox = filterContainer.querySelector('.util-filter');
    checkbox.addEventListener('change', function() {
        filterState[category] = this.checked;
        applyFiltersAndSort();
    });

    return filterContainer;
}

// Функция для применения фильтров и сортировки
function applyFiltersAndSort() {
    const mainElement = document.querySelector('main');
    const sortOrder = document.getElementById('sortOrder') ? document.getElementById('sortOrder').value : 'asc';

    // Очищаем основной контент
    mainElement.innerHTML = '';

    // Группируем автомобили по категориям
    const carsByCategory = {};
    carsData.forEach(car => {
        if (!carsByCategory[car.category]) {
            carsByCategory[car.category] = [];
        }
        carsByCategory[car.category].push(car);
    });

    // Создаем секции для каждой категории
    Object.keys(carsByCategory).forEach(category => {
        const section = document.createElement('section');
        section.className = 'cars-section';

        const heading = document.createElement('h2');
        heading.textContent = category;
        section.appendChild(heading);

        // Добавляем фильтр для категории
        const filterContainer = createFilterControls(category);
        section.appendChild(filterContainer);

        // Устанавливаем состояние чекбокса
        const checkbox = filterContainer.querySelector('.util-filter');
        checkbox.checked = filterState[category];

        const grid = document.createElement('div');
        grid.className = 'cars-grid';

        // Фильтруем автомобили если фильтр активен
        let categoryCars = [...carsByCategory[category]];
        if (filterState[category]) {
            categoryCars = filterCarsByHorsepower(categoryCars, 160);
        }

        // Сортируем автомобили
        if (sortOrder === 'asc') {
            categoryCars.sort((a, b) => a.horsepower - b.horsepower);
        } else {
            categoryCars.sort((a, b) => b.horsepower - a.horsepower);
        }

        // Добавляем автомобили в сетку
        categoryCars.forEach(car => {
            grid.appendChild(createCarElement(car));
        });

        // Если после фильтрации нет автомобилей, показываем сообщение
        if (categoryCars.length === 0) {
            const noCarsMessage = document.createElement('p');
            noCarsMessage.className = 'no-cars-message';
            noCarsMessage.textContent = 'В данной категории нет автомобилей, соответствующих фильтру';
            noCarsMessage.style.textAlign = 'center';
            noCarsMessage.style.padding = '20px';
            noCarsMessage.style.color = '#666';
            grid.appendChild(noCarsMessage);
        }

        section.appendChild(grid);
        mainElement.appendChild(section);
    });

    // Добавляем обработчики событий для кнопок "Добавить в корзину"
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function() {
                const carData = JSON.parse(this.getAttribute('data-car').replace(/&#39;/g, "'"));
                addToCart(carData);
            });
        });
    }, 100);
}

// Функция для создания элементов управления сортировкой
function createSortControls() {
    const carsSection = document.querySelector('.cars-section h2');
    if (!carsSection) return;

    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-controls';
    sortContainer.style.margin = '20px 0';
    sortContainer.style.textAlign = 'center';

    sortContainer.innerHTML = `
        <label for="sortOrder">Сортировать по лошадиным силам:</label>
        <select id="sortOrder">
            <option value="asc">По возрастанию</option>
            <option value="desc">По убыванию</option>
        </select>
        <button id="applySort">Применить сортировку</button>
    `;

    carsSection.parentNode.insertBefore(sortContainer, carsSection.nextSibling);

    // Обработчик для кнопки применения сортировки
    document.getElementById('applySort').addEventListener('click', function() {
        applyFiltersAndSort();
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Заменяем статичный контент на динамический
    applyFiltersAndSort();

    // Добавляем элементы управления сортировкой
    createSortControls();

    // Инициализируем корзину
    updateOrderForm();
});