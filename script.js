let cart = [];

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(li);
        total += item.price;
    });

    document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
}

document.querySelectorAll('.toy-item button').forEach((button) => {
    button.addEventListener('click', (event) => {
        const toyItem = event.target.parentElement;
        const toyName = toyItem.querySelector('h3').textContent;
        const toyPrice = parseFloat(toyItem.querySelector('p').textContent.replace('$', ''));

        cart.push({ name: toyName, price: toyPrice });
        updateCart();
    });
});

document.getElementById('checkout').addEventListener('click', () => {
    alert('Proceeding to checkout!');
});