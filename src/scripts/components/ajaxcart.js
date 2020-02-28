import * as shopifyCart from "@shopify/theme-cart";
import { formatMoney } from "@shopify/theme-currency";
import $ from "jquery";

// this is the icon-cart, in text form;

const icons = {
  cart:
    "<span class='icon-fallback-text'>Cart Icon</span><svg width='24px' height='22px' viewBox='0 0 24 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>Cart</title><g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'><g fill='#FFFFFF' fill-rule='nonzero'><path d='M0.558343509,2.2031313e-05 C0.236114313,0.0150907029 -0.014456087,0.293175077 0.000648598871,0.615431965 C0.0157563617,0.937688853 0.123609173,1.22471173 0.616036085,1.23081945 L3.22181747,1.23081945 C3.58602225,2.51687161 3.97358713,3.79904374 4.32759186,5.08660667 C5.15127571,8.35894502 5.96958106,11.6382249 6.78914181,14.9135633 C6.85313595,15.1789491 7.11234024,15.3837809 7.38529844,15.3847347 L20.9238231,15.3847347 C21.1967813,15.3847347 21.4559856,15.1789491 21.5199798,14.9135633 L23.9815297,5.06737581 C24.0822256,4.67398013 23.7553687,4.30905843 23.3853731,4.30775688 L5.39490454,4.30775688 L4.28913015,0.442354235 C4.21442518,0.187473046 3.95854091,-0.00235245545 3.69297352,2.2031313e-05 L0.558343509,2.2031313e-05 Z M5.71221371,5.53853186 L22.5969079,5.53853186 L20.4430517,14.1539597 L7.86606991,14.1539597 L5.71221371,5.53853186 Z M10.1545421,16.6155097 C8.80235428,16.6155097 7.69299218,17.7248687 7.69299218,19.0770596 C7.69299218,20.4292198 8.80235428,21.5386096 10.1545421,21.5386096 C11.5067269,21.5386096 12.6160921,20.4292198 12.6160921,19.0770596 C12.6160921,17.7248687 11.5067269,16.6155097 10.1545421,16.6155097 Z M18.1545795,16.6155097 C16.8023916,16.6155097 15.6930295,17.7248687 15.6930295,19.0770596 C15.6930295,20.4292198 16.8023916,21.5386096 18.1545795,21.5386096 C19.5067642,21.5386096 20.6161294,20.4292198 20.6161294,19.0770596 C20.6161294,17.7248687 19.5067642,16.6155097 18.1545795,16.6155097 Z M10.1545421,17.8462847 C10.8415638,17.8462847 11.3853171,18.3900103 11.3853171,19.0770596 C11.3853171,19.7640782 10.8415638,20.3078346 10.1545421,20.3078346 C9.46751431,20.3078346 8.92376715,19.7640782 8.92376715,19.0770596 C8.92376715,18.3900103 9.46751431,17.8462847 10.1545421,17.8462847 Z M18.1545795,17.8462847 C18.8416042,17.8462847 19.3853544,18.3900103 19.3853544,19.0770596 C19.3853544,19.7640782 18.8416042,20.3078346 18.1545795,20.3078346 C17.4675516,20.3078346 16.9238045,19.7640782 16.9238045,19.0770596 C16.9238045,18.3900103 17.4675516,17.8462847 18.1545795,17.8462847 Z' id='CART'></path></g></g></svg>",
  close:
    "<span class='icon-fallback-text'>Close Icon</span><svg width='17px' height='16px' viewBox='0 0 17 16' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><title>Close Icon</title><g stroke='#000' stroke-width='1' fill='none' fill-rule='evenodd'><path d='M0,0 L16,16'></path><path d='M16,0 L0,16'></path></g></svg>"
};

const elements = {
  header: "[data-section-type='header']",
  add: "[data-add-to-cart]",
  addText: "[data-add-to-cart-content]",
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
  addUpsell: "[data-add-upsell]",
  upsellWrap: "[data-add-upsell-wrap]",
  upsellSelect: "[data-upsell-select]",
  upsellRemove: "[data-add-upsell-remove]",
  upsellText: "[data-add-upsell-text]",
  upsellProgress: "[data-add-upsell-loading]",
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
    checkout: "[data-cart-drawer-checkout]"
  },
  cart: {
    container: "[data-cart-container]",
    content: "[data-cart-content]",
    totals: "[data-cart-totals]",
    upsell: "[data-cart-upsell-settings]",
    checkout: "[data-cart-checkout]"
  },
  message: {
    container: "[data-ajax-message-container]",
    text: "[data-ajax-message-text]"
  }
};

