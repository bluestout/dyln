import $ from "jquery";
import { formatAndTrimPrice, toggleTabindexInChildren } from "./helpers";
import {
  quickCartUpsellHtml,
  quickCartLineItemHtml,
  cartLineItemHtml,
  cartTotalsHtml,
  emptyCartHtml,
} from "./ajaxcart-html";
import { subscriptionAjax } from "./subscription";

const datasets = {
  upsell: {
    id: "id",
    price: "price",
  },
};

const selectors = {
  header: "[data-section-type='header']",
  add: "[data-add-to-cart]",
  addText: "[data-add-to-cart-loaded]",
  addLoading: "[data-add-to-cart-loading]",
  remove: "[data-remove-item]",
  changeAjax: "[data-qty-change-ajax]",
  count: "[data-cart-count]",
  countDrawer: "[data-cart-drawer-count]",
  quickcart: "[data-cart-drawer]",
  loader: "[data-loader]",
  input: "[data-qty-input]",
  page: "[data-page-content]",
  nav: "[data-main-navigation]",
  pageWrap: "[data-page-overlay]",
  productPrice: "[data-product-price]",
  quick: {
    toggle: "[data-cart-drawer-toggle]",
    content: "[data-cart-drawer-content]",
    wrap: "[data-cart-drawer-wrap]",
    overlay: "[data-cart-drawer-overlay]",
    header: "[data-cart-drawer-header]",
    totals: "[data-cart-drawer-totals]",
    totalsWrap: "[data-cart-drawer-totals-wrap]",
    note: "[data-cart-drawer-note]",
    shipping: "[data-cart-drawer-shipping-note]",
    checkout: "[data-cart-drawer-checkout]",
    empty: "[data-cart-drawer-empty]",
    payments: "[data-cart-drawer-payments]",
    focusOut: "[data-cart-drawer-focus-out]",
    focusIn: "[data-cart-drawer-focus-in]",
    frequency: "[data-qc-frequency-input]",
    freqSelection: "[data-qc-frequency-selection]",
    item: "[data-cart-drawer-item]",
    subPrice: "[data-qc-subscription-price]",
    subDescription: "[data-qc-subscription-description]",
    subConvert: "[data-qc-subscription-convert]",
    subAgree: "[data-qc-subscription-convert]",
    subConfirm: "[data-qc-subscription-confirm]",
  },
  cart: {
    container: "[data-cart-container]",
    content: "[data-cart-content]",
    totals: "[data-cart-totals]",
    upsell: "[data-cart-upsell-settings]",
    checkout: "[data-cart-checkout]",
  },
  upsell: {
    wrap: "[data-upsell-wrap]",
    submit: "[data-upsell-submit]",
    select: "[data-upsell-select]",
    text: "[data-upsell-text]",
    loading: "[data-upsell-loading]",
    input: "[data-upsell-input]",
    price: "[data-upsell-price]",
    inputById: (id) =>
      `${selectors.upsell.input}[data-${datasets.upsell.id}="${id}"]`,
  },
  message: {
    container: "[data-ajax-message-container]",
    text: "[data-ajax-message-text]",
  },
  shipping: {
    us: "[data-shipping-threshold-us]",
    ca: "[data-shipping-threshold-ca]",
    other: "[data-shipping-threshold-other]",
    note: "[data-cart-shipping-note]",
  },
};

const classes = {
  active: "active",
  open: "open",
  loading: "loading",
  hide: "hide",
};

const ajaxReloaded = new Event("ajaxReloaded");

let containerState;
function containerLoading(state) {
  if (state) {
    $(selectors.loader).addClass(classes.loading);
    clearTimeout(containerState);
    containerState = setTimeout(() => {
      $(selectors.loader).removeClass(classes.loading);
    }, 10000);
  } else {
    clearTimeout(containerState);
    $(selectors.loader).removeClass(classes.loading);
  }
}

// insert id/line, quantity, isline?
// reduce the remove from cart & change quantity for id & line to 1 function
function ajaxChangeCartQty(id, qty, line, delay) {
  let data = { quantity: qty, id };
  if (line) {
    data = { quantity: qty, line: id };
  }
  $.ajax({
    type: "POST",
    url: "/cart/change.js",
    async: false,
    data,
    dataType: "json",
    success: () => {
      $.getJSON("/cart.js", (json) => {
        if (!delay) {
          returnCartIfNotEmpty(json);
        }
      });
    },
    cache: false,
  });
}

function handleAjaxFrequencyClick(event) {
  const $this = $(event.currentTarget);
  const frequency = $this.data("frequency");
  const unit = $this.data("unit");
  const line = $this.data("line");
  ajaxChangeSubscriptionLineItem(frequency, unit, line);
}

