const API_URL = "/api/products/";

async function loadProducts() {
    const container = document.getElementById("productContainer");
    if (!container) return;

    container.innerHTML = '<div class="col-12"><p class="text-center">Loading products...</p></div>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();
        const items = Array.isArray(products) ? products : (products.results || []);
        displayProducts(items);
    } catch (error) {
        console.error("Error loading products:", error);
        container.innerHTML = '<div class="col-12"><p class="text-center">Unable to load products right now.</p></div>';
    }
}

function displayProducts(products) {
    const container = document.getElementById("productContainer");
    if (!container) return;

    container.innerHTML = "";

    products.forEach((product) => {
        const imageUrl = product.images && product.images.length > 0 ? product.images[0].image : '/static/img/bg-img/1.jpg';

        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-md-4";
        card.innerHTML = `
            <div class="single-products-catagory clearfix">
                <a href="/product-details/?id=${product.id}">
                    <img src="${imageUrl}" alt="${product.name}">
                    <div class="hover-content">
                        <div class="line"></div>
                        <p>₹${product.price}</p>
                        <h4>${product.name}</h4>
                    </div>
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", loadProducts);