const classes = {
  active: "active",
  activeCart: "active-cart",
  open: "open"
};

const ajaxReloaded = new Event("ajaxReloaded");

// const colors = window.theme.colors || [];
// const sizes = ["xxs", "xs", "s", "m", "l", "xl", "2xl", "3xl"];

function resizeImage(src, size) {
  // remove any current image size then add the new image size
  return src
    .replace(
      /_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g,
      "."
    )
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function(match) {
      return "_" + size + match;
    });
}

function formatAndTrimPrice(price) {
  if (!price || typeof price !== "number") {
    return 0;
  }

  let formattedPrice = formatMoney(price, theme.moneyFormat);
  formattedPrice = formattedPrice.replace(".00", "");
  return formattedPrice;
}

let containerState;
function containerLoading(state) {
  if (state) {
    $(elements.loader).addClass("loading");
    clearTimeout(containerState);
    containerState = setTimeout(() => {
      $(elements.loader).removeClass("loading");
    }, 10000);
  } else {
    clearTimeout(containerState);
    $(elements.loader).removeClass("loading");
  }
}

// insert id/line, quantity, isline?
// reduce the remove from cart & change quantity for id & line to 1 function
function ajaxChangeCartQty(id, qty, line) {
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
      $.getJSON("/cart.js", json => {
        returnCartIfNotEmpty(json);
      });
    },
    cache: false
  });
}

let inputStatus;
// when customer clicks the remove from cart button
function ajaxRemoveFromCartButton(event) {
  event.preventDefault();
  containerLoading(true);
  const $this = $(this);
  const line = parseInt($this.data("remove-item"), 10);

  if (
    typeof Flow === "object" &&
    Flow.beacon &&
    typeof Flow.beacon.processEvent === "function"
  ) {
    const vId = parseInt($this.data("remove-id"), 10);

    const params = {
      item_number: vId
    };
    Flow.beacon.processEvent("cart_remove", params, { xhr: true });
  }

  return (async () => {
    await new Promise(resolve => {
      resolve(
        (inputStatus = setTimeout(() => {
          ajaxChangeCartQty(line, 0, true);
        }, 100))
      );
    });
  })();
}

// change the input visuals & make the ajax request, if required
function handlechangeAjaxButtonClick(event) {
  containerLoading(true);
  event.preventDefault();

  return (async () => {
    await new Promise(resolve => {
      resolve(
        (inputStatus = setTimeout(() => {
          const $source = $(event.currentTarget);
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
        }, 100))
      );
    });
  })();
}

function handleQtyInputChange(event) {
  clearTimeout(inputStatus);
  containerLoading(true);

  return (async () => {
    await new Promise(resolve => {
      resolve(
        (inputStatus = setTimeout(() => {
          const $input = $(event.currentTarget);
          const qty = $input.val();
          const line = $input.data("line");

          // if pId is added as a data attribute, this works as ajax, if not, it works as regular js
          if (line && qty) {
            ajaxChangeCartQty(line, qty, true);
          }
        }, 300))
      );
    });
  })();
}

// update the totals table on the cart page
function updateCartTotals(cart) {
  let totalsHtml = "<div class='cart__totals-wrap'>";

  let localize = "";
  if (
    Flow &&
    typeof Flow.getCountry === "function" &&
    Flow.getCountry() !== "USA"
  ) {
    localize = "data-flow-localize='cart-subtotal'";
  }

  totalsHtml += `
  <p class="cart__totals-text">${theme.strings.subtotal}:</p>
  <p
    class="cart__totals-value"
    ${localize}
    data-total="${formatMoney(cart.total_price, theme.moneyFormat)}">
    ${formatMoney(cart.total_price, theme.moneyFormat)}
  </p>`;

  totalsHtml += "</div>";
  return $(elements.cart.totals).html(totalsHtml);
}