function handleAjaxFreqSelectionClick(event) {
  const $this = $(event.currentTarget);
  const text = $this.data("text");
  const price = $this.data("price");

  const $item = $this.closest(selectors.quick.item);
  $item.find(selectors.quick.subPrice).text(price);
  $item.find(selectors.quick.subDescription).text(text);
}

function handleAjaxSubscriptionConversionClick(event) {
  const $this = $(event.currentTarget);
  const confirm = $this
    .closest(selectors.quick.item)
    .find(selectors.quick.subConfirm)
    .prop("checked");
  const $input = $this
    .closest(selectors.quick.item)
    .find(`${selectors.quick.freqSelection}`)
    .filter(":checked");
  const frequency = $input.data("frequency");
  const unit = $input.data("unit");
  const line = $input.data("line");
  const subId = $input.data("sub-id");

  if (confirm && $input.length > 0) {
    containerLoading(true);
    ajaxChangeCartQty(line, 0, true, true);
    subscriptionAjax(subId, 1, frequency, unit);
  } else {
    showMessage(theme.strings.select_frequency_and_confirm);
  }
}

function ajaxChangeSubscriptionLineItem(frequency, unit, line) {
  containerLoading(true);
  const data = {
    line: line,
    properties: {
      shipping_interval_frequency: frequency,
      shipping_interval_unit_type: unit,
    },
  };
  $.ajax({
    type: "POST",
    url: "/cart/change.js",
    async: false,
    data,
    dataType: "json",
    success: () => {
      $.getJSON("/cart.js", (json) => {
        returnCartIfNotEmpty(json);
      });
    },
    cache: false,
  });
}

let inputStatus;
// when customer clicks the remove from cart button
function ajaxRemoveFromCartButton(event) {
  event.preventDefault();
  containerLoading(true);
  const $this = $(this);
  const line = parseInt($this.data("remove-item"), 10);

  inputStatus = setTimeout(() => {
    ajaxChangeCartQty(line, 0, true);
  }, 100);
}

// change the input visuals & make the ajax request, if required
function handlechangeAjaxButtonClick(event) {
  containerLoading(true);
  event.preventDefault();
  const $source = $(event.currentTarget);
  inputStatus = setTimeout(() => {
    const $input = $($source.data("qty-change-ajax"));
    const direction = $source.data("direction");
    const line = $input.data("line");
    let value = parseInt($input.val(), 10);
    if (direction === "down") {
      value -= 1;
    } else if (direction === "up") {
      value += 1;
    }

    if (line && typeof value === "number") {
      ajaxChangeCartQty(line, value, true);
    }
  }, 100);
}

function handleQtyInputChange(event) {
  clearTimeout(inputStatus);
  containerLoading(true);

  inputStatus = setTimeout(() => {
    const $input = $(event.currentTarget);
    const qty = $input.val();
    const line = $input.data("line");

    // if pId is added as a data attribute, this works as ajax, if not, it works as regular js
    if (line && qty) {
      ajaxChangeCartQty(line, qty, true);
    }
  }, 300);
}

// update the totals table on the cart page
function updateCartTotals(cart) {
  const totalsHtml = cartTotalsHtml(cart);
  return $(selectors.cart.totals).html(totalsHtml);
}

// update the cart table on the cart page
function updateCartContent(cart) {
  let cartItems = "";
  for (let i = 0; i < cart.items.length; i++) {
    const product = cart.items[i];
    // set each item in cart as table row
    cartItems += cartLineItemHtml(product, i);
  }
  // replace the cart content
  return $(selectors.cart.content).html(cartItems);
}

