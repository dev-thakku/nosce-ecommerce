if (document.querySelectorAll('tbody[data-cart]')[0]) {
  console.log('here');
  renderCart();
}

addEvents();

updateCartCount();

function addEvents() {
  const addToCartBtns = document.querySelectorAll('[data-btn-add-to-cart]');
  const removeFromCartBtns = document.querySelectorAll('[data-btn-remove]');

  addToCartBtns.forEach((btn) =>
    btn.addEventListener('click', (e) => {
      add(e.target.parentElement);
    })
  );

  removeFromCartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      remove(e.target.parentElement);
      console.log('here');
    });
  });
}

function incrementCount(button) {
  const name =
    button.parentElement.parentElement.children[0].children[0].children[1]
      .children[0].innerText;
  const count = parseInt(button.parentElement.children[1].innerText);
  if (count > 15) return;
  Product.updateCount(name, count + 1);

  renderCart();
}

function decrementCount(button) {
  const name =
    button.parentElement.parentElement.children[0].children[0].children[1]
      .children[0].innerText;
  const count = parseInt(button.parentElement.children[1].innerText);
  if (count <= 1) {
    Product.removeFromCart(name);
    renderCart();
    updateCartCount();
    return;
  }
  Product.updateCount(name, count - 1);

  renderCart();
}

function renderCart() {
  const tbody = document.querySelectorAll('tbody[data-cart]')[0];
  const checkoutBtn = document.querySelector('[data-btn-checkout]');
  tbody.innerHTML = '';
  const items = getAllItems();

  if (items.length == 0) {
    const billWrapper = document.querySelector('[data-bill-wrapper]');

    billWrapper.innerHTML = '';
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No items in cart</td></tr>`;
    checkoutBtn.style.display = 'none';
  } else {
    items.forEach((item) => {
      tbody.innerHTML += createCartItem(item);
    });
    calculateTotal();
  }

  addEvents();
}

function calculateTotal() {
  const subTotalDiv = document.querySelector('[data-subtotal]');
  const TotalDiv = document.querySelector('[data-total]');
  const items = getAllItems();
  let subtotal = 0;
  items.forEach((item) => {
    subtotal += parseFloat(item.price.replace('$', '')) * item.count;
  });

  console.log(subtotal);

  subTotalDiv.innerText = `$${parseFloat(subtotal).toFixed(2)}`;

  let total = subtotal + 10;

  TotalDiv.innerText = `$${parseFloat(total).toFixed(2)}`;
}

function add(parent) {
  let name = parent.children[1].innerText;
  let img = parent.children[0].children[0].src;
  let price = parent.children[3].innerText;

  const product = new Product({ name, img, price });
  product.addToCart();
  updateCartCount();
}

function remove(parent) {
  let name = parent.children[0].innerText;
  console.log(name);

  Product.removeFromCart(name);
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const countDot = document.querySelector('[data-cart-count]');

  countDot.innerText = localStorage.length;
}

function createCartItem(item) {
  let price = parseFloat(item.price.replace('$', '')).toFixed(2);
  return `
  <tr>
        <td>
            <div class="cart-info">
                <img src="${item.img}" alt="" />
                <div>
                    <p>${item.name}</p>
                    <small>Price: ${item.price}</small>
                    <br />
                    <a data-btn-remove>Remove</a>
                </div>
            </div>
        </td>
        <td>
          <!--<input type="number" value="${item.count}" data-input-count/> --!>
          <button class="count-btn" onclick="decrementCount(this)">-</button>
          <span>${item.count}</span>
          <button class="count-btn" onclick="incrementCount(this)">+</button>
        </td>
        <td>$${parseFloat(price * item.count).toFixed(2)}</td>
    </tr>
  
 `;
}

class Product {
  constructor({ name, price, img }) {
    this.name = name;
    this.price = price;
    this.img = img;
  }

  getCartCount() {
    return localStorage.length;
  }

  addToCart() {
    let count = 1;
    let item = JSON.parse(localStorage.getItem(this.name));

    if (item) {
      count = parseFloat(item.count) + 1;
      console.log(item);
    }

    localStorage.setItem(
      this.name,
      JSON.stringify({
        name: this.name,
        price: this.price,
        img: this.img,
        count,
      })
    );
  }

  static removeFromCart(name) {
    console.log(name);
    localStorage.removeItem(name);
  }

  static updateCount(name, count) {
    let item = JSON.parse(localStorage.getItem(name));

    item.count = count;
    localStorage.setItem(name, JSON.stringify(item));
  }
}

function getAllItems() {
  var items = []; // Notice change here
  (keys = Object.keys(localStorage)), (i = keys.length);

  while (i--) {
    items.push(JSON.parse(localStorage.getItem(keys[i])));
  }

  return items;
}
