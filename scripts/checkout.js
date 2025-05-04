import { cart, removeFromCart} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";
let paymentSummaryHTML = "";
let productsCost = 0;
let CostBeforeTax = 0;
let price = 0;
let cartQuantity = 0;
let shippingFee = 0;

hello();

cart.forEach((cartItem) => {
  let matchingProduct;
  cartQuantity += cartItem.quantity;
  const productId = cartItem.productId;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  price = formatCurrency(matchingProduct.priceCents);
  const price1 = cartItem.quantity * price;
  productsCost += price1;

  const priceBeforeTax = shippingFee + productsCost;
  const tax = priceBeforeTax * 0.1;
  const priceAfterTax = priceBeforeTax + tax;

  cartSummaryHTML += `
       <div class="cart-item-container
       js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${
                      cartItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-button">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-button"
                  data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${productId}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${productId}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${productId}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

  paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${productsCost}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${shippingFee}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${priceBeforeTax}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${tax}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${priceAfterTax}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
          `;
});

document.querySelector(".order-summary").innerHTML = cartSummaryHTML;
document.querySelector(".payment-summary").innerHTML = paymentSummaryHTML;
document.querySelector(".js-checkout").innerHTML = `${cartQuantity} items`;



document.querySelectorAll(".js-delete-button").forEach((deleteButton) => {
  deleteButton.addEventListener("click", () => {
    const productId = deleteButton.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
  });
});

document.querySelectorAll('.js-update-button').forEach((updateButton)=>{
  updateButton.addEventListener("click", ()=> {
    updateButton.innerHTML = `
    <input class="js-new-quantity-input new-quantity-input" type="number" value="1" data-testid="new-quantity-input">
    <span class="js-save-quantity-link save-quantity-link link-primary" data-testid="save-quantity-link">
                  Save
                </span>
    `;
  })
})