// update the quick cart
// cart and quickcart do similar things, but the markup is very different
function updateQuickCart(cart) {
  const $quickCart = $(selectors.quick.content);
  let cartItems = "";
  for (let i = 0; i < cart.items.length; i++) {
    // prepare all the parts to show for each product in cart
    const product = cart.items[i];
    cartItems += quickCartLineItemHtml(product, i);
  }

  // insert all the prepared items in the cart
  // change checkout button type to submit to make it a regular button - right now it's using the recharge redirect to checkout script
  const form = `
    <form action="/cart" method="post" novalidate class="cart-drawer__form">
      <div class="cart-drawer__items-wrap" data-cart-drawer-wrap>
        ${cartItems}
        ${handleUpsell(cart)}
      </div>
      <div class="cart-drawer__totals-wrap sticky" data-cart-drawer-totals-wrap >
        <div class="cart-drawer__total" data-cart-drawer-totals>
          <span class="cart-drawer__total-text">${theme.strings.subtotal}</span>
          <span
            class="cart-drawer__total-price"
            data-total="${formatAndTrimPrice(cart.total_price)}">
            ${formatAndTrimPrice(cart.total_price)}
          </span>
        </div>
        <button class="cart-drawer__checkout" name="checkout" type="button" data-cart-drawer-checkout onclick="reChargeProcessCart()">
          <span class="cart-drawer__checkout-text">
            ${theme.strings.checkout}
          </span>
          <svg class="cart-drawer__checkout-icon" width='20' height='22' viewBox='0 0 20 22' xmlns='http://www.w3.org/2000/svg'><g transform='translate(.573 1.784)' fill='none' fill-rule='evenodd'><rect stroke='#FFF' stroke-width='2' x='1' y='7.703' width='16.958' height='11.405' rx='2'/><path d='M3.991 7.122V4.608C3.991 2.063 6.071 0 8.635 0h1.688c2.565 0 4.644 2.063 4.644 4.608v2.514' stroke='#FFF' stroke-width='2' stroke-linejoin='round'/><ellipse fill='#FFF' cx='9.479' cy='12.149' rx='2.494' ry='2.095'/><path stroke='#FFF' stroke-width='2' stroke-linecap='round' d='M9.479 13.405v2.466'/></g></svg>
        </button>
        <div class="cart-drawer__payments">
          <span class="cart-drawer__payments-title">
            ${theme.strings.pay_using}
          </span>
          <span class="cart-drawer__payment cart-drawer__payment--amazon">
            <img src="${theme.imageUrls.logoAmazon}" alt="Amazon Pay" />
          </span>
          <span class="cart-drawer__payment">
            <img src="${theme.imageUrls.logoGooglePay}" alt="Google Pay" />
          </span>
          <span class="cart-drawer__payment">
            <img src="${theme.imageUrls.logoPayPal}" alt="PayPal" />
          </span>
        </div>
      </div>
    </form>
  `;

  // replace the cart content
  return $quickCart.html(form);
}

function toggleAddingToCartAnimation($source, state) {
  if (state && $source.length > 0) {
    $source.find(selectors.addText).addClass(classes.hide);
    $source.find(selectors.addLoading).removeClass(classes.hide);
  } else {
    $(selectors.addText).removeClass(classes.hide);
    $(selectors.addLoading).addClass(classes.hide);
  }
}

function toggleQuickCartEmptyStatus(empty) {
  const $empty = $(selectors.quick.empty);
  const $quickContent = $(selectors.quick.content);
  const $payments = $(selectors.quick.payments);

  if (empty) {
    if ($empty.css("display") === "none") {
      $quickContent.fadeOut("fast", () => {
        $empty.fadeIn("fast");
      });
      $payments.fadeOut("fast");
    }
  } else {
    if ($quickContent.css("display") === "none") {
      $empty.fadeOut("fast", () => {
        $quickContent.fadeIn("fast");
        $payments.fadeIn("fast");
      });
    }
  }
}

function handleAjaxAddButtonClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const $form = $source.closest("form");

  if ($source.attr("disabled") === "disabled") {
    return;
  }

  toggleAddingToCartAnimation($source, true);

  setTimeout(() => {
    toggleAddingToCartAnimation($source, false);
  }, 10000);

  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    async: false,
    data: $form.serialize(),
    dataType: "json",
    cache: false,
    complete: (jqXHR, textStatus) => {
      addToCartComplete(jqXHR, textStatus);
    },
  });
}

function handleAjaxUpsellSubmit(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const $text = $source.find(selectors.upsell.text);
  const $loading = $source.find(selectors.upsell.loading);

  toggleAddingToCartAnimation($source, true);
  $loading.removeClass(classes.hide);
  $text.addClass(classes.hide);

  setTimeout(() => {
    toggleAddingToCartAnimation($source, false);
    $loading.addClass(classes.hide);
    $text.removeClass(classes.hide);
  }, 10000);

  const $wrap = $source.closest(selectors.upsell.wrap);
  const id =
    $wrap.find(`${selectors.upsell.select} option:selected`).val() || false;

  if (!id && !(typeof id === "number")) {
    return;
  }

  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    async: false,
    data: {
      quantity: 1,
      id,
    },
    dataType: "json",
    cache: false,
    complete: (jqXHR, textStatus) => {
      $loading.addClass(classes.hide);
      $text.removeClass(classes.hide);
      addToCartComplete(jqXHR, textStatus);
    },
  });
}

