const CART_API_URL = "/api/cart/cart/";
// Get token if you have implemented JWT auth
const token = localStorage.getItem("accessToken");

async function loadCart() {
    try {
        const headers = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch(CART_API_URL, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.warn("User not authenticated. Please log in.");
                const container = document.getElementById("cart-items-container");
                if (container) {
                    container.innerHTML = `<tr><td colspan="5" class="text-center">Please log in to view your cart.</td></tr>`;
                }
            }
            throw new Error("Failed to fetch cart");
        }

        const cart = await response.json();
        displayCart(cart);

    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

function displayCart(cart) {
    const container = document.getElementById("cart-items-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    let subtotal = 0;
    
    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>`;
        updateCartTotal(0);
        return;
    }

    cart.items.forEach((item, index) => {
        const product = item.product;
        // Fallback to static image if product has no images
        const imageUrl = product.images && product.images.length > 0 ? product.images[0].image : '/static/img/bg-img/cart1.jpg';
        const itemSubtotal = item.subtotal || (product.price * item.quantity);
        subtotal += itemSubtotal;
        
        container.innerHTML += `
            <tr>
                <td class="cart_product_img">
                    <a href="product-details.html?id=${product.id}"><img src="${imageUrl}" alt="${product.name}"></a>
                </td>
                <td class="cart_product_desc">
                    <h5>${product.name}</h5>
                </td>
                <td class="price">
                    <span>$${product.price}</span>
                </td>
                <td class="qty">
                    <div class="qty-btn d-flex">
                        <p>Qty</p>
                        <div class="quantity">
                            <span class="qty-minus" onclick="var effect = document.getElementById('qty${index}'); var qty = effect.value; if( !isNaN( qty ) && qty > 1 ) effect.value--; return false;"><i class="fa fa-minus" aria-hidden="true"></i></span>
                            <input type="number" class="qty-text" id="qty${index}" step="1" min="1" max="300" name="quantity" value="${item.quantity}">
                            <span class="qty-plus" onclick="var effect = document.getElementById('qty${index}'); var qty = effect.value; if( !isNaN( qty )) effect.value++; return false;"><i class="fa fa-plus" aria-hidden="true"></i></span>
                        </div>
                    </div>
                </td>
                <td class="remove">
                    <a href="#" class="remove-item-btn" style="color: #626262; font-size: 20px;" data-id="${item.id}"><i class="fa fa-trash" aria-hidden="true"></i></a>
                </td>
            </tr>
        `;
    });
    
    updateCartTotal(subtotal);
}

function updateCartTotal(subtotal) {
    const subtotalEl = document.getElementById("cart-subtotal");
    const totalEl = document.getElementById("cart-total");
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    // Event delegation for remove buttons
    const container = document.getElementById("cart-items-container");
    if (container) {
        container.addEventListener("click", async function(e) {
            const removeBtn = e.target.closest('.remove-item-btn');
            if (removeBtn) {
                e.preventDefault();
                
                const itemId = removeBtn.getAttribute('data-id');
                if (!itemId) return;

                try {
                    const headers = {
                        "Content-Type": "application/json"
                    };
                    if (token) {
                        headers["Authorization"] = `Bearer ${token}`;
                    }

                    const response = await fetch(`/api/cart/cart/remove/${itemId}/`, { 
                        method: 'DELETE', 
                        headers: headers 
                    });

                    if (!response.ok) {
                        throw new Error("Failed to remove item");
                    }

                    // Remove row from DOM
                    removeBtn.closest('tr').remove();
                    
                    // Recalculate Subtotal
                    let newSubtotal = 0;
                    const rows = container.querySelectorAll('tr');
                    
                    if (rows.length === 0 || (rows.length === 1 && rows[0].querySelector('td[colspan="5"]'))) {
                        container.innerHTML = `<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>`;
                    } else {
                        rows.forEach(row => {
                            const priceText = row.querySelector('.price span').textContent.replace('$', '');
                            const qtyInput = row.querySelector('.quantity input');
                            if (priceText && qtyInput) {
                                newSubtotal += (parseFloat(priceText) * parseInt(qtyInput.value));
                            }
                        });
                    }
                    
                    updateCartTotal(newSubtotal);

                } catch (error) {
                    console.error("Error removing item:", error);
                    alert("Could not remove item from cart.");
                }
            }
        });
    }
});
