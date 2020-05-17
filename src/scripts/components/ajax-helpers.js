import { formatMoney } from "@shopify/theme-currency";

const elements = {
  message: {
    container: "[data-ajax-message-container]",
    text: "[data-ajax-message-text]",
  },
};

const classes = {
  active: "active",
};

function resizeImage(src, size) {
  // remove any current image size then add the new image size
  return src
    .replace(
      /_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g,
      "."
    )
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => {
      return `_${size}${match}`;
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

let eventHolder = null;
function ajaxHeaderMessage(message) {
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

function getUrlParams() {
  const params = {};
  if (window.location.search.length > 0) {
    const pairs = document.location.search.substr(1).split("&");
    for (let i = 0; i < pairs.length; i++) {
      const paramsSplit = pairs[i].split("=");
      params[paramsSplit[0]] = paramsSplit[1];
    }
  }
  return params;
}

export { resizeImage, formatAndTrimPrice, ajaxHeaderMessage, getUrlParams };
