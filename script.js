document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'https://fakestoreapi.com';
    const categoryDropdown = document.getElementById('categoryDropdown');
    const productList = document.getElementById('product-list');
    const productDetail = document.getElementById('product-detail');
    const cartSection = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    // Cargar carrito desde localStorage o inicializar como vacío
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Actualizar el conteo del carrito
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Guardar carrito en localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Delegar evento de clic al elemento padre categoryDropdown
    categoryDropdown.addEventListener('click', function(event) {
        if (event.target.classList.contains('dropdown-item')) {
            event.preventDefault();
            const category = event.target.dataset.category;
            fetchProductsByCategory(category);
        }
    });

    // Fetch products by category
    function fetchProductsByCategory(category) {
        productDetail.classList.add('hidden');
        productList.innerHTML = ''; // Limpiar la lista de productos antes de cargar nuevos productos

        // Si la categoría es "all", mostramos todos los productos
        const apiUrl = category === 'all' ? `${API_URL}/products` : `${API_URL}/products/category/${category}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(products => {
                displayProducts(products);
            })
            .catch(error => {
                console.error('Error al obtener productos:', error);
            });
    }

    // Mostrar los productos en la página
    function displayProducts(products) {
        products.forEach(product => {
            const col = document.createElement('div');
            col.classList.add('col-md-4', 'mb-4');
            const card = document.createElement('div');
            card.classList.add('card', 'h-100');
            const img = document.createElement('img');
            img.src = product.image;
            img.classList.add('card-img-top', 'product-img');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            const h5 = document.createElement('h5');
            h5.classList.add('card-title');
            h5.textContent = product.title;
            const p = document.createElement('p');
            p.classList.add('card-text');
            p.textContent = `Precio: $${product.price}`;
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary');
            button.textContent = 'Ver Detalle';
            button.addEventListener('click', () => {
                showProductDetail(product);
            });
            cardBody.appendChild(h5);
            cardBody.appendChild(p);
            cardBody.appendChild(button);
            card.appendChild(img);
            card.appendChild(cardBody);
            col.appendChild(card);
            productList.appendChild(col);
        });
    }

    // Mostrar detalles del producto
    function showProductDetail(product) {
        productList.innerHTML = '';
        productDetail.classList.remove('hidden');
        productDetail.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h2 class="card-title">${product.title}</h2>
                    <img src="${product.image}" alt="${product.title}" class="card-img-top mb-3 product-img">
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Precio: $${product.price}</p>
                    <button id="add-to-cart" class="btn btn-success">Agregar al Carrito</button>
                    <a href="index.html"><button id="add-to-cart" class="btn btn-danger">Cancelar</button></a>
                </div>
            </div>
        `;
        document.getElementById('add-to-cart').addEventListener('click', () => {
            addToCart(product);
        });
    }

    // Agregar producto al carrito
    function addToCart(product) {
        cart.push(product);
        saveCart();
        updateCartCount();
        alert('Producto agregado al carrito');
    }

    // Mostrar todos los productos al cargar la página
    fetchProductsByCategory('all');

    // Inicializar el conteo del carrito al cargar la página
    updateCartCount();
});
