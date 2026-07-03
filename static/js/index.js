
const container = document.getElementById("product-container");

async function loadProducts() {

    const response = await fetch("/api/products/products/");

    const products = await response.json();

    console.log(products);

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
        <div class="single-products-catagory clearfix">

            <a href="/product-details/?id=${product.id}">

                <img src="${product.images[0].image}" alt="${product.name}">

                <div class="hover-content">

                    <div class="line"></div>

                    <p>₹${product.price}</p>

                    <h4>${product.name}</h4>

                </div>

            </a>

        </div>
        `;

    });

}

loadProducts();