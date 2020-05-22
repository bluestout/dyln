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

function stripHtml(text) {
  if (!text || typeof text !== "string") {
    return "";
  }
  return text
    .replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "")
    .replace(/(\r\n|\n|\r)/gm, "");
}

function handleize(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/, "")
    .replace(/^-/, "");
}

function toggleTabindexInChildren($element, mode) {
  /**
   * @param {$element} $element Element whose children's tabindex to toggle, required
   * @param {mode}           mode Optional, mode 1 will show all tabindexed children, 2 will hide all
   */
  if (!$element || $element.length === 0) {
    return null;
  }

  const $inactive = $element.find(`[tabindex="-1"]:not(img)`);
  const $all = $element.find(`[tabindex]:not(img)`);

  if (mode === 1) {
    return $all.attr("tabindex", 0);
  } else if (mode === 2) {
    return $all.attr("tabindex", -1);
  } else if ($inactive.length > 0) {
    return $inactive.attr("tabindex", 0);
  } else {
    return $all.attr("tabindex", -1);
  }
}

export {
  resizeImage,
  formatAndTrimPrice,
  ajaxHeaderMessage,
  stripHtml,
  handleize,
  toggleTabindexInChildren,
};
