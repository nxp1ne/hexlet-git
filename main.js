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
            cartList.innerHTML = '<p>Ваша корзина пуста.</p>';
        } else {
            cartItems.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <p>${item.product} - $${item.price}</p>
                `;
                cartList.appendChild(cartItemDiv);
                totalPrice += parseFloat(item.price);
            });

            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }

        updateCartCount();
    }
});