function handleAjaxUpsellSelectChange(event) {
  const $source = $(event.currentTarget);
  const $parent = $source.closest(selectors.upsell.wrap);
  const $option = $source.find(`option:selected`);
  const id = $option.data(datasets.upsell.id);
  const price = $option.data(datasets.upsell.price);
  renderUpsellPrice($parent, price);
  $(selectors.upsell.input).removeAttr("checked");
  $(selectors.upsell.inputById(id)).attr("checked", "checked");
}

function handleAjaxUpsellInputClick(event) {
  const $source = $(event.currentTarget);
  const $parent = $source.closest(selectors.upsell.wrap);
  const id = $source.data(datasets.upsell.id);
  const price = $source.data(datasets.upsell.price);
  $parent.find(selectors.upsell.select).val(id);

  renderUpsellPrice($parent, price);
}

function renderUpsellPrice($upsell, price) {
  const $price = $upsell.find(selectors.upsell.price);
  $price.text(price);
}

function addToCartComplete(jqXHR, textStatus) {
  if (textStatus === "success") {
    $.getJSON("/cart.js", (json) => {
      returnCartIfNotEmpty(json);
      quickCartOpen(true);
    });
  } else if (
    textStatus === "error" &&
    jqXHR.responseJSON.status === 422 &&
    jqXHR.responseJSON.description.length > 0
  ) {
    showMessage(jqXHR.responseJSON.description);
  }
}

let eventHolder = null;
function showMessage(message) {
  if (!message || typeof message !== "string") {
    return null;
  }
  clearTimeout(eventHolder);
  $(selectors.message.text).html(message);
  $(selectors.message.container).addClass(classes.active);
  eventHolder = setTimeout(() => {
    $(selectors.message.container).removeClass(classes.active);
  }, 4000);
  return eventHolder;
}

// update only the at a glance count next to the cart icon in the header
function updateQuickCartCount(cart) {
  const $count = $(selectors.count);
  const $countDrawer = $(selectors.countDrawer);

  $count.html(cart.item_count);
  $countDrawer.html(cart.item_count);
}

// what to show on cart page if the cart is empty
function cartIsEmpty() {
  const empty = emptyCartHtml();
  return $(selectors.cart.container).html(empty);
}

// function to run whenever the cart contents are updated with ajax
function returnCartIfNotEmpty(json) {
  // if json has items, update cart. If not, return empty
  if (json.item_count > 0) {
    updateCartContent(json);
    updateCartTotals(json);
    updateQuickCart(json);
    updateQuickCartCount(json);
    toggleQuickCartEmptyStatus(false);
  } else {
    cartIsEmpty();
    updateQuickCartCount(json);
    toggleQuickCartEmptyStatus(true);
  }
  containerLoading(false);
  toggleAddingToCartAnimation($(selectors.add), false);
  handleCartDrawerCheckoutHeight();
  handleFreeShippingMessage(json);
  document.dispatchEvent(ajaxReloaded);
}

// show/hide the quickcart
function quickCartToggle(event) {
  event.preventDefault();

  const $quickCart = $(selectors.quickcart);
  $(selectors.nav).removeClass(classes.active);
  $(selectors.pageWrap).removeClass(classes.active);

  if ($quickCart.hasClass(classes.open)) {
    $quickCart.removeClass(classes.open);
    $(selectors.quick.overlay).removeClass(classes.active);
    $("html").removeClass("no-scroll");
    toggleTabindexInChildren($quickCart, 2);
    $(selectors.quick.focusOut).focus();
  } else {
    $quickCart.addClass(classes.open);
    $(selectors.quick.overlay).addClass(classes.active);
    $("html").addClass("no-scroll");
    toggleTabindexInChildren($quickCart, 1);
    $(selectors.quick.focusIn).focus();
  }
}

// open the quickcart after an item has been added to cart
function quickCartOpen(open) {
  $(selectors.page).removeClass(classes.active);
  $(selectors.nav).removeClass(classes.active);
  $(selectors.pageWrap).removeClass(classes.active);

  if (open) {
    $(selectors.quickcart).addClass(classes.open);
    $(selectors.quick.overlay).addClass(classes.active);
    document.querySelector("html").classList.add("no-scroll");
    $(selectors.quick.focusIn).focus();
  } else {
    $(selectors.quickcart).removeClass(classes.open);
    $(selectors.quick.overlay).removeClass(classes.active);
    document.querySelector("html").classList.remove("no-scroll");
    $(selectors.quick.focusOut).focus();
  }
}

function handleCartDrawerCheckoutHeight() {
  const quickcartHeight = $(selectors.quick.content).outerHeight();
  const totalsHeight = $(selectors.quick.totalsWrap).outerHeight();

  $(selectors.quick.wrap).css("height", quickcartHeight - totalsHeight);
}

