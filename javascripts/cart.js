renderCart();

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function renderCart() {
  let container = document.querySelector(".cartList");
  let totalPrice = document.querySelector(".totalPrice");
  let productCnt = document.querySelector(".productCnt");

  let cart = getCart();

  container.innerHTML = "";

  if (productCnt) {
    productCnt.innerHTML = cart.length;
  }

  if (cart.length == 0) {
    container.innerHTML = '<p class="emptyCart">Корзина пуста</p>';
    totalPrice.innerHTML = "";
    return;
  }

  let total = 0;

  cart.forEach((product) => {
    let quantity = product.quantity || 1;
    let price = quantity * (product.price || 0);

    total += price;

    let itemCard = document.createElement("div");
    itemCard.classList.add("itemCard");

    itemCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      
      <div class="cartItemText">
        <p>${product.name}</p>
        <p>${product.price} руб. за 1 шт.</p>
      </div>

      <p>${quantity} шт.</p>

      <button onclick="removeFromCart(${product.id})">×</button>
    `;

    container.appendChild(itemCard);
  });

  totalPrice.innerHTML = `Итого: ${total} руб.`;
}

function removeFromCart(productId) {
  let cart = getCart();

  cart = cart.filter((product) => product.id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
}
