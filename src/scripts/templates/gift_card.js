import QRCode from "qrcode";

/**
 * Gift Card Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Gift Card template.
 */

const selectors = {
  qrCodeCanvas: "[data-gift-card-qr]",
  printButton: "[data-gift-card-print]",
  giftCardCode: "[data-gift-card-digits]",
};

// This is the QR code that allows customers to use at a POS
const canvas = document.querySelectorAll(selectors.qrCodeCanvas);
for (let i = 0; i < canvas.length; i++) {
  QRCode.toCanvas(canvas[i], canvas[i].dataset.identifier);
}

const printButtons = document.querySelectorAll(selectors.printButton);
for (let i = 0; i < printButtons.length; i++) {
  printButtons[i].addEventListener("click", () => {
    window.print();
  });
}

// Auto-select gift card code on click, based on ID passed to the function
const giftCardCodes = document.querySelectorAll(selectors.giftCardCode);
for (let i = 0; i < giftCardCodes.length; i++) {
  giftCardCodes[i].addEventListener("click", (evt) => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(evt.target);
    selection.removeAllRanges();
    selection.addRange(range);
  });
}
