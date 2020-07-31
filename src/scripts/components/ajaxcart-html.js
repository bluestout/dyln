import { formatMoney } from "@shopify/theme-currency";
import {
  resizeImage,
  formatAndTrimPrice,
  stripHtml,
  handleize,
} from "./helpers";

const names = {
  color: "color,colour",
  amount: "amount,number",
};

function adjustDiffuserText(text) {
  if (text === "1 Diffuser") {
    return "Single Pack";
  } else if (text && text.indexOf(" Diffusers") > -1) {
    return text.replace(" Diffusers", "-pack");
  }
  return text;
}

function quickCartUpsellHtml(product, url, index) {
  if (!product || !index) {
    return;
  }
  let pattern = "";
  let options = "";
  let optionsWrap = "";

  if (product.variants) {
    for (let k = 0; k < product.variants.length; k++) {
      const variant = product.variants[k];
      options += `
      <option
        ${variant.available ? "" : "disabled='disabled'"}
        value="${variant.id}"
        data-price="${formatAndTrimPrice(variant.price)}"
        data-id="${variant.id}">
          ${variant.title}
      </option>
      `;
    }

    for (let k = 0; k < product.options.length; k++) {
      const option = product.options[k].trim().toLowerCase();
      const optionlabel = `option${k + 1}`;
      if (names.color.indexOf(option) > -1) {
        let colorInputs = "";
        let isChecked = false;
        for (let j = 0; j < product.variants.length; j++) {
          const variant = product.variants[j];

          if (variant[optionlabel]) {
            const colorHandle = stripHtml(
              handleize(variant.title.trim().toLowerCase())
            );
            const swatch = `color-swatch-${colorHandle}`;
            let checkedStatus = "";
            if (variant.available && !isChecked) {
              checkedStatus = `checked="checked"`;
              isChecked = true;
            }
            colorInputs += `<label
                class="visually-hidden"
                for="cu-${option}-${index}"
                tabindex="-1">
                ${variant.title}
              </label>`;
            colorInputs += `<input type="radio"
              tabindex="-1"
              id="cu-${option}-${index}"
              name="cu-${option}-${index}"
              value="${variant[optionlabel]}"
              class="cart-drawer__upsell-radio-color ${swatch}"
              data-price="${formatAndTrimPrice(variant.price)}"
              data-id="${variant.id}"
              data-upsell-input
              ${checkedStatus}
              ${variant.available ? "" : `disabled="disabled"`} />`;
          }
        }
        optionsWrap += `<div class="cart-drawer__upsell-selectbox">${colorInputs}</div>`;
      } else {
        let amountInputs = "";
        let isChecked = false;
        for (let j = 0; j < product.variants.length; j++) {
          const variant = product.variants[j];
          if (variant[optionlabel]) {
            amountInputs += `<span class="cart-drawer__upsell-input-wrap">`;
            let checkedStatus = "";
            if (variant.available && !isChecked) {
              checkedStatus = `checked="checked"`;
              isChecked = true;
            }
            amountInputs += `<input type="radio"
              tabindex="-1"
              id="cu-${option}-${index}"
              name="cu-${option}-${index}"
              value="${adjustDiffuserText(variant[optionlabel])}"
              class="cart-drawer__upsell-radio-input"
              data-price="${formatAndTrimPrice(variant.price)}"
              data-id="${variant.id}"
              data-upsell-input
              ${checkedStatus}
              ${variant.available ? "" : `disabled="disabled"`} />`;
            amountInputs += `<label
              class="cart-drawer__upsell-label"
              for="cu-${option}-${index}"
              tabindex="-1">
              ${adjustDiffuserText(variant[optionlabel])}
            </label>`;
            amountInputs += "</span>";
          }
        }
        optionsWrap += `<div class="cart-drawer__upsell-selectbox">${amountInputs}</div>`;
      }
    }
  }

  const select =
    options.length > 1
      ? `<select name="id" tabindex="-1" class="visually-hidden shown-on-focus" data-upsell-select>${options}</select>`
      : "";
  const linkHref = url ? `href="${url}"` : `href="/products/${product.handle}"`;

  pattern = `
  <div class="cart-drawer__item-upsell" data-upsell-wrap>
    <input
      type="hidden"
      id="upsellQuantity${index}"
      name="quantity"
      value="1" tabindex="-1"/>
    <a ${linkHref} class="cart-drawer__upsell-image" tabindex="-1">
      ${productImageHtml(product)}
    </a>
    <a ${linkHref} class="cart-drawer__upsell-content" tabindex="-1">
      <h4 class="cart-drawer__upsell-item-title">${product.title}</h4>
      <p class="cart-drawer__upsell-text">
      <span data-upsell-price>
        ${formatAndTrimPrice(product.price)}
      </span>
      </p>
    </a>
    <button type="button" class="cart-drawer__upsell-add d-sm-none" data-upsell-submit tabindex="-1">
      <span data-upsell-loading class="loading-dots hide"></span>
      <span data-upsell-text><span aria-hidden="true">+</span><span class="visually-hidden">${theme.strings.addToCart}</span></span>
    </button>
    <div class="cart-drawer__upsell-form">
      ${optionsWrap}
      ${select}
      <button type="button" class="cart-drawer__upsell-add d-none d-sm-block" data-upsell-submit tabindex="-1">
        <span data-upsell-loading class="loading-dots hide"></span>
        <span data-upsell-text>${theme.strings.addToCart}</span>
      </button>
    </div>
  </div>
  `;
  return pattern;
}

