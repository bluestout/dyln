import $ from "jquery";
import "slick-carousel";
import { formatMoney } from "@shopify/theme-currency";

const classes = {
  active: "active",
  focused: "focused",
};

const datasets = {
  value: "pi-option-value",
  image: "pi-image",
  gallery: "pi-image-gallery",
  opName: "pi-option-name",
  option: "pi-option",
  index: "pi-option-index",
  slick: "slick-index",
  addOn: {
    value: "add-on-option-value",
    image: "add-on-image",
    gallery: "add-on-image-gallery",
    opName: "add-on-option-name",
    option: "add-on-option",
    index: "add-on-option-index",
  }
};

const selectors = {
  value: `[data-${datasets.value}]`,
  image: `[data-${datasets.image}]`,
  gallery: `[data-${datasets.gallery}]`,
  opName: `[data-${datasets.opName}]`,
  option: `[data-${datasets.option}]`,
  slick: `[data-${datasets.slick}]`,
  current: `.${classes.active}[data-${datasets.image}]`,
  slickOnLoadGallery: "[data-pi-image-gallery-onload]",
  item: "[data-pi-item]",
  json: "[data-product-json]",
  select: "[data-pi-variant-select]",
  submit: "[data-pi-submit]",
  submitprice: "[data-pi-submit-price]",
  submitText: "[data-pi-submit-text]",
  price: "[data-pi-price]",
  compare: "[data-pi-compare]",
  slideById: (id) => `[data-slick-index=${id}]`,
  slickSlider: ".slick-slider",
  optionLabel: "[data-pi-current-option]",
  optionWrap: "[data-pi-option-wrap]",
  preOrders: "[data-pre-order-products]",
  preOrdersTabLink: "[data-pre-order-products] [data-tab-link]",
  preOrderButton: "[data-pre-order-button]",
  preOrderAddOn: "[data-pop-add-on]",
  tabByIndex: (index) => `[data-tab="${index}"]`,
  preOrderCheckbox: "[data-add-on-add-this]",
  addOnParent: "[data-add-on-parent]",
  settings: "[data-product-schema-settings]",
  hideOnLoad: "[data-pre-order-slick-load]",
  preOrderCount: "[data-pre-order-count]",
  formInForm: "[data-pre-order-form-in-form]",
  addOn: {
    value: `[data-${datasets.addOn.value}]`,
    image: `[data-${datasets.addOn.image}]`,
    gallery: `[data-${datasets.addOn.gallery}]`,
    opName: `[data-${datasets.addOn.opName}]`,
    option: `[data-${datasets.addOn.option}]`,
    slick: `[data-${datasets.addOn.slick}]`,
    select: "[data-add-on-variant-select]",
  }
};

// let slickEventTimer;
function handleOptionClick(event) {
  const $source = $(event.target);
  const $slick = $source.closest(selectors.item).find(selectors.slickSlider);
  const opName = $source.data(datasets.opName);

  if ($source.length === 0 || !opName) {
    return null;
  }

  if (opName === "color" || opName === "sleeve") {
    if ($slick.length > 0) {
      handleSlickChange($source);
    } else {
      handleColorChange($source);
    }
  }

  renderOptionLabel($source);
  return handleVariantChange($source);
}

function renderOptionLabel($source) {
  const $optionLabel = $source.closest(selectors.optionWrap).find(selectors.optionLabel);
  if ($optionLabel.length === 0) {
    return null;
  } else {
    return $optionLabel.text($source.data(datasets.value));
  }
}

function handleColorChange($source) {
  const color = $source.data(datasets.value);
  const $parent = $source.closest(selectors.item);
  const $newImage = $parent.find(`[data-${datasets.image}="${color}"]`);
  const $currentImage = $parent.find(selectors.current);

  if ($newImage.length > 0 && !$newImage.hasClass(classes.active)) {
    if ($currentImage.length === 0) {
      $newImage.fadeIn("fast");
      $newImage.addClass(classes.active);
    } else {
      $currentImage.fadeOut("fast", () => {
        $newImage.fadeIn("fast");
        $newImage.addClass(classes.active);
        $currentImage.removeClass(classes.active);
      });
    }
  }
}

