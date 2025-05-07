import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOption.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary() {
  let paymentSummaryHTML = "";
  let productsPriceCents = 0;
  let cartQuantity = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
    const product = getProduct(cartItem.productId);
    productsPriceCents += cartItem.quantity * product.priceCents;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const priceBeforeTax = shippingPriceCents + productsPriceCents;
  const taxCents = priceBeforeTax * 0.1;
  const priceAfterTax = priceBeforeTax + taxCents;

  paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(
              productsPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              shippingPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
              priceBeforeTax
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(
              taxCents
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(
              priceAfterTax
            )}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
          `;

  document.querySelector(".payment-summary").innerHTML = paymentSummaryHTML;
  document.querySelector(".js-checkout").innerHTML = `${cartQuantity} items`;
}
