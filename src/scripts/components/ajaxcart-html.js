import { formatMoney } from "@shopify/theme-currency";
import { resizeImage, formatAndTrimPrice } from "./ajax-helpers";

const icons = {
  cart:
    "<svg width='35' height='28' viewBox='0 0 35 28' xmlns='http://www.w3.org/2000/svg'><g transform='translate(2 1)' stroke='#333C41' stroke-width='2' fill='none' fill-rule='evenodd' stroke-linecap='square'><path d='M25 4l-2.607 13H2.543L0 4M25 4l.682-4H32'/><circle cx='6.5' cy='23.5' r='2.5'/><circle cx='18.5' cy='23.5' r='2.5'/></g></svg>",
};

function quickCartUpsellHtml(product, url, index) {
  if (!product || !index) {
    return "";
  }
  let pattern = "";
  let options = "";
  for (let k = 0; k < product.variants.length; k++) {
    const variant = product.variants[k];
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
      ? `<div class="cart-drawer__upsell-selectbox"><select name="id" class="cart-drawer__upsell-select" data-upsell-select data-productid="${product.id}">${options}</select></div>`
      : "";
  const linkHref = url ? `href="${url}"` : `href="/products/${product.handle}"`;

  pattern = `
  <div class="cart-drawer__item-upsell" data-add-upsell-wrap>
    <input
      type="hidden"
      id="upsellQuantity${index}"
      name="quantity"
      value="1"/>
    <a ${linkHref} class="cart-drawer__upsell-image">
      ${productImageHtml(product)}
    </a>
    <a ${linkHref} class="cart-drawer__upsell-content">
      <h4 class="cart-drawer__upsell-item-title">${product.title}</h4>
      <p class="cart-drawer__upsell-text">
        <span data-cart-upsell-item-price="${product.variants[0].id}">
          ${formatAndTrimPrice(product.price)}
        </span>
      </p>
    </a>
    <div class="cart-drawer__upsell-form">
      ${select}
      <button type="button" class="cart-drawer__upsell-add" data-add-upsell>
        <span data-add-upsell-loading class="upsell-loading-dots hide"></span>
        <span data-add-upsell-text>${theme.strings.addToCart}</span>
      </button>
    </div>
  </div>
  `;
  return pattern;
}

function quickCartLineItemHtml(product, index) {
  if (!product || index < 0) {
    return "";
  }

  // prepare all the parts to show for each product in cart
  const image = productImageHtml(product, "240x240", "cart-drawer__image");
  const shownPrice = formatAndTrimPrice(product.line_price);
  const originalPrice = formatAndTrimPrice(product.original_line_price);

  let priceHtml = "";
  if (product.original_line_price > product.line_price) {
    priceHtml = `<span class="visually-hidden">
      ${theme.strings.discounted_price}
    </span>
    ${shownPrice}
    <span class="visually-hidden">${theme.strings.original_price}</span>
    <s class="strike-line">
      <span class="strike-text">${originalPrice}</span>
    </s>`;
  } else if (product.price === 0) {
    priceHtml = theme.strings.free_price;
  } else {
    priceHtml = shownPrice;
  }
  const linkHref = `href="${product.url}"`;
  const quantityHtml = `
  <div class="cart-drawer__item-qty">
    <button class="cart-drawer__item-button"
      type="button"
      data-direction="down"
      data-qty-change-ajax=".line-${index + 1}">-</button>

    <input type="number"
      class="cart-drawer__item-input line-${index + 1}"
      name="updates[]"
      id="qc_updates_${product.key}"
      data-line="${index + 1}"
      value="${product.quantity}"
      aria-label="${theme.strings.quantity}"/
      data-qty-input />

    <button class="cart-drawer__item-button"
      type="button"
      data-direction="up"
      data-qty-change-ajax=".line-${index + 1}">+</button>
  </div>`;

  // put together all the data into one line item
  const pattern = `
  <div
    class="cart-drawer__item"
    data-line="${index + 1}"
    data-quantity="${product.quantity}">
    <div class="cart-drawer__image-wrap">
      <a ${linkHref} class="cart-drawer__image-link">
        ${image}
      </a>
    </div>
    <div class="cart-drawer__item-content">
      <a ${linkHref} class="cart-drawer__item-link">
        <h4 class="cart-drawer__item-title">${product.product_title}</h4>
        <p class="cart-drawer__variant">${product.variant_title}</p>
      </a>
      ${quantityHtml}
      <p class="cart-drawer__item-price">${priceHtml}</p>

      </div>
      </div>
    `;

  /*
  <a
    class="cart-drawer__remove"
    href="/cart/change?line=${index}&amp;quantity=0"
    data-remove-item="${index + 1}"
    data-remove-id="${product.id}">
  </a>
  */
  return pattern;
}

function cartTotalsHtml(cart) {
  const priceRaw = cart ? cart.total_price : 0;
  let totalsHtml = "<div class='cart__totals-wrap'>";

  totalsHtml += `
  <p class="cart__totals-text">${theme.strings.subtotal}:</p>
  <p
    class="cart__totals-value"
    data-total="${formatMoney(priceRaw, theme.moneyFormat)}">
    ${formatMoney(priceRaw, theme.moneyFormat)}
  </p>`;

  totalsHtml += "</div>";
  return totalsHtml;
}

function cartLineItemHtml(product, index) {
  const image = `
  <a class="cart__table-product-image-wrap"
    href="${product.url}">
    ${productImageHtml(product)}
  </a>`;

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
      class="cart__table-qty-select line-${index + 1}"
      name="updates[]"
      id="updates_${product.key}"
      data-line="${index + 1}"
      aria-label="${theme.strings.quantity}"
      data-qty-input>
      ${selectOptionsString}
    </select>
  </div>`;

  // set each item in cart as table row
  const pattern = `
  <tr
    data-line=${index + 1}
    class="responsive-table-row">
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
          href="/cart/change?line=${index}&amp;quantity=0"
          data-remove-item="${index + 1}"
          data-remove-id="${product.id}">
          ${theme.strings.remove}
        </a>
      </div>
    </td>

    <td
      class="cart__table-cell d-none d-md-table-cell">
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
          <span>${lineTotal}</span>
          <div class="cart__table-remove-wrap">
            <a
              class="cart__table-remove"
              href="/cart/change?line=${index}&amp;quantity=0"
              data-remove-item="${index + 1}"
              data-remove-id="${product.id}">
              ${theme.strings.remove}
            </a>
          </div>
        </div>
      </div>

    </td>

    <td
      class="cart__table-cell d-none d-md-table-cell"
      data-label="${theme.strings.total}">
      ${lineTotal}
    </td>
  </tr>`;
  return pattern;
}

function emptyCartHtml() {
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
  return empty;
}

function productImageHtml(product, format, className) {
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

export {
  quickCartUpsellHtml,
  productImageHtml,
  quickCartLineItemHtml,
  cartLineItemHtml,
  cartTotalsHtml,
  emptyCartHtml,
};