function handleSlickChange($source) {
  const color = $source.data(datasets.value);
  const $parent = $source.closest(selectors.item);
  const $newImages = $parent.find(`[data-${datasets.image}="${color}"]`);
  let index = -1;
  for (let i = 0; i < $newImages.length; i++) {
    const $image = $($newImages[i]);
    const $slide = $image.closest(selectors.slick);
    const newIndex = $slide.data(datasets.slick);
    if (newIndex > -1) {
      index = newIndex;
      break;
    }
  }

  if (index > -1) {
    if ($parent.find(selectors.gallery).length > 0 || $parent.find(selectors.slickOnLoadGallery).length > 0) {
      setTimeout(() => {
        $parent.find(selectors.slickSlider).first().slick("slickGoTo", index);
      }, 100);
    }
  }
}

function handleVariantChange($source) {
  let $parent = $source.closest(selectors.item);
  if ($source.closest(selectors.formInForm).length > 0) {
    $parent = $source.closest("form");
  }
  const $jsonElement = $parent.find(selectors.json);
  const $select = $parent.find(selectors.select);

  if (
    $parent.length === 0 ||
    $jsonElement.length === 0 ||
    $select.length === 0
  ) {
    return null;
  }

  const variants = JSON.parse($jsonElement.html());
  const $options = $parent.find(selectors.option);

  const newVariant = getSelectedVariant(variants.variants, $options, $source);

  return renderVariant(newVariant, $parent);
}

function getSelectedVariant(variants, $options, $new) {
  //  exclude $new to only get the current variant
  const optionValues = [];
  $options.each((index, option) => {
    const $input = $(option).find("input:checked");
    optionValues.push($input.val());
  });

  const options = {
    Option1: optionValues[0] || null,
    Option2: optionValues[1] || null,
    Option3: optionValues[2] || null,
  };

  if ($new && $new.length > 0) {
    const index = $new.data(datasets.index);
    const value = $new.data(datasets.value);
    const indexName = `Option${index}`;
    options[indexName] = value;
  }

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    if (
      variant.Option1 === options.Option1 &&
      variant.Option2 === options.Option2 &&
      variant.Option3 === options.Option3
    ) {
      return variant;
    }
  }

  return null;
}

function renderVariant(variant, $parent) {
  if (!$parent || $parent.length === 0) {
    return null;
  }

  renderProductOptions(variant, $parent);
  renderProductPrice(variant, $parent);
  // now handled in geolocation.js
  // renderProductSubmit(variant, $parent);
  return null;
}

function renderProductPrice(variant, $parent) {
  if (!variant || variant.length === 0) {
    return null;
  }
  const price = variant.price;
  const compareAt = variant.compare_at;

  const $regularPriceElement = $parent.find(selectors.price);
  const $comparePriceElement = $parent.find(selectors.compare);
  const $submitPriceElement = $parent.find(selectors.submitprice);

  $regularPriceElement.html(
    formatMoney(price, theme.moneyFormat).replace(".00", "")
  );
  $submitPriceElement.html(
    `${formatMoney(price, theme.moneyFormat).replace(".00", "")} `
  );
  if (compareAt && compareAt > 0) {
    $comparePriceElement.html(
      formatMoney(compareAt, theme.moneyFormat).replace(".00", "")
    );
  } else {
    $comparePriceElement.html("");
  }
  return null;
}

function renderProductSubmit(variant, $parent) {
  const $submit = $parent.find(selectors.submit);
  const $submitText = $parent.find(selectors.submitText);

  if (!variant) {
    $submit.attr("disabled", "disabled");
    $submitText.text(theme.strings.unavailable);
  } else if (variant.available) {
    $submit.removeAttr("disabled");
    $submitText.text(theme.strings.addToCart);
  } else {
    $submit.attr("disabled", "disabled");
    $submitText.text(theme.strings.soldOut);
  }
  return null;
}

