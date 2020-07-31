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
  colors: "pi-color-options",
  opName: "pi-option-name",
  option: "pi-option",
  index: "pi-option-index",
  slick: "slick-index",
};

const selectors = {
  value: `[data-${datasets.value}]`,
  gallery: `[data-${datasets.gallery}]`,
  galleryAlways: `[data-${datasets.gallery}="always"]`,
  current: `.${classes.active}[data-${datasets.image}]`,
  image: `[data-${datasets.image}]`,
  item: "[data-pi-item]",
  opName: `[data-${datasets.opName}]`,
  json: "[data-product-json]",
  select: "[data-pi-variant-select]",
  option: `[data-${datasets.option}]`,
  submit: "[data-pi-submit]",
  submitprice: "[data-pi-submit-price]",
  submitText: "[data-pi-submit-text]",
  price: "[data-pi-price]",
  compare: "[data-pi-compare]",
  slick: `[data-${datasets.slick}]`,
  slideById: (id) => `[data-slick-index=${id}]`,
  slickSlider: ".slick-slider",
  optionLabel: "[data-pi-current-option]",
  optionWrap: "[data-pi-option-wrap]",
  preOrders: "[data-pre-order-products]",
  preOrdersTabLink: "[data-pre-order-products] [data-tab-link]",
  preOrderButton: "[data-pre-order-button]",
  preOrderAddOns: "[data-pop-add-on]",
  tabByIndex: (index) => `[data-tab="${index}"]`,
  preOrderCheckbox: "[data-pi-add-this]",
  addOnParent: "[data-add-on-parent]",
};

function handleOptionClick(event) {
  const $source = $(event.currentTarget);
  const $slick = $source.closest(selectors.item).find(selectors.slickSlider);
  const $slickAlways = $source.closest(selectors.item).find(selectors.galleryAlways);
  const opName = $source.data(datasets.opName);

  if ($source.length === 0 || !opName) {
    return false;
  }

  if (opName === "color" || opName === "sleeve") {
    if ($slick.length > 0 || $slickAlways.length > 0) {
      handleSlickChange($source);
    } else {
      handleColorChange($source);
    }
  }

  renderOptionLabel($source);
  return handleVariantChange($source);
}

function renderOptionLabel($source) {
  const $colorLabel = $source.closest(selectors.optionWrap).find(selectors.optionLabel);
  if ($colorLabel.length === 0) {
    return null;
  } else {
    return $colorLabel.text($source.data(datasets.value));
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
    $parent.find(selectors.slickSlider).slick("slickGoTo", index);
  }
}

function handleVariantChange($source) {
  const $parent = $source.closest(selectors.item);
  const $jsonElement = $parent.find(selectors.json);
  const $select = $parent.find(selectors.select);

  if (
    $parent.length === 0 ||
    $jsonElement.length === 0 ||
    $select.length === 0
  ) {
    return false;
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
  return $select.change();
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

function init() {
  const $gallery = $(`${selectors.gallery}`);
  const $images = $gallery.find(selectors.image);
  $images.each((index, option) => {
    $(option).css("display", "block");
  });

  $gallery.slick({
    swipeToSlide: true,
    arrows: false,
    dots: false,
    slidesToShow: 1,
    centerMode: false,
    infinite: true,
    speed: 300,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerMode: true,
          centerPadding: "10%",
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

  const $galleryAlways = $(`${selectors.galleryAlways}`);
  const $imagesAlways = $galleryAlways.find(selectors.image);
  $imagesAlways.each((index, option) => {
    $(option).css("display", "block");
  });

  $galleryAlways.slick({
    swipeToSlide: true,
    arrows: true,
    dots: false,
    slidesToShow: 1,
    centerMode: false,
    infinite: true,
    speed: 300
  });

  $($galleryAlways).on("afterChange", (event, slick, nextSlide) => {
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
  const $addOns = $parent.find(selectors.preOrderAddOns);
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

$(document).ready(init);
$(document).on("click", selectors.value, handleOptionClick);
$(document).on("click", selectors.preOrdersTabLink, handlePreOrderTabClick);
$(document).on("click", selectors.preOrderButton, handlePreOrderButtonClick);

$(document).on("focusin", onFocusChange);
$(document).on("mouseleave", selectors.item, onItemHoverOut);