// update the cart table on the cart page
function updateCartContent(cart) {
  let cartItems = "";
  for (let i = 0; i < cart.items.length; i++) {
    const product = cart.items[i];
    const image = `
    <a class="cart__table-product-image-wrap"
      href="${product.url}">
      ${getAjaxProductImage(product)}
    </a>`;
    const shownPrice = formatMoney(product.price, theme.moneyFormat);
    const originalPrice = formatMoney(
      product.original_price,
      theme.moneyFormat
    );

    // this is to make the product title center, if it has a title only
    let titleBr = "";
    let variantTitle = "";
    if (product.variant_title) {
      variantTitle = product.variant_title;
    }

    if (product.variant_title) {
      titleBr = "<br>";
    }

    const showLink = `href="${product.url}"`;
    const lineTotal = formatMoney(product.line_price, theme.moneyFormat);

    const selectOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let selectOptionsString = "";
    for (let j = 0; j < selectOptions.length; j++) {
      const option = selectOptions[j];
      if (option === product.quantity) {
        selectOptionsString += `<option value="${option}" selected="selected">
        ${option < 10 ? 0 + option.toString() : option}
        </option>`;
      } else {
        selectOptionsString += `<option value="${option}">
        ${option < 10 ? 0 + option.toString() : option}
        </option>`;
      }
    }

    // if a product is a gift, and auto-added to cart, we can't allow linking to it or changing quantity
    const showQuantity = `
    <div class="cart__table-qty-wrap">
      <select
        class="cart__table-qty-select line-${i + 1}"
        name="updates[]"
        id="updates_${product.key}"
        data-line="${i + 1}"
        aria-label="${theme.strings.quantity}"
        data-qty-input>
        ${selectOptionsString}
      </select>
    </div>`;

    // set each item in cart as table row
    cartItems += `
    <tr
      data-line=${i + 1}
      class="responsive-table-row"
      data-flow-cart-item-number="${product.variant_id}">
      <td
        class="cart__table-cell d-none d-md-table-cell"
        data-label="${theme.strings.product}">
        ${image}
        <a class="cart__table-product-title-wrap" ${showLink}>
          <span class="cart__table-product-title">
            ${product.product_title}
          </span>
        </a>
        <div class="cart__table-remove-wrap">
          <a
            class="cart__table-remove"
            href="/cart/change?line=${i}&amp;quantity=0"
            data-remove-item="${i + 1}"
            data-remove-id="${product.id}">
            ${theme.strings.remove}
          </a>
        </div>
      </td>

      <td
        class="cart__table-cell d-none d-md-table-cell"
        data-label="${theme.strings.variant}">
        <a class="cart__table-product-variant" ${showLink}>
          ${variantTitle}
        </a>
      </td>

      <td class="cart__table-cell" data-label="${theme.strings.quantity}">
        <div class="row no-gutters">
          <div class="col-4 d-md-none">
            ${image}
          </div>
          <div class="col-md-12 col-5">
            <a class="cart__table-product-title-wrap d-md-none" ${showLink}>
              <span
                class="cart__table-product-title">
                ${product.product_title}
              </span>
              ${titleBr}
              <span class="cart__table-product-info">
                ${variantTitle}
              </span>
              <br>
            </a>
            <div>
              ${showQuantity}
            </div>
          </div>
          <div class="col-3 d-md-none">
            <span data-flow-localize="cart-item-line-total">${lineTotal}</span>
            <div class="cart__table-remove-wrap">
              <a
                class="cart__table-remove"
                href="/cart/change?line=${i}&amp;quantity=0"
                data-remove-item="${i + 1}"
                data-remove-id="${product.id}">
                ${theme.strings.remove}
              </a>
            </div>
          </div>
        </div>

      </td>

      <td
        class="cart__table-cell d-none d-md-table-cell"
        data-label="${theme.strings.total}"
        data-flow-localize="cart-item-line-total">
        ${lineTotal}
      </td>
    </tr>`;
  }
  // replace the cart content
  return $(elements.cart.content).html(cartItems);
}