function renderProductOptions(variant, $parent) {
  if (!$parent || $parent.length === 0 || !variant) {
    return null;
  }
  const $select = $parent.find(selectors.select);
  $select.find("option").removeAttr("selected");
  const $newOption = $select.find(`option[value="${variant.id}"]`);
  $newOption.attr("selected", "selected");
  $select.change();
  return null;
}

function onFocusChange() {
  const $item = $(document.activeElement).closest(selectors.item);
  const $allOtherItems = $(selectors.item).not($item);
  $allOtherItems.removeClass("active");

  if ($item.length > 0) {
    $item.addClass("active");
  }
  $allOtherItems.removeClass("active");
}

function onItemHoverOut() {
  const $allItems = $(selectors.item);
  $allItems.removeClass("active");
}

function slickHideOnLoad() {
  $(selectors.hideOnLoad).each((index, item) => {
    $(item).css("display", "none");
  });
}

function init() {
  const $gallery = $(`${selectors.gallery}`);
  const $images = $gallery.find(selectors.image);
  $images.each((index, option) => {
    $(option).css("display", "block");
  });

  let fading = false;
  try {
    const options = JSON.parse($(selectors.settings).text());
    fading = options.fade_pi;
  } catch (error) { }

  $gallery.slick({
    swipeToSlide: true,
    arrows: false,
    dots: false,
    slidesToShow: 1,
    centerMode: false,
    infinite: true,
    speed: 300,
    fade: fading,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerMode: true,
          centerPadding: "25%",
          initialSlide: 0,
        },
      }
    ],
  });

  $($gallery).on("afterChange", (event, slick, nextSlide) => {
    const $slide = $(event.currentTarget).find(`[data-slick-index="${nextSlide}"]`);
    const color = $slide.find(selectors.image).data(datasets.image);
    return $slide.closest(selectors.item).find(`[data-${datasets.value}="${color}"]`).click();
  });
}

function handlePreOrderTabClick(event) {
  const $source = $(event.currentTarget);
  const index = $source.data("tab-link");
  const $tab = $source.closest(selectors.preOrders).find(selectors.tabByIndex(index));
  if ($tab.length > 0) {
    $tab.find(`${selectors.value}`).first().click();
  }
}

function handlePreOrderButtonClick(event) {
  const $parent = $(event.currentTarget).closest(selectors.addOnParent);
  const $addOns = $parent.find(selectors.preOrderAddOn);
  $addOns.each((index, addon) => {
    const data = $(addon).find("form").serialize();
    const checked = $(addon).find(selectors.preOrderCheckbox).prop("checked");
    if (checked && data) {
      $.ajax({
        type: "POST",
        url: "/cart/add.js",
        async: false,
        data: data,
        dataType: "json",
        cache: false,
      });
    }
  });
  $parent.find(selectors.submit).click();
}

function handlePreOrderCount(event) {
  const $parent = $(event.currentTarget).closest(selectors.addOnParent);
  const $addOns = $parent.find(selectors.preOrderAddOn);
  const $countElement = $parent.find(selectors.preOrderCount);
  let count = 1;
  $addOns.each((index, addon) => {
    if ($(addon).find(selectors.preOrderCheckbox).prop("checked")) {
      count++;
    }
  });
  if (count === 1) {
    $countElement.text(theme.strings.pre_order_1);
  } else {
    $countElement.text(theme.strings.pre_order_many.replace("###", count));
  }
}

function handleAddOnOptionClick() {
  const $source = $(event.target);
  const $slick = $source.closest(selectors.preOrderAddOn).find(selectors.slickSlider);
  const opName = $source.data(datasets.addOn.opName);

  if ($source.length === 0 || !opName) {
    return null;
  }

  if ((opName === "color" || opName === "sleeve") && $slick.length > 0) {
    handleAddOnSlickChange($source);
  }

  return handleAddOnVariantChange($source);
}

