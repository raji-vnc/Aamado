const PRODUCTS_API_URL = "/api/products/";
const BRANDS_API_URL = "/api/products/brands/";
const CATEGORIES_API_URL = "/api/products/categories/";
const ADD_CART_API_URL = "/api/cart/cart/add/";
const token = localStorage.getItem("accessToken");

async function loadShopProducts() {
    try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const products = await response.json();
        renderShopProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

async function loadShopFilters() {
    try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
            fetch(BRANDS_API_URL),
            fetch(CATEGORIES_API_URL)
        ]);

        if (!brandsResponse.ok || !categoriesResponse.ok) {
            throw new Error("Failed to load shop filters");
        }

        const brandsData = await brandsResponse.json();
        const categoriesData = await categoriesResponse.json();
        renderShopFilters(brandsData, categoriesData);
    } catch (error) {
        console.error("Error loading shop filters:", error);
        renderShopFilters([], []);
    }
}

function renderShopFilters(brands, categories) {
    const brandsContainer = document.getElementById("brands-list");
    const categoriesContainer = document.getElementById("categories-list");

    if (brandsContainer) {
        const brandItems = Array.isArray(brands) ? brands : (brands.results || []);
        if (brandItems.length > 0) {
            brandsContainer.innerHTML = brandItems.map((brand) => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${brand.id}" id="brand-${brand.id}">
                    <label class="form-check-label" for="brand-${brand.id}">${brand.name}</label>
                </div>
            `).join("");
        } else {
            brandsContainer.innerHTML = '<p class="mb-0">No brands available</p>';
        }
    }

    if (categoriesContainer) {
        const categoryItems = Array.isArray(categories) ? categories : (categories.results || []);
        if (categoryItems.length > 0) {
            categoriesContainer.innerHTML = categoryItems.map((category) => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${category.id}" id="category-${category.id}">
                    <label class="form-check-label" for="category-${category.id}">${category.name}</label>
                </div>
            `).join("");
        } else {
            categoriesContainer.innerHTML = '<p class="mb-0">No categories available</p>';
        }
    }
}

function renderShopProducts(products) {
    const container = document.getElementById("shop-product-container");
    if (!container) return;

    let html = "";
    
    // Support either direct array return or paginated { results: [...] } structure
    const items = Array.isArray(products) ? products : (products.results || []);

    items.forEach(product => {
        let mainImage = "/static/img/bg-img/pro-big-1.jpg";
        let hoverImage = "";
        
        if (product.images && product.images.length > 0) {
            mainImage = product.images[0].image;
            if (product.images.length > 1) {
                hoverImage = product.images[1].image;
            } else {
                hoverImage = mainImage;
            }
        } else {
            hoverImage = mainImage;
        }

        html += `
            <!-- Single Product Area -->
            <div class="col-12 col-sm-6 col-md-12 col-xl-6">
                <div class="single-product-wrapper">
                    <!-- Product Image -->
                    <div class="product-img">
                        <img src="${mainImage}" alt="${product.name}">
                        <!-- Hover Thumb -->
                        <img class="hover-img" src="${hoverImage}" alt="${product.name}">
                    </div>

                    <!-- Product Description -->
                    <div class="product-description d-flex align-items-center justify-content-between">
                        <!-- Product Meta Data -->
                        <div class="product-meta-data">
                            <div class="line"></div>
                            <p class="product-price">$${product.price}</p>
                            <a href="/product-details/?id=${product.id}">
                                <h6>${product.name}</h6>
                            </a>
                        </div>
                        <!-- Ratings & Cart -->
                        <div class="ratings-cart text-right">
                            <div class="ratings">
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                            </div>
                            <div class="cart">
                                <a href="#" class="add-to-cart-btn" data-product-id="${product.id}" data-toggle="tooltip" data-placement="left" title="Add to Cart"><img src="/static/img/core-img/cart.png" alt=""></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

async function handleAddToCartFromShop(event) {
    const btn = event.target.closest(".add-to-cart-btn");
    if (!btn) return;

    event.preventDefault();
    const productId = btn.getAttribute("data-product-id");
    
    try {
        const headers = {
            "Content-Type": "application/json"
        };
        
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        } else {
            alert("Please log in to add items to your cart.");
            return;
        }

        const response = await fetch(ADD_CART_API_URL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Your session has expired or you are not logged in. Please log in again.");
                return;
            }
            throw new Error("Failed to add to cart");
        }

        await response.json();
        alert("Product added to cart successfully!");
        
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add product to cart. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadShopProducts();
    loadShopFilters();

    // Use event delegation for dynamically added add to cart buttons
    const container = document.getElementById("shop-product-container");
    if (container) {
        container.addEventListener("click", handleAddToCartFromShop);
    }
});
