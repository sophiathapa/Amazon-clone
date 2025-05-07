import { cart, removeFromCart, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { deliveryOptions } from "../data/deliveryOption.js";
import { formatCurrency } from "./utils/money.js"; //named export
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"; // default export  External Libraries    dayjs()

let cartSummaryHTML = "";
let paymentSummaryHTML = "";
let productsCost = 0;
let CostBeforeTax = 0;
let price = 0;
let cartQuantity = 0;
let shippingFee = 0;

// hello();    //external link
// const todayDate = dayjs();     //external link
// const deliveryDate = todayDate.add(7,'days');    //add 7 days to today date
// console.log(deliveryDate.format('dddd, MMMM D'));

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

  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) deliveryOption = option;
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
  const dateString = deliveryDate.format("dddd, MMMM D");
  console.log(dateString);

  cartSummaryHTML += `
       <div class="cart-item-container
       js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery Date: ${dateString}
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
                
                 ${deliveryOptionsHTML(matchingProduct, cartItem)}
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

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");
    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(deliveryOption.priceCents)}-`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    html += `
    <div class="delivery-option js-delivery-option"
    data-product-id = "${matchingProduct.id}"
    data-delivery-option-id = "${deliveryOption.id}">
                  <input type="radio"
                  ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>`;
  });

  return html;
}

document.querySelector(".order-summary").innerHTML = cartSummaryHTML;
document.querySelector(".payment-summary").innerHTML = paymentSummaryHTML;
document.querySelector(".js-checkout").innerHTML = `${cartQuantity} items`;

document.querySelectorAll(".js-delete-button").forEach((deleteButton) => {
  deleteButton.addEventListener("click", () => {
    const productId = deleteButton.dataset.productId;
    removeFromCart(productId);
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();
  });
});

document.querySelectorAll(".js-update-button").forEach((updateButton) => {
  updateButton.addEventListener("click", () => {
    updateButton.innerHTML = `
    <input class="js-new-quantity-input new-quantity-input" type="number" value="1" data-testid="new-quantity-input">
    <span class="js-save-quantity-link save-quantity-link link-primary" data-testid="save-quantity-link">
                  Save
                </span>
    `;
  });
});

document.querySelectorAll(".js-delivery-option").forEach((element) => {
  element.addEventListener("click", () => {
    const { productId, deliveryOptionId } = element.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
    console.log(cart);
  });
});
