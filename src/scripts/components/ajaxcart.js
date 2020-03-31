import $ from "jquery";
import { formatMoney } from "@shopify/theme-currency";
import { formatAndTrimPrice } from "./ajax-helpers";
import {
  quickCartUpsellHtml,
  quickCartLineItemHtml,
  cartLineItemHtml,
  cartTotalsHtml,
  emptyCartHtml
} from "./ajaxcart-html";

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
    checkout: "[data-cart-drawer-checkout]",
    empty: "[data-cart-drawer-empty]",
    payments: "[data-cart-drawer-payments]"
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
  const totalsHtml = cartTotalsHtml(cart);
  return $(elements.cart.totals).html(totalsHtml);
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
    cartItems += quickCartLineItemHtml(product, i);
  }

  // insert all the prepared items in the cart
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
        <button class="cart-drawer__checkout" name="checkout" type="submit" data-cart-drawer-checkout>
          <span class="cart-drawer__checkout-text">${theme.strings.checkout}</span>
          <svg class="cart-drawer__checkout-icon" width='20' height='22' viewBox='0 0 20 22' xmlns='http://www.w3.org/2000/svg'><g transform='translate(.573 1.784)' fill='none' fill-rule='evenodd'><rect stroke='#FFF' stroke-width='2' x='1' y='7.703' width='16.958' height='11.405' rx='2'/><path d='M3.991 7.122V4.608C3.991 2.063 6.071 0 8.635 0h1.688c2.565 0 4.644 2.063 4.644 4.608v2.514' stroke='#FFF' stroke-width='2' stroke-linejoin='round'/><ellipse fill='#FFF' cx='9.479' cy='12.149' rx='2.494' ry='2.095'/><path stroke='#FFF' stroke-width='2' stroke-linecap='round' d='M9.479 13.405v2.466'/></g></svg>
        </button>
        <div class="cart-drawer__payments">
          <span class="cart-drawer__payments-title">${theme.strings.pay_using}</span>
          <span class="cart-drawer__payment">
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
    $source.find(elements.addText).addClass("hide");
    $source.find(elements.addLoading).removeClass("hide");
  } else {
    $(elements.addText).removeClass("hide");
    $(elements.addLoading).addClass("hide");
  }
}

function toggleQuickCartEmptyStatus(empty) {
  const $empty = $(elements.quick.empty);
  const $quickContent = $(elements.quick.content);
  const $payments = $(elements.quick.payments);

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

  toggleAddingToCartAnimation($source, true);
  $loading.removeClass("hide");
  $text.addClass("hide");

  setTimeout(() => {
    toggleAddingToCartAnimation($source, false);
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
  } else {
    console.log("error: ", jqXHR.responseJSON.description);
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

  $count.html(cart.item_count);
  $countDrawer.html(cart.item_count);
}

// what to show on cart page if the cart is empty
function cartIsEmpty() {
  const empty = emptyCartHtml();
  return $(elements.cart.container).html(empty);
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
  containerLoading();
  toggleAddingToCartAnimation($(elements.add));
  handleCartDrawerCheckoutHeight();
  document.dispatchEvent(ajaxReloaded);
}

// show/hide the quickcart
function quickCartToggle(event) {
  event.preventDefault();

  const $quickCart = $(elements.quickcart);
  const $page = $(elements.quickcart);
  $(elements.nav).removeClass(classes.active);
  $page.removeClass(classes.active);
  $(elements.pageWrap).removeClass(classes.active);

  if ($quickCart.hasClass(classes.open)) {
    $quickCart.removeClass(classes.open);
    $(elements.quick.overlay).removeClass(classes.active);
    $("html").removeClass("no-scroll");

    if ($(window).width() < 992) {
      $page.removeClass(classes.activeCart);
    }
  } else {
    $quickCart.addClass(classes.open);
    $(elements.quick.overlay).addClass(classes.active);
    $("html").addClass("no-scroll");

    if ($(window).width() < 992) {
      $page.addClass(classes.activeCart);
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
  const quickcartHeight = $(elements.quick.content).outerHeight();
  const productWrapHeight = $(elements.quick.wrap).outerHeight();
  const totalsHeight = $(elements.quick.totalsWrap).outerHeight();
  console.log("quickcartHeight: ", quickcartHeight);
  console.log("totalsHeight: ", totalsHeight);
  console.log("productWrapHeight: ", productWrapHeight);
  console.log("height diff: ", quickcartHeight - totalsHeight);

  $(elements.quick.wrap).css("height", quickcartHeight - totalsHeight);
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

// on click, remove the item form cart
$(document).on("click", elements.remove, ajaxRemoveFromCartButton);

// change quantity when these buttons are clicked - these need product data to work
$(document).on(
  "click",
  elements.changeAjax,
  handlechangeAjaxButtonClick
);

$(document).on("change", elements.input, handleQtyInputChange);
// toggle quick cart from the right
$(document).on("click", elements.quick.toggle, quickCartToggle);
// ajaxify add to cart buttons
$(document).on("click", elements.add, handleAjaxAddButtonClick);
$(document).on("click", elements.addUpsell, handleAjaxAddUpsell);

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

export { addToCartComplete };
