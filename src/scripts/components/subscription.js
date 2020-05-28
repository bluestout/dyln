import $ from "jquery";
import { handleAjaxAddButtonClick, addToCartComplete } from "./ajaxcart";

const selectors = {
  subToggle: "[data-subscription-toggle]",
  freqSelect: "#pdp-diffuser-freq-select",
  freqSelectSelected: "#pdp-diffuser-freq-select option:selected",
  intervalUnit: `[name="shipping_interval_unit_type"]`,
  idWrap: "#pdp-diffuser-variant-id-wrap",
  subVariant: "#pdp-diffuser-variant-id-wrap input",
  subVariantSelected: "#pdp-diffuser-variant-id-wrap input:checked",
  subAdd: "#pdp-diffuser-add-subscription",
  subRegularAdd: "#pdp-diffuser-add-regular",
  subBlock: "[data-subscription-button-block]",
  subVariantMap: "[data-subscription-variant-map]",
  customOption: "[data-subscription-button-block] .custom-select-option",
  customSelect: "[data-subscription-button-block] [data-custom-select-styled]",
  subCurrentPrice: "[data-subscription-current-price]",
  subCurrentRegularPrice: "[data-subscription-regular-price]",
  subCurrentFreq: "[data-subscription-current-frequency]",
  currency: "[data-subscription-currency-symbol]",
  subCustomLabel: "[data-subscription-custom-label]",
  subLoading: "[data-subscription-loading]",
  subLoaded: "[data-subscription-loaded]",
};

const classes = {
  hide: "hide",
};

function handleSubBlockToggle() {
  $(selectors.subBlock).toggleClass("hide");
}

function handleFrequencyChange() {
  const newFreq = $(`${selectors.freqSelect} option:selected`).text();
  const $freq = $(selectors.subCurrentFreq);
  $freq.text(newFreq);
}

function handleVariantClick() {
  try {
    const variantId = $(`${selectors.idWrap} input:checked`).val();
    const json = JSON.parse($(selectors.subVariantMap).val());
    const currency = $(selectors.currency).val();
    const $subprice = $(selectors.subCurrentPrice);
    const $regularPrice = $(selectors.subCurrentRegularPrice);
    const newSubPrice = `${currency}${json[variantId].discount_variant_price}`;
    const newRegularPrice = $(`${selectors.idWrap} input:checked`).data(
      "price"
    );
    $subprice.text(newSubPrice);
    $regularPrice.text(newRegularPrice);
  } catch (error) {}
}

function handleCustomLabelClick() {
  $(selectors.customSelect).click();
}

function toggleLoadingDots() {
  $(selectors.subLoading).removeClass(classes.hide);
  $(selectors.subLoaded).addClass(classes.hide);

  setTimeout(() => {
    $(selectors.subLoading).addClass(classes.hide);
    $(selectors.subLoaded).removeClass(classes.hide);
  }, 10000);
}

function handleRegularAdd(event) {
  toggleLoadingDots();
  handleAjaxAddButtonClick(event);
}

function handleSubAdd() {
  toggleLoadingDots();
  addSubscriptionAjax();
}

function addSubscriptionAjax() {
  const frequency = $(selectors.freqSelectSelected).val();
  const unit = $(selectors.intervalUnit).val();
  const variantId = $(selectors.subVariantSelected).val();
  const mapJson = JSON.parse($(selectors.subVariantMap).val());
  const newId = mapJson[variantId].discount_variant_id;
  const data = {
    id: newId,
    quantity: 1,
    properties: {
      shipping_interval_frequency: frequency,
      shipping_interval_unit_type: unit,
    },
  };
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    data: data,
    dataType: "json",
    cache: false,
    complete: (jqXHR, textStatus) => {
      addToCartComplete(jqXHR, textStatus);
      finishLoading();
    },
  });
}

function finishLoading() {
  $(selectors.subLoading).addClass(classes.hide);
  $(selectors.subLoaded).removeClass(classes.hide);
}

$(document).on("click", selectors.subAdd, handleSubAdd);
$(document).on("click", selectors.subToggle, handleSubBlockToggle);
$(document).on("click", selectors.subVariant, handleVariantClick);
$(document).on("change", selectors.freqSelect, handleFrequencyChange);
$(document).on("click", selectors.subCustomLabel, handleCustomLabelClick);
$(document).on("click", selectors.subRegularAdd, handleRegularAdd);

document.addEventListener("customSelectChange", handleFrequencyChange);
document.addEventListener("ajaxReloaded", finishLoading);