function handleAddOnSlickChange($source) {
  const color = $source.data(datasets.addOn.value);
  const $parent = $source.closest(selectors.preOrderAddOn);
  const $newImages = $parent.find(`[data-${datasets.addOn.image}="${color}"]`);
  let index = -1;
  for (let i = 0; i < $newImages.length; i++) {
    const $slide = $($newImages[i]).closest(selectors.slick);
    const newIndex = $slide.data(datasets.slick);
    if (newIndex > -1) {
      index = newIndex;
      break;
    }
  }

  if (index > -1) {
    setTimeout(() => {
      $parent.find(selectors.slickSlider).slick("slickGoTo", index);
    }, 100);
  }
}

function handleAddOnVariantChange($source) {
  let $parent = $source.closest(selectors.preOrderAddOn);
  if ($source.closest(selectors.formInForm).length > 0) {
    $parent = $source.closest("form");
  }
  const $jsonElement = $parent.find(selectors.json);
  const $select = $parent.find(selectors.addOn.select);

  if (
    $parent.length === 0 ||
    $jsonElement.length === 0 ||
    $select.length === 0
  ) {
    return null;
  }

  const variants = JSON.parse($jsonElement.html());
  const $options = $parent.find(selectors.option);

  const newVariant = getSelectedAddOnVariant(variants.variants, $options, $source);

  return renderAddOnVariant(newVariant, $parent);
}


function getSelectedAddOnVariant(variants, $options, $new) {
  //  exclude $new to only get the current variant
  const optionValues = [];
  $options.each((index, option) => {
    const $input = $(option).find("input:checked");
    optionValues.push($input.val());
  });

  const options = {
    Option1: optionValues[0] || null,
    Option2: optionValues[1] || null,
    Option3: optionValues[2] || null,
  };

  if ($new && $new.length > 0) {
    const index = $new.data(datasets.addOn.index);
    const value = $new.data(datasets.addOn.value);
    const indexName = `Option${index}`;
    options[indexName] = value;
  }

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    if (
      variant.Option1 === options.Option1 &&
      variant.Option2 === options.Option2 &&
      variant.Option3 === options.Option3
    ) {
      return variant;
    }
  }

  return null;
}


function renderAddOnVariant(variant, $parent) {
  if (!$parent || $parent.length === 0) {
    return null;
  }

  renderAddOnProductOptions(variant, $parent);
  renderAddOnProductPrice(variant, $parent);
  return null;
}

function renderAddOnProductOptions(variant, $parent) {
  if (!$parent || $parent.length === 0 || !variant) {
    return null;
  }
  const $select = $parent.find(selectors.addOn.select);
  $select.find("option").removeAttr("selected");
  const $newOption = $select.find(`option[value="${variant.id}"]`);
  $newOption.attr("selected", "selected");
  $select.change();
  return null;
}

function renderAddOnProductPrice(variant, $parent) {
  if (!variant || variant.length === 0) {
    return null;
  }
  const price = variant.price;
  const compareAt = variant.compare_at;

  const $regularPriceElement = $parent.find(selectors.addOn.price);
  const $comparePriceElement = $parent.find(selectors.addOn.compare);
  const $submitPriceElement = $parent.find(selectors.addOn.submitprice);

  $regularPriceElement.html(
    formatMoney(price, theme.moneyFormat).replace(".00", "")
  );
  $submitPriceElement.html(
    `${formatMoney(price, theme.moneyFormat).replace(".00", "")} `
  );
  if (compareAt && compareAt > 0) {
    $comparePriceElement.html(
      formatMoney(compareAt, theme.moneyFormat).replace(".00", "")
    );
  } else {
    $comparePriceElement.html("");
  }
  return null;
}

$(document).ready(init);
$(document).on("click change", selectors.value, handleOptionClick);
$(document).on("click", selectors.preOrdersTabLink, handlePreOrderTabClick);
$(document).on("click", selectors.preOrderButton, handlePreOrderButtonClick);
$(document).on("click change", selectors.preOrderCheckbox, handlePreOrderCount);
$(document).on("focusin", onFocusChange);
$(document).on("mouseleave", selectors.item, onItemHoverOut);
$(document).on("click change", selectors.addOn.value, handleAddOnOptionClick);
document.addEventListener("pageTransitionStart", slickHideOnLoad);
