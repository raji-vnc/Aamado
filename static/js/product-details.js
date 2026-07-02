const PRODUCTS_API_URL = "/api/products/";
const ADD_CART_API_URL = "/api/cart/cart/add/";
const token = localStorage.getItem("accessToken");

async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch(`${PRODUCTS_API_URL}${productId}/`);
        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }
        
        const product = await response.json();
        renderProduct(product);
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderProduct(product) {
    const nameEl = document.getElementById("product-name");
    const priceEl = document.getElementById("product-price");
    const descEl = document.getElementById("product-desc");
    const fallbackProduct = {
        name: "Sample Modern Chair",
        price: 89.99,
        description: "A stylish chair designed for comfort and modern interiors."
    };
    const safeProduct = product || fallbackProduct;
    
    if (nameEl) nameEl.textContent = safeProduct.name || fallbackProduct.name;
    if (priceEl) priceEl.textContent = `$${safeProduct.price || fallbackProduct.price}`;
    if (descEl) descEl.innerHTML = safeProduct.description || fallbackProduct.description;
    
    // Breadcrumbs update
    const breadcrumbActive = document.querySelector(".breadcrumb-item.active");
    if (breadcrumbActive && safeProduct.name) {
        breadcrumbActive.textContent = safeProduct.name;
    }

    // Render Images in the Carousel
    const indicatorsContainer = document.getElementById("product-slider-indicators");
    const innerContainer = document.getElementById("product-slider-inner");
    
    if (indicatorsContainer && innerContainer) {
        let indicatorsHtml = "";
        let innerHtml = "";
        
        if (safeProduct.images && safeProduct.images.length > 0) {
            safeProduct.images.forEach((imgObj, index) => {
                const isActive = index === 0 ? "active" : "";
                const imageUrl = imgObj.image;
                
                indicatorsHtml += `
                    <li class="${isActive}" data-target="#product_details_slider" data-slide-to="${index}" style="background-image: url(${imageUrl});">
                    </li>
                `;
                
                innerHtml += `
                    <div class="carousel-item ${isActive}">
                        <a class="gallery_img" href="${imageUrl}">
                            <img class="d-block w-100" src="${imageUrl}" alt="Slide ${index+1}">
                        </a>
                    </div>
                `;
            });
        } else {
            // Fallback image if no images provided
            const fallbackUrl = '/static/img/bg-img/pro-big-1.jpg';
            indicatorsHtml = `<li class="active" data-target="#product_details_slider" data-slide-to="0" style="background-image: url(${fallbackUrl});"></li>`;
            innerHtml = `
                <div class="carousel-item active">
                    <a class="gallery_img" href="${fallbackUrl}">
                        <img class="d-block w-100" src="${fallbackUrl}" alt="Fallback slide">
                    </a>
                </div>
            `;
        }
        
        indicatorsContainer.innerHTML = indicatorsHtml;
        innerContainer.innerHTML = innerHtml;
    }
}

async function handleAddToCart(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) return;
    
    const qtyInput = document.getElementById("qty");
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

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
                quantity: quantity
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Your session has expired or you are not logged in. Please log in again.");
                return;
            }
            throw new Error("Failed to add to cart");
        }

        const data = await response.json();
        alert("Product added to cart successfully!");
        
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add product to cart. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadProductDetails();
    
    const addToCartForm = document.getElementById("add-to-cart-form");
    if (addToCartForm) {
        addToCartForm.addEventListener("submit", handleAddToCart);
    }
});
