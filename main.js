document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCountElement = document.getElementById('cart-count');

    // Функция для обновления счетчика корзины
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cartItems.length;
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    // Инициализация счетчика при загрузке страницы
    updateCartCount();

    // Добавление товара в корзину
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const product = this.getAttribute('data-product');
            const price = this.parentElement.querySelector('p').textContent.split('$')[1];
            
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            cartItems.push({ product, price });
            localStorage.setItem('cart', JSON.stringify(cartItems));

            alert(`${product} добавлен в корзину!`);
            updateCartCount();
        });
    });

    // Отображение товаров в корзине на странице cart.html
    if (window.location.pathname.includes('cart.html')) {
        const cartList = document.getElementById('cart-list');
        const totalPriceElement = document.getElementById('total-price');
        let totalPrice = 0;

        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (cartItems.length === 0) {
            cartList.innerHTML = '<p class="text-center">Ваша корзина пуста.</p>';
        } else {
            cartItems.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item', 'col-md-12', 'p-3', 'bg-white', 'rounded', 'shadow-sm');
                cartItemDiv.innerHTML = `
                    <p class="m-0">${item.product} - $${item.price}</p>
                `;
                cartList.appendChild(cartItemDiv);
                totalPrice += parseFloat(item.price);
            });

            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }

        updateCartCount();

        // Обработка формы оплаты
        const paymentForm = document.getElementById('payment-form');
        const paymentMessage = document.getElementById('payment-message');

        paymentForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
            const cardHolder = document.getElementById('card-holder').value.trim();
            const expiryDate = document.getElementById('expiry-date').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            if (
                cardNumber.length !== 16 ||
                cardHolder === '' ||
                !/^\d{2}\/\d{2}$/.test(expiryDate) ||
                cvv.length !== 3
            ) {
                paymentMessage.textContent = 'Ошибка: Проверьте введенные данные.';
                paymentMessage.style.color = '#e74c3c';
            } else {
                paymentMessage.textContent = 'Оплата прошла успешно!';
                paymentMessage.style.color = '#2ecc71';

                // Обновление статистики
                updatePurchaseStats(cartItems, totalPrice);

                // Очистка корзины
                localStorage.removeItem('cart');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        });
    }

    // Функция для обновления статистики покупок
    function updatePurchaseStats(cartItems, totalPrice) {
        const stats = JSON.parse(localStorage.getItem('purchaseStats')) || {
            totalPurchases: 0,
            totalSpent: 0,
            mostPurchased: {}
        };

        stats.totalPurchases += 1;
        stats.totalSpent += totalPrice;

        cartItems.forEach(item => {
            if (!stats.mostPurchased[item.product]) {
                stats.mostPurchased[item.product] = 0;
            }
            stats.mostPurchased[item.product] += 1;
        });

        localStorage.setItem('purchaseStats', JSON.stringify(stats));
    }

    // Отображение статистики на главной странице
    if (window.location.pathname.includes('index.html')) {
        const stats = JSON.parse(localStorage.getItem('purchaseStats')) || {
            totalPurchases: 0,
            totalSpent: 0,
            mostPurchased: {}
        };

        let mostPurchasedProduct = 'Нет данных';
        let maxCount = 0;
        for (const [product, count] of Object.entries(stats.mostPurchased)) {
            if (count > maxCount) {
                mostPurchasedProduct = product;
                maxCount = count;
            }
        }

        const statsContainer = document.createElement('div');
        statsContainer.classList.add('container', 'mt-4');
        statsContainer.innerHTML = `
            <h3 class="text-center mb-4">Статистика покупок</h3>
            <table class="table table-bordered table-striped bg-white">
                <thead>
                    <tr>
                        <th scope="col"><i class="fas fa-shopping-cart me-2"></i>Показатель</th>
                        <th scope="col"><i class="fas fa-chart-bar me-2"></i>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><i class="fas fa-box-open me-2"></i>Общее количество покупок</td>
                        <td>${stats.totalPurchases}</td>
                    </tr>
                    <tr>
                        <td><i class="fas fa-dollar-sign me-2 text-danger"></i>Общая сумма потраченных денег</td>
                        <td class="text-danger">$${stats.totalSpent.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><i class="fas fa-star me-2 text-warning"></i>Самый часто покупаемый товар</td>
                        <td>${mostPurchasedProduct}</td>
                    </tr>
                </tbody>
            </table>
        `;

        document.body.appendChild(statsContainer);
    }
});