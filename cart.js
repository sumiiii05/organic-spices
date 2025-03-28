document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    displayCartItems(); // Only runs on the cart page
});

// Function to update cart count in navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    let cartCountElements = document.querySelectorAll(".cart-count"); 

    cartCountElements.forEach(element => {
        element.innerText = `Cart (${totalItems})`;
    });
}

// Function to add item to cart
function addToCart(event) {
    let button = event.target;
    let name = button.getAttribute("data-name");
    let price = parseFloat(button.getAttribute("data-price"));

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// Function to display cart items on the cart page
function displayCartItems() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    let totalPriceContainer = document.getElementById("total-price");

    if (!cartContainer || !totalPriceContainer) return; // Avoid errors if not on cart page

    cartContainer.innerHTML = "";
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
        totalPriceContainer.innerText = "Total: ₹0.00";
        return;
    }

    cart.forEach((item, index) => {
        let itemRow = document.createElement("tr");
        itemRow.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                ${item.quantity}
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${index}, 1)">+</button>
            </td>
            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Remove</button></td>
        `;
        cartContainer.appendChild(itemRow);
        totalPrice += item.price * item.quantity;
    });

    totalPriceContainer.innerText = `Total: ₹${totalPrice.toFixed(2)}`;
}

// Function to update quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Function to remove item from cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Attach event listeners to all "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", addToCart);
});