function getFrequencyText(frequency, intervalUnit) {
  if (!frequency) {
    return theme.strings.select_frequency;
  }
  let frequencyText = `${theme.strings.every}`;
  if (frequency === "1") {
    frequencyText += ` ${intervalUnit.replace("s", "")}`;
  } else if (frequency === "12" && intervalUnit === "Months") {
    frequencyText += ` ${theme.strings.year}`;
  } else {
    frequencyText += ` ${frequency} ${intervalUnit}`;
  }
  return frequencyText;
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
  let linkHref = `href="${product.url}"`;

  const subMetadata = JSON.parse($("[data-subscription-metadata]").html());

  const invertedVariantArray = {};

  // check if product CAN be a subscription
  let isSubscription = false;
  for (const key in subMetadata) {
    if (!subMetadata.hasOwnProperty(key)) continue;
    if (key === "map") {
      const obj = subMetadata[key];
      for (const prop in obj) {
        invertedVariantArray[obj[prop].discount_variant_id] = prop;
        if (!obj.hasOwnProperty(prop)) continue;
        if (obj[prop].discount_variant_id === product.variant_id) {
          isSubscription = true;
        }
      }
    }
  }

  if (isSubscription && subMetadata.url) {
    linkHref = `href="${subMetadata.url}"`;
  }

  let subscriptionHtml = "";
  let productVariantTitle = product.variant_title;
  if (productVariantTitle.toLowerCase().indexOf("diffuser") > -1) {
    productVariantTitle = adjustDiffuserText(productVariantTitle);
  }

  const frequencyUnit = product.properties.shipping_interval_frequency;
  let intervalUnit = product.properties.shipping_interval_unit_type;

  let isSubscribableProduct = false;
  if (subMetadata.id && product.product_id === subMetadata.id) {
    intervalUnit = subMetadata.unit;
    isSubscribableProduct = true;
  }

  if (isSubscription || isSubscribableProduct) {
    subscriptionHtml = `<div class="cart-drawer__subscription-box">`;
    let customSelectOptionsClassname = "custom-select-options";

    customSelectOptionsClassname = "custom-select-options full";
    subscriptionHtml += `<input type="checkbox"
        id="sub-check-${product.variant_id}-${index}"
        name="sub-check-${product.variant_id}-${index}"
        data-qc-subscription-convert
        ${isSubscription ? "checked=checked" : ""}
        />
      <label
        for="sub-check-${product.variant_id}-${index}"
        class="visually-hidden">
        ${theme.strings.subscribe}
      </label>
      <span class="cart-drawer__subscription-box-btn">
        <span data-qc-subscription-price>
          ${formatMoney(product.price, theme.moneyFormat)}
        </span>
        <span><strong>${theme.strings.subscribe}</strong></span>
      </span>`;

    subscriptionHtml += `<div class="custom-select">
      <button type="button" class="custom-select-styled" data-custom-select-free>
        <span data-qc-subscription-description>
        ${getFrequencyText(frequencyUnit, intervalUnit)}
        </span>
        <svg width="7" height="3" viewBox="0 0 7 3" xmlns="http://www.w3.org/2000/svg"><path d="M1 0l2.5 2.5L6 0" stroke="#333C41" fill="none" fill-rule="evenodd" stroke-linecap="round"/></svg>
      </button>
      <div class="${customSelectOptionsClassname}" data-custom-select-options="" style="display: none;">
    `;

    for (let a = 0; a < subMetadata.frequencies.length; a++) {
      const frequency = subMetadata.frequencies[a];
      let checkedStatus = "";
      if (frequency == frequencyUnit) {
        checkedStatus = `checked="checked"`;
      }
      const frequencyText = getFrequencyText(frequency, intervalUnit);

      let subVariantPrice = 0;
      let subVariantId = 0;
      let regularVariantId = 0;

      try {
        regularVariantId = invertedVariantArray[product.variant_id];
      } catch (error) {
        regularVariantId = product.variant_id;
      }

      try {
        subVariantId = subMetadata.map[product.variant_id].discount_variant_id;
        subVariantPrice = formatMoney(
          subMetadata.map[product.variant_id].discount_variant_price,
          theme.moneyFormat
        );
      } catch (error) {
        subVariantPrice = formatMoney(product.price, theme.moneyFormat);
        subVariantId = product.id;
      }

      subscriptionHtml += `
        <div class="custom-select-option">
          <input type="radio"
          tabindex="-1"
          id="sub-${product.variant_id}-${index}"
          name="sub-${product.variant_id}-${index}"
          value="${frequency}"
          ${checkedStatus}
          data-line="${index + 1}"
          data-id="${regularVariantId}"
          data-sub-id="${subVariantId}"
          data-unit="${intervalUnit}"
          data-frequency="${frequency}"
          data-text="${frequencyText}"
          data-price="${subVariantPrice}"
          data-subscription=${isSubscription ? "yes" : "no"}
          data-qc-frequency-input />
          <label
            for="sub-${product.variant_id}-${index}">
            ${frequencyText}
          </label>
        </div>
      `;
    }
    subscriptionHtml += `
    </div>
    </div>
    </div>
    `;
  }

  const quantityHtml = `
  <div class="cart-drawer__item-qty">
    <button class="cart-drawer__item-button"
      type="button"
      data-direction="down"
      data-qty-change-ajax=".line-${index + 1}"
      tabindex="-1">
      -
    </button>

    <input type="number"
      class="cart-drawer__item-input line-${index + 1}"
      name="updates[]"
      id="qc_updates_${product.key}"
      data-line="${index + 1}"
      value="${product.quantity}"
      aria-label="${theme.strings.quantity}"/
      data-qty-input
      tabindex="-1"/>

    <button class="cart-drawer__item-button"
      type="button"
      data-direction="up"
      data-qty-change-ajax=".line-${index + 1}"
      tabindex="-1">
      +
    </button>
  </div>`;

  // put together all the data into one line item
  const pattern = `
  <div
    class="cart-drawer__item"
    data-cart-drawer-item
    data-line="${index + 1}"
    data-quantity="${product.quantity}">
    <div class="cart-drawer__image-wrap">
      <a ${linkHref} class="cart-drawer__image-link">
        ${image}
      </a>
    </div>
    <div class="cart-drawer__item-content">
      <a ${linkHref} class="cart-drawer__item-link" tabindex="-1">
        <h4 class="cart-drawer__item-title">${product.product_title}</h4>
        <p class="cart-drawer__variant">${productVariantTitle}</p>
      </a>
      ${subscriptionHtml}
      ${quantityHtml}
      <p class="cart-drawer__item-price">${priceHtml}</p>

      </div>
    </div>
    `;
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

  if (variantTitle) {
    titleBr = "<br>";
  }

  const showLink = `href="${product.url}"`;
  const lineTotal = formatMoney(product.line_price, theme.moneyFormat);
  const linePrice = formatMoney(product.price, theme.moneyFormat);

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
        ${titleBr}
        <span class="cart__table-product-info">${variantTitle}</span>
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
            <span class="cart__table-product-info">${variantTitle}</span>
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
      data-label="${theme.strings.cart_price}">
      ${linePrice}
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
  if (!product) {
    return "";
  }
  let alt = "";
  if (product.title) {
    alt = product.title;
  } else if (product.product_title) {
    alt = product.product_title;
  }
  let image = "";
  let domClass = "";
  if (className) {
    domClass = `class="${className}"`;
  }
  const size = format || "240x240";

  if (product.featured_image) {
    if (!product.featured_image.url) {
      image = resizeImage(product.featured_image, size);
    } else {
      image = resizeImage(product.featured_image.url, size);
      if (product.featured_image.alt) {
        alt = product.featured_image.alt;
      }
    }
  } else if (product.image) {
    image = resizeImage(product.featured_image, size);
  }
  if (image.length > 0) {
    return `<img src="${image}" ${domClass} alt="${alt}" />`;
  }
}

export {
  quickCartUpsellHtml,
  productImageHtml,
  quickCartLineItemHtml,
  cartLineItemHtml,
  cartTotalsHtml,
  emptyCartHtml,
};
