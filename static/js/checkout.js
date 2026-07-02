const CART_API_URL = "http://127.0.0.1:8000/api/cart/cart/";
const SHIPPING_API_URL = "http://127.0.0.1:8000/api/cart/shipping-addresses/";

// Get token if you have implemented JWT auth
const token = localStorage.getItem("accessToken");

async function loadCheckoutCart() {
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
            console.warn("Could not load cart for checkout.");
            return;
        }

        const cart = await response.json();
        
        let subtotal = 0;
        if (cart.items && cart.items.length > 0) {
            cart.items.forEach(item => {
                const product = item.product;
                const itemSubtotal = item.subtotal || (product.price * item.quantity);
                subtotal += itemSubtotal;
            });
        }
        
        updateCheckoutTotal(subtotal);

    } catch (error) {
        console.error("Error loading cart for checkout:", error);
    }
}

function updateCheckoutTotal(subtotal) {
    const subtotalEl = document.getElementById("checkout-subtotal");
    const totalEl = document.getElementById("checkout-total");
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

async function handleCheckout(event) {
    event.preventDefault();
    
    const form = document.getElementById("checkout-form");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    
    // Construct the payload for ShippingAddress based on the model fields
    const payload = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        country: formData.get("country"),
        city: formData.get("city"),
        zip_code: formData.get("zip_code"),
        address: formData.get("address")
    };

    try {
        const headers = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Post to shipping-addresses API
        const response = await fetch(SHIPPING_API_URL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Please log in to checkout.");
                return;
            }
            throw new Error("Failed to save shipping address");
        }

        const data = await response.json();
        const shippingAddressId = data.id;
        console.log("Shipping address saved:", data);
        
        // Now create the Order
        const orderResponse = await fetch("http://127.0.0.1:8000/api/orders/create/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                shipping_address_id: shippingAddressId
            })
        });

        if (!orderResponse.ok) {
            throw new Error("Failed to create order");
        }
        
        const orderData = await orderResponse.json();
        
        alert(`Checkout successful! Your order (${orderData.order_id}) is being processed.`);
        window.location.href = "index.html"; // Redirect to home page

    } catch (error) {
        console.error("Error during checkout:", error);
        alert("There was an error processing your checkout. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Load cart totals
    loadCheckoutCart();

    // Attach click listener to checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", handleCheckout);
    }
});
