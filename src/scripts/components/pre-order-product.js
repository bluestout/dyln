import $ from "jquery";
import section from "@shopify/theme-sections/section";

const selectors = {
  productData: "[data-product-data]",
  productAddOns: "[data-product-right-col]",
  preOrderProducts: "[data-pre-order-products]",
  popAddOns: "[data-pop-add-ons]"
};

function calculateProductDataHeight() {
  setTimeout(function () {
    let prodDataHeight = $(selectors.productData).height();
    let preOrderProducts = $(selectors.preOrderProducts).height();

    if ($(window).width() < 1024) {
      preOrderProducts = preOrderProducts - 100;

      $(selectors.productAddOns).css("top", preOrderProducts + "px");

      calculateSectionHeight(preOrderProducts);
    } else {
      prodDataHeight = prodDataHeight + 60;
      $(selectors.productAddOns).css("top", prodDataHeight + "px");
    }
  }, 1000);
}

function calculateSectionHeight(sectionHeight) {
  let addOnsHeight = $(selectors.popAddOns).height();
  sectionHeight = sectionHeight + addOnsHeight + 200;

  $(".pop").css("height", sectionHeight + "px");
}

$(document).on("ready", calculateProductDataHeight());