// update the quick cart
// cart and quickcart do similar things, but the markup is very different
function updateQuickCart(cart) {
  const $quickCart = $(elements.quick.content);
  let cartItems = "";
  for (let i = 0; i < cart.items.length; i++) {
    // prepare all the parts to show for each product in cart

    const product = cart.items[i];
    const image = getAjaxProductImage(product, "240x240", "cart-drawer__image");

    const shownPrice = formatAndTrimPrice(product.line_price);
    const originalPrice = formatAndTrimPrice(product.original_line_price);

    let price = "";
    if (product.original_line_price > product.line_price) {
      price = `<span class="visually-hidden">
        ${theme.strings.discounted_price}
      </span>
      ${shownPrice}
      <span class="visually-hidden">${theme.strings.original_price}</span>
      <s>${originalPrice}</s>`;
    } else if (product.price === 0) {
      price = theme.strings.free_price;
    } else {
      price = shownPrice;
    }

    const showLink = `href="${product.url}"`;

    const showQuantity = `
    <div class="cart-drawer__item-qty">
      <div class="cart-drawer__item-button-down">
        <button class="cart-drawer__item-button"
          type="button"
          data-direction="down"
          data-qty-change-ajax=".line-${i + 1}">-</button>
      </div>

      <input type="number"
        class="cart-drawer__item-input line-${i + 1}"
        name="updates[]"
        id="qc_updates_${product.key}"
        data-line="${i + 1}"
        value="${product.quantity}"
        aria-label="${theme.strings.quantity}"/
        data-qty-input />

      <div class="cart-drawer__item-button-up">
        <button class="cart-drawer__item-button"
          type="button"
          data-direction="up"
          data-qty-change-ajax=".line-${i + 1}">+</button>
      </div>
    </div>`;

    // put together all the data into one line item, append to whole cart
    cartItems += `
    <div
      class="cart-drawer__item"
      data-line="${i + 1}"
      data-quantity="${product.quantity}"
      data-flow-cart-item-number="${product.variant_id}">
      <div class="cart-drawer__image-wrap">
        <a ${showLink} class="cart-drawer__image-link">
          ${image}
        </a>
        ${showQuantity}
      </div>
      <div class="cart-drawer__item-content">
        <div class="cart-drawer__item-left">
          <a ${showLink} class="cart-drawer__item-link">
            <h4 class="cart-drawer__item-title">${product.product_title}</h4>
            <p class="cart-drawer__variant">
              ${theme.strings.variant}:
              ${product.variant_title}
            </p>
            <p class="cart-drawer__variant">
              ${theme.strings.subtotal}:
              <span data-flow-localize="cart-item-line-total">${price}</span>
            </p>
          </a>
          <a
            class="cart-drawer__remove"
            href="/cart/change?line=${i}&amp;quantity=0"
            data-remove-item="${i + 1}"
            data-remove-id="${product.id}">
            ${theme.strings.remove}
          </a>
        </div>
      </div>
    </div>
    `;
  }

  let localize = "";
  if (
    Flow &&
    typeof Flow.getCountry === "function" &&
    Flow.getCountry() !== "USA"
  ) {
    localize = "data-flow-localize='cart-subtotal'";
  }

  // insert all the prepared items in the cart
  const form = `
    <form action="/cart" method="post" novalidate class="cart-drawer__form">
      <div class="cart-drawer__items-wrap" data-cart-drawer-wrap data-flow-cart-container>
        ${cartItems}
        ${handleUpsell(cart)}
      </div>
      <div class="cart-drawer__totals-wrap sticky" data-cart-drawer-totals-wrap data-flow-cart-container>

        <span class="cart-drawer__total" data-cart-drawer-totals>
          ${theme.strings.total}:
          <span
            ${localize}
            data-total="${formatAndTrimPrice(cart.total_price)}">
            ${formatAndTrimPrice(cart.total_price)}
          </span>
        </span>

        <input
          type="submit"
          name="checkout"
          class="cart-drawer__checkout"
          value="${theme.strings.checkout}"
          data-cart-drawer-checkout/>
      </div>
    </form>
  `;

  // replace the cart content
  return $quickCart.html(form);
}

function toggleAddingToCartAnimation(state) {
  if (state && document.querySelector(elements.add)) {
    document.querySelector(elements.addText).classList.add("hide");
    document.querySelector(elements.addLoading).classList.remove("hide");
  } else if (document.querySelector(elements.add)) {
    document.querySelector(elements.addText).classList.remove("hide");
    document.querySelector(elements.addLoading).classList.add("hide");
  }
}

function handleAjaxAddButtonClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);

  if ($source.attr("disabled") === "disabled") {
    return;
  }

  toggleAddingToCartAnimation(true);

  setTimeout(() => {
    toggleAddingToCartAnimation(false);
  }, 10000);

  const $form = $source.closest("form");

  const price = $(elements.productPrice)
    .text()
    .replace(/\D/g, "");

  const formarray = $form.serializeArray();
  const id = formarray && formarray[4] ? formarray[4].value : 0;
  const qty = formarray && formarray[5] ? formarray[5].value : 0;

  const params = {
    item_number: id,
    price: {
      amount: price,
      currency: "USD"
    },
    quantity: qty ? qty : 1
  };

  (async () => {
    await new Promise(resolve => {
      resolve(
        $.ajax({
          type: "POST",
          url: "/cart/add.js",
          async: true,
          data: $form.serialize(),
          dataType: "json",
          cache: false,
          complete: (jqXHR, textStatus) => {
            addToCartComplete(jqXHR, textStatus);
            if (typeof Flow === "object" && id !== 0 && qty !== 0) {
              Flow.beacon.processEvent("cart_add", params, { xhr: true });
            }
          }
        })
      );
    });
  })();
}

function handleAjaxAddUpsell(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const $text = $source.find(elements.upsellText);
  const $loading = $source.find(elements.upsellProgress);

  toggleAddingToCartAnimation(true);
  $loading.removeClass("hide");
  $text.addClass("hide");

  setTimeout(() => {
    toggleAddingToCartAnimation(false);
    $loading.addClass("hide");
    $text.removeClass("hide");
  }, 10000);

  const $wrap = $source.closest(elements.upsellWrap);
  const id =
    $wrap.find(`${elements.upsellSelect} option:selected`).val() || false;

  if (!id && !(typeof id === "number")) {
    return;
  }

  (async () => {
    await new Promise(resolve => {
      resolve(
        $.ajax({
          type: "POST",
          url: "/cart/add.js",
          async: true,
          data: {
            quantity: 1,
            id
          },
          dataType: "json",
          cache: false,
          complete: (jqXHR, textStatus) => {
            $loading.addClass("hide");
            $text.removeClass("hide");
            addToCartComplete(jqXHR, textStatus);
          }
        })
      );
    });
  })();
}

