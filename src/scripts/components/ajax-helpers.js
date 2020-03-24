import { formatMoney } from "@shopify/theme-currency";

function resizeImage(src, size) {
  // remove any current image size then add the new image size
  return src
    .replace(
      /_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g,
      "."
    )
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, match => {
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

export { resizeImage, formatAndTrimPrice };