function handleUpsell(cart) {
  const settings = $(selectors.cart.upsell).html();
  const json = JSON.parse(settings);
  let loop = true;

  let pattern = "";
  const cartProductIds = [];
  const cartProductsWithUpsell = [];

  for (let i = 0; i < cart.items.length; i++) {
    if (!cartProductIds.includes(cart.items[i].product_id)) {
      cartProductIds.push(cart.items[i].product_id);
      cartProductsWithUpsell.push(cart.items[i]);
    }
  }

  for (let i = 0; i < cartProductsWithUpsell.length; i++) {
    loop = true;

    const item = cartProductsWithUpsell[i];

    for (let j = 0; j < json.products.length; j++) {
      if (!loop) {
        break;
      }
      const uspellItem = json.products[j];
      const upsoldProduct = uspellItem.upsell_product;
      const upsoldProduct2 = uspellItem.upsell_product_2;
      const upsoldProduct3 = uspellItem.upsell_product_3;

      if (item.product_id === uspellItem.active_id) {
        pattern += `<h5 class="cart-drawer__upsell-title">${json.header}</h5>`;
        if (upsoldProduct && !cartProductIds.includes(upsoldProduct.id)) {
          pattern += quickCartUpsellHtml(
            upsoldProduct,
            uspellItem.upsell_url,
            1
          );
        }
        if (upsoldProduct2 && !cartProductIds.includes(upsoldProduct2.id)) {
          pattern += quickCartUpsellHtml(
            upsoldProduct2,
            uspellItem.upsell_url_2,
            2
          );
        }
        if (upsoldProduct3 && !cartProductIds.includes(upsoldProduct3.id)) {
          pattern += quickCartUpsellHtml(
            upsoldProduct3,
            uspellItem.upsell_url_3,
            3
          );
        }
        loop = false;
      }
    }
  }
  return pattern;
}

function handleFreeShippingMessage(cart) {
  let threshold = 0;

  if ($("body").hasClass("location-us")) {
    threshold = $(selectors.shipping.us).val();
  } else if ($("body").hasClass("location-ca")) {
    threshold = $(selectors.shipping.ca).val();
  } else {
    threshold = $(selectors.shipping.other).val();
  }

  threshold = parseFloat(threshold);

  const $note = $(selectors.shipping.note);
  const total = cart.total_price / 100;
  const $totals = $(selectors.quick.totals);
  let remaining = threshold - total;
  remaining = formatAndTrimPrice(remaining * 100);

  if (cart.item_count < 1) {
    $note.html(
      theme.strings.free_shipping_empty_html.replace("###", threshold)
    );
  } else if (total >= threshold) {
    $note.html(theme.strings.free_shipping_reached_html);
    $totals.append(
      `<span class="cart-drawer__total-text brand-blue">
        ${theme.strings.shipping}
      </span>
      <span class="cart-drawer__total-price brand-blue">
        ${theme.strings.free}
      </span>`
    );
  } else {
    $note.html(
      theme.strings.free_shipping_unreached_html.replace("###", remaining)
    );
  }
}

// on click, remove the item form cart
$(document).on("click", selectors.remove, ajaxRemoveFromCartButton);

// change quantity when these buttons are clicked - these need product data to work
$(document).on("click", selectors.changeAjax, handlechangeAjaxButtonClick);

$(document).on("change", selectors.input, handleQtyInputChange);
// toggle quick cart from the right
$(document).on("click", selectors.quick.toggle, quickCartToggle);
// ajaxify add to cart buttons
$(document).on("click", selectors.add, handleAjaxAddButtonClick);
$(document).on("click", selectors.upsell.submit, handleAjaxUpsellSubmit);
$(document).on("change", selectors.upsell.select, handleAjaxUpsellSelectChange);
$(document).on("click", selectors.upsell.input, handleAjaxUpsellInputClick);
$(document).on("click", selectors.quick.frequency, handleAjaxFrequencyClick);
$(document).on(
  "click",
  selectors.quick.freqSelection,
  handleAjaxFreqSelectionClick
);
$(document).on(
  "click",
  selectors.quick.subConvert,
  handleAjaxSubscriptionConversionClick
);

// run ajax on page load to get cart contents
$(document).ready(() => {
  containerLoading(true);

  reloadAjax();
});

function reloadAjax() {
  $.getJSON("/cart.js", (json) => {
    returnCartIfNotEmpty(json);
  });
}

$(document).keyup((event) => {
  if (event.key === "Escape") {
    quickCartOpen(false);
  }
});

export {
  addToCartComplete,
  quickCartOpen,
  reloadAjax,
  handleAjaxAddButtonClick,
};