function addToCartComplete(jqXHR, textStatus) {
  if (textStatus === "success") {
    $.getJSON("/cart.js", json => {
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
  $(elements.message.text).html(message);
  $(elements.message.container).addClass(classes.active);
  eventHolder = setTimeout(() => {
    $(elements.message.container).removeClass(classes.active);
  }, 4000);
  return eventHolder;
}

// update only the at a glance count next to the cart icon in the header
function updateQuickCartCount(cart) {
  const $count = $(elements.count);
  const $countDrawer = $(elements.countDrawer);
  let pattern = "";
  let patternDrawer = "";

  if (cart.item_count > 0) {
    pattern = `<button type="button" class="site-header__cart-link site-header__cart-link--items" data-cart-drawer-toggle title="${theme.strings.cart_title}">
      <span class="site-header__cart-icon">${icons.cart}</span>
      <span class="site-header__cart-count">${cart.item_count}</span>
    </button>`;
    patternDrawer = `
      <button type="button" class="cart-drawer__cart-link cart-drawer__cart-link--items" data-cart-drawer-toggle title="${theme.strings.cart_title}">
        <span class="cart-drawer__cart-icon">${icons.cart}</span>
        <span class="cart-drawer__cart-count">${cart.item_count}</span>
      </button>`;
  } else {
    pattern = `
    <button type="button" class="site-header__cart-link" data-cart-drawer-toggle title="${theme.strings.cart_title}">
      <span class="site-header__cart-icon">${icons.cart}</span>
    </button>`;

    patternDrawer = `
    <button type="button" class="cart-drawer__cart-link" data-cart-drawer-toggle title="${theme.strings.cart_title}">
      <span class="cart-drawer__cart-icon">${icons.cart}</span>
    </button>`;
  }

  $count.html(pattern);
  $countDrawer.html(patternDrawer);
}

// what to show on cart page if the cart is empty
function cartIsEmpty() {
  const empty = `
    <h1 class="cart-page__totals-header text-center mb-5 mt-5">
      ${theme.strings.cart_title}
    </h1>

    <div class="supports-cookies text-center mb-5 mt-5 rte">
      <p>${theme.strings.cart_empty}</p>
      <p>${theme.strings.continue_browsing}</p>
    </div>

    <div class="supports-no-cookies text-center mb-5 mt-5 rte">
      <p>${theme.strings.cookies_required}</p>
    </div>
  `;
  return $(elements.cart.container).html(empty);
}

// what to show on quickcart if the cart is empty
function QuickcartIsEmpty() {
  const empty = `<p class="cart-drawer__shipping-note">
    ${theme.strings.cart_empty}
  </p>
  <div class="cart-drawer__browsing-wrap">
    ${theme.strings.shop_mens}
    <br>
    ${theme.strings.shop_womens}
  </div>`;
  return $(elements.quick.content).html(empty);
}

function getAjaxProductImage(product, format, className) {
  let image = "";
  let domClass = "";
  if (className) {
    domClass = `class="${className}"`;
  }
  const size = format || "240x240";

  if (product.image) {
    image = resizeImage(product.image, size);
    image = `<img
      src="${image}"
      ${domClass}
      alt="${product.product_title}"/>`;
  } else if (product.featured_image) {
    image = resizeImage(product.featured_image, size);
    image = `<img
      src="${image}"
      ${domClass}
      alt="${product.title}"/>`;
  }

  return image;
}

// function to run whenever the cart contents are updated with ajax
function returnCartIfNotEmpty(json) {
  // if json has items, update cart. If not, return empty
  if (json.item_count > 0) {
    updateCartContent(json);
    updateCartTotals(json);
    updateQuickCart(json);
    updateQuickCartCount(json);
  } else {
    cartIsEmpty();
    QuickcartIsEmpty();
    updateQuickCartCount(json);
  }
  containerLoading();
  toggleAddingToCartAnimation();
  handleCartDrawerCheckoutHeight();
  document.dispatchEvent(ajaxReloaded);
}

// show/hide the quickcart
function quickCartToggle(event) {
  event.preventDefault();

  $(elements.nav).removeClass(classes.active);
  $(elements.page).removeClass(classes.active);
  $(elements.pageWrap).removeClass(classes.active);

  if ($(elements.quickcart).hasClass(classes.open)) {
    $(elements.quickcart).removeClass(classes.open);
    $(elements.quick.overlay).removeClass(classes.active);
    $("html").removeClass("no-scroll");

    if ($(window).width() < 992) {
      $(elements.page).removeClass(classes.activeCart);
    }
  } else {
    $(elements.quickcart).addClass(classes.open);
    $(elements.quick.overlay).addClass(classes.active);
    $("html").addClass("no-scroll");

    if ($(window).width() < 992) {
      $(elements.page).addClass(classes.activeCart);
    }
  }
}

// open the quickcart after an item has been added to cart
function quickCartOpen(open) {
  $(elements.page).removeClass(classes.active);
  $(elements.nav).removeClass(classes.active);
  $(elements.pageWrap).removeClass(classes.active);

  if (open) {
    $(elements.quickcart).addClass(classes.open);
    $(elements.quick.overlay).addClass(classes.active);
    document.querySelector("html").classList.add("no-scroll");
  } else {
    $(elements.quickcart).removeClass(classes.open);
    $(elements.quick.overlay).removeClass(classes.active);
    document.querySelector("html").classList.remove("no-scroll");
  }
}

function handleCartDrawerCheckoutHeight() {
  const productWrapHeight = $(elements.quick.wrap).height();
  const quickcartHeight = $(elements.quickcart).height();

  if (productWrapHeight + 210 > quickcartHeight) {
    $(elements.quick.totalsWrap).addClass("sticky");
  }
}

function handleUpsell(cart) {
  const settings = $(elements.cart.upsell).html();
  const json = JSON.parse(settings);
  let loop = true;

  let pattern = "";
  const cartProductIds = [];

  for (let i = 0; i < cart.items.length; i++) {
    cartProductIds.push(cart.items[i].product_id);
  }

  for (let i = 0; i < cart.items.length; i++) {
    loop = true;

    const item = cart.items[i];

    for (let j = 0; j < json.products.length; j++) {
      if (!loop) {
        break;
      }
      const uspellItem = json.products[j];
      const uspellProduct = uspellItem.upsell_product;
      const storage = localStorage.getItem(`upsell-hide-${uspellProduct.id}`);

      if (
        item.product_id === uspellItem.active_id &&
        !cartProductIds.includes(uspellProduct.id) &&
        !storage
      ) {
        let options = "";
        // check if flow price exists
        const $flowPriceWrap = $(
          `[data-cart-upsell-item="${uspellProduct.variants[0].id}"]`
        );

        const flowPrice =
          $flowPriceWrap.length > 0
            ? $flowPriceWrap.text().trim()
            : formatAndTrimPrice(uspellProduct.price);

        for (let k = 0; k < uspellProduct.variants.length; k++) {
          const variant = uspellProduct.variants[k];
          options += `
          <option
            ${variant.available ? "" : "disabled='disabled'"}
            value="${variant.id}">
              ${variant.title}
          </option>
          `;
        }

        const select =
          options.length > 0
            ? `<div class="cart-drawer__upsell-selectbox"><select name="id" class="cart-drawer__upsell-select" data-upsell-select>${options}</select></div>`
            : "";

        const showLink =
          `href="${uspellItem.upsell_url}"` ||
          `href="/products/${uspellProduct.handle}"`;

        pattern = `
        <div class="cart-drawer__item-upsell" data-add-upsell-wrap>
          <button
            type="button"
            class="cart-drawer__upsell-remove"
            data-add-upsell-remove="${uspellProduct.id}">
            ${icons.close}
          </button>
          <h5 class="cart-drawer__upsell-title">${json.header}</h5>
          <input
            type="hidden"
            id="upsellQuantity"
            name="quantity"
            value="1"/>
          <div class="cart-drawer__image-wrap">
            <a ${showLink} class="cart-drawer__image-link">
              ${getAjaxProductImage(uspellProduct)}
            </a>
          </div>
          <div class="cart-drawer__item-content">
            <a ${showLink} class="cart-drawer__item-link">
              <h4 class="cart-drawer__upsell-item-title">
              ${uspellProduct.title}
              </h4>
              <p
                class="cart-drawer__upsell-text">
                ${theme.strings.sale}
                <span
                  class="cart-drawer__upsell-flow"
                  data-cart-upsell-item-price="${uspellProduct.variants[0].id}">
                  ${
                    flowPrice && flowPrice.length > 0
                      ? flowPrice
                      : formatAndTrimPrice(uspellProduct.price)
                  }
                </span>
              </p>
            </a>
            ${select}
            <button type="button" class="cart-drawer__upsell-add" data-add-upsell>
              <span data-add-upsell-loading class="upsell-loading-dots hide"></span>
              <span data-add-upsell-text>${theme.strings.addToCart}</span>
            </button>
          </div>
        </div>
        `;

        loop = false;
      }
    }
  }

  return pattern;
}

function handleUpsellRemove(event) {
  const $source = $(event.currentTarget);
  const id = $source.data("add-upsell-remove") || "";

  $source.closest(elements.upsellWrap).fadeOut(() => {
    localStorage.setItem(`upsell-hide-${id}`, true);
    $source.closest(elements.upsellWrap).remove();
  });
}

// on click, remove the item form cart
$(document).on("click", elements.remove, ajaxRemoveFromCartButton);

// change quantity when these buttons are clicked - these need product data to work
$(document).on(
  "mouseup touchend",
  elements.changeAjax,
  handlechangeAjaxButtonClick
);

$(document).on("change", elements.input, handleQtyInputChange);

// toggle quick cart from the right
$(document).on("mouseup touchend", elements.quick.toggle, quickCartToggle);

// ajaxify add to cart buttons
$(document).on("mouseup touchend", elements.add, handleAjaxAddButtonClick);

$(document).on("mouseup touchend", elements.addUpsell, handleAjaxAddUpsell);

$(document).on("mouseup touchend", elements.upsellRemove, handleUpsellRemove);

// run ajax on page load to get cart contents
$(document).ready(() => {
  containerLoading(true);

  return (async () => {
    await new Promise(resolve => {
      resolve(
        $.getJSON("/cart.js", json => {
          returnCartIfNotEmpty(json);
        })
      );
    });
  })();
});

$(document).keyup(event => {
  if (event.key === "Escape") {
    quickCartOpen(false);
  }
});
