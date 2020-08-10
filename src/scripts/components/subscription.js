import $ from "jquery";
import { handleAjaxAddButtonClick, addToCartComplete } from "./ajaxcart";

const selectors = {
  parent: "[data-subscription-form-wrap]",
  subToggle: "[data-subscription-toggle]",
  freqSelect: "[data-diffuser-freq-select]",
  freqSelectSelected: "[data-diffuser-freq-select] option:selected",
  intervalUnit: `[name="shipping_interval_unit_type"]`,
  idWrap: "[data-diffuser-variant-id-wrap]",
  subVariant: "[data-diffuser-variant-id-wrap] input",
  subVariantSelected: "[data-diffuser-variant-id-wrap] input:checked",
  subAdd: "[data-diffuser-add-subscription]",
  subRegularAdd: "[data-diffuser-add-regular]",
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

function handleSubBlockToggle(event) {
  $(event.target).closest(selectors.parent).find(selectors.subBlock).toggleClass("hide");
}

function handleFrequencyChange(event) {
  const newFreq = $(event.target).closest(selectors.parent).find(selectors.freqSelectSelected).text();
  const $freq = $(event.target).closest(selectors.parent).find(selectors.subCurrentFreq);
  $freq.text(newFreq);
}

function handleVariantClick(event) {
  const $parent = $(event.target).closest(selectors.parent);
  try {
    const variantId = $parent.find(selectors.subVariantSelected).val();
    const json = JSON.parse($parent.find(selectors.subVariantMap).val());
    const currency = $parent.find(selectors.currency).val();
    const newSubPrice = `${currency}${json[variantId].discount_variant_price}`;
    const newRegularPrice = $parent.find(selectors.subVariantSelected).data("price");
    $parent.find(selectors.subCurrentPrice).text(newSubPrice)
    $parent.find(selectors.subCurrentRegularPrice).text(newRegularPrice);
  } catch (error) {}
}

function handleCustomLabelClick(event) {
  $(event.target).closest(selectors.parent).find(selectors.customSelect).click();
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

function handleSubAdd(event) {
  toggleLoadingDots();
  addSubscriptionAjax($(event.target).closest(selectors.parent));
}

function addSubscriptionAjax($parent) {
  if ($parent.length === 0) {
    return null;
  }
  const frequency = $parent.find(selectors.freqSelectSelected).val();
  const unit = $parent.find(selectors.intervalUnit).val();
  const variantId = $parent.find(selectors.subVariantSelected).val();
  const mapJson = JSON.parse($parent.find(selectors.subVariantMap).val());
  const newId = mapJson[variantId].discount_variant_id;
  subscriptionAjax(newId, 1, frequency, unit);
}

function subscriptionAjax(id, quantity, frequency, unit) {
  if ((!id, !frequency, !unit)) {
    return null;
  }
  let qty = quantity;
  if (!quantity) {
    qty = 1;
  }
  const data = {
    id: id,
    quantity: qty,
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

export { subscriptionAjax };
