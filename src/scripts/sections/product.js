/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import $ from "jquery";
import "slick-carousel";

import { formatMoney } from "@shopify/theme-currency";
import { register } from "@shopify/theme-sections";
import { forceFocus } from "@shopify/theme-a11y";
import { ProductForm } from "@shopify/theme-product-form";
import { scrollTo } from "../components/scroll-to";
import { handleize } from "../components/helpers";

const classes = {
  hide: "hide",
  active: "active",
};

const keyboardKeys = {
  ENTER: 13,
};

const datasets = {
  atc: {
    option: "atc-option",
  },
  slickInit: "slick-initialized"
};

const htmlArrowNext =
  "<button type='button' class='slick-next slick-arrow'><svg width='16' height='38' viewBox='0 0 16 38' xmlns='http://www.w3.org/2000/svg'><path d='M1 38l14-19L1 0' stroke='#848A8D' fill='none' fill-rule='evenodd' stroke-linecap='round'/></svg></button>";
const htmlArrowPrev =
  "<button type='button' class='slick-prev slick-arrow'><svg width='16' height='38' viewBox='0 0 16 38' xmlns='http://www.w3.org/2000/svg'><path d='M15 0L1 19l14 19' stroke='#848A8D' fill='none' fill-rule='evenodd' stroke-linecap='round'/></svg></button>";

const selectors = {
  submitButton: "[data-submit-button]",
  submitButtonText: "[data-submit-button-text]",
  comparePrice: "[data-compare-price]",
  comparePriceText: "[data-compare-text]",
  priceWrapper: "[data-price-wrapper]",
  imageWrapper: "[data-product-image-wrapper]",
  visibleImageWrapper: `[data-product-image-wrapper]:not(.${classes.hide})`,
  imageWrapperById: (id) => `${selectors.imageWrapper}[data-image-id='${id}']`,
  productForm: "[data-product-form]",
  productPrice: "[data-product-price]",
  thumbnail: "[data-product-single-thumbnail]",
  slick: ".slick-slide",
  thumbnailById: (id) => `[data-thumbnail-id='${id}']`,
  galleryByColor: (color) => `[data-gallery-image-color='${color}']`,
  thumbnailByColor: (color) => `[data-gallery-index-color='${color}']`,
  thumbnailActive: "[data-product-single-thumbnail][aria-current]",
  gallery: "[data-pdp-gallery]",
  galleryIndex: "[data-pdp-gallery-index]",
  play: "[data-pdp-gallery-play]",
  select: "[data-pdp-select]",
  currentColor: "[data-pdp-current-color]",
  pdpOptions: "[data-pdp-options]",
  userImages: "[data-pdp-user-images]",
  json: "[data-pdp-product-json]",
  jsonOptions: "[data-pdp-product-options]",
  schemaSettings: "[data-product-schema-settings]",
  gorgiasChat: "gorgias-web-messenger-container",
  video: {
    parent: "[data-pdp-video-parent]",
    content: "[data-pdp-video-non-video]",
    wrap: "[data-pdp-video-wrap]",
    button: "[data-pdp-video-button]",
    bg: "[data-pdp-video-bg]",
  },
  tabs: {
    elements: "[data-pdp-specs-elements]",
    element: "[data-pdp-specs-element]",
    elementById: (id) => `[data-pdp-specs-element='${id}']`,
    videos: "[data-pdp-specs-videos]",
    video: "[data-pdp-specs-video-wrap]",
    videoById: (id) => `[data-pdp-specs-video-wrap='${id}']`,
    return: "[data-pdp-specs-return]",
    features: "[data-pdp-tab-features]",
    input: "[data-pdp-tab-features-input]",
  },
  atc: {
    bar: "[data-atc-bar]",
    anchor: "[data-atc-anchor]",
    option: `[data-${datasets.atc.option}]`,
    options: "[data-atc-options]",
    more: "[data-atc-more]",
    price: "[data-price-price]",
    add: "[data-atc-add]",
    swatch: "[data-atc-swatch]",
    swatchByName: (name) => `[data-atc-swatch="${name}"]`,
    text: "[data-atc-text]",
    textByName: (name) => `[data-atc-text="${name}"]`,
  },
};

const timing = {
  default: "200",
};

const productFormOptionChange = new Event("productFormOptionChange");

let isSlickFiltered = false;

register("product", {
  onLoad() {
    const productFormElement = document.querySelector(selectors.productForm);

    this.product = this.getProductJsonHtml();
    this.product.options = this.getProductOptionsJson();
    this.productForm = new ProductForm(productFormElement, this.product, {
      onOptionChange: this.onFormOptionChange.bind(this),
    });

    this.onClickEvent = this.onClickEvent.bind(this);
    this.onKeyUpEvent = this.onKeyUpEvent.bind(this);

    this.container.addEventListener("click", this.onClickEvent);
    this.container.addEventListener("keyup", this.onKeyUpEvent);
  },

  onUnload() {
    this.productForm.destroy();
    this.removeEventListener("click", this.onClickEvent);
    this.removeEventListener("keyup", this.onKeyUpEvent);
  },

  getProductJson(handle) {
    return fetch(`/products/${handle}.js`).then((response) => {
      return response.json();
    });
  },

  getProductJsonHtml() {
    const jsonHtml = this.container.querySelector(selectors.json).innerHTML;
    return JSON.parse(jsonHtml);
  },

  getProductOptionsJson() {
    const jsonHtml = this.container.querySelector(selectors.jsonOptions)
      .innerHTML;
    return JSON.parse(jsonHtml);
  },

  onFormOptionChange(event) {
    const variant = event.dataset.variant;

    let variantColorOption = "";
    for (let i = 0; i < this.product.options.length; i++) {
      const productOption = this.product.options[i];
      if (productOption.name === "Color" || productOption.name === "color") {
        variantColorOption = variant[`option${productOption.position}`];
      }
    }

    // this.renderImages(variant);
    this.renderGalleryByColor(variantColorOption);
    this.renderPrice(variant);
    this.renderComparePrice(variant);
    this.renderSubmitButton(variant);
    this.renderCurrentColor(variant);
    this.changeHiddenSelect(variant);
    this.renderAtcBar(variant);
    document.dispatchEvent(productFormOptionChange);
  },

  onClickEvent(event) {
    const thumbnail = event.target.closest(selectors.thumbnail);
    const source = event.originalTarget;
    const slick = event.target.closest(selectors.slick);

    try {
      if (source && source.hash) {
        event.preventDefault();
        this.handleSmoothScrollClick(source);
      }
    } catch (error) { }

    if (thumbnail) {
      event.preventDefault();
      this.renderFeaturedImage(thumbnail.dataset.thumbnailId);
      this.renderActiveThumbnail(thumbnail.dataset.thumbnailId);
    } else if (slick) {
      if (isSlickFiltered) {
        $(selectors.galleryIndex).slick("slickGoTo", $(event.target.closest(selectors.slick)).index());
      } else {
        $(selectors.galleryIndex).slick("slickGoTo", slick.dataset.slickIndex);
      }
    }

    return;
  },

  onKeyUpEvent(event) {
    if (
      event.keyCode !== keyboardKeys.ENTER ||
      !event.target.closest(selectors.thumbnail)
    ) {
      return;
    }

    const visibleFeaturedImageWrapper = this.container.querySelector(
      selectors.visibleImageWrapper
    );

    forceFocus(visibleFeaturedImageWrapper);
  },

  renderSubmitButton(variant) {
    const submitButton = this.container.querySelector(selectors.submitButton);
    const submitButtonText = this.container.querySelector(
      selectors.submitButtonText
    );

    if (!variant) {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.unavailable;
    } else if (variant.available) {
      submitButton.disabled = false;
      submitButtonText.innerText = theme.strings.addToCart;
    } else {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.soldOut;
    }
  },

  renderGalleryByColor(color) {
    if (!color || color.length === 0 || !selectors.galleryByColor(color)) {
      return null;
    }

    const gallerySlick = this.container.querySelector(selectors.gallery);
    const galleryIndex = this.container.querySelector(selectors.galleryIndex);

    if (gallerySlick && galleryIndex && gallerySlick.classList.contains(classes.slickInit)) {
      $(gallerySlick).slick("slickUnfilter");
      $(galleryIndex).slick("slickUnfilter");
    }

    const colorElement = this.container.querySelector(
      selectors.galleryByColor(color)
    );

    if (!colorElement) {
      return null;
    }

    if (gallerySlick && galleryIndex && gallerySlick.classList.contains(classes.slickInit)) {
      $(gallerySlick).slick("slickFilter", `[data-color="${color.trim()}"]`);
      $(galleryIndex).slick("slickFilter", `[data-color="${color.trim()}"]`);
      isSlickFiltered = true;
    }
  },

  renderImages(variant) {
    if (!variant || variant.featured_image === null) {
      return;
    }

    this.renderFeaturedImage(variant.featured_image.id);
    this.renderActiveThumbnail(variant.featured_image.id);
  },

  renderCurrentColor(variant) {
    if (!variant || !variant.options || variant.option1.length === 0) {
      return;
    }

    const currentColorElement = this.container.querySelector(
      selectors.currentColor
    );

    const optionsElement = this.container.querySelector(selectors.pdpOptions);

    if (optionsElement && optionsElement.innerHTML.length > 2) {
      const json = JSON.parse(optionsElement.innerHTML);

      if (variant[json.color]) {
        currentColorElement.innerText = variant[json.color];
      }
    }
  },

  changeHiddenSelect(variant) {
    const select = this.container.querySelector(selectors.select);
    if (!variant || !select) {
      return;
    }

    const id = variant.id;
    const newOption = select.querySelector(`option[value="${id}"]`);
    newOption.selected = true;
  },

  renderPrice(variant) {
    const priceElement = this.container.querySelector(selectors.productPrice);
    const atcPriceElement = this.container.querySelector(selectors.atc.price);
    const priceWrapperElement = this.container.querySelector(
      selectors.priceWrapper
    );

    priceWrapperElement.classList.toggle(classes.hide, !variant);

    if (variant) {
      priceElement.innerHTML = formatMoney(variant.price, theme.moneyFormat);
      if (atcPriceElement) {
        atcPriceElement.innerHTML = formatMoney(
          variant.price,
          theme.moneyFormat
        );
      }
    }
  },

  renderComparePrice(variant) {
    if (!variant) {
      return;
    }

    const comparePriceElement = this.container.querySelector(
      selectors.comparePrice
    );
    const compareTextElement = this.container.querySelector(
      selectors.comparePriceText
    );

    if (!comparePriceElement || !compareTextElement) {
      return;
    }

    if (variant.compare_at_price > variant.price) {
      comparePriceElement.innerText = formatMoney(
        variant.compare_at_price,
        theme.moneyFormat
      );
      compareTextElement.classList.remove(classes.hide);
      comparePriceElement.classList.remove(classes.hide);
    } else {
      comparePriceElement.innerText = "";
      compareTextElement.classList.add(classes.hide);
      comparePriceElement.classList.add(classes.hide);
    }
  },

  renderActiveThumbnail(id) {
    const activeThumbnail = this.container.querySelector(
      selectors.thumbnailById(id)
    );
    const inactiveThumbnail = this.container.querySelector(
      selectors.thumbnailActive
    );

    if (activeThumbnail === inactiveThumbnail) {
      return;
    }

    inactiveThumbnail.removeAttribute("aria-current");
    activeThumbnail.setAttribute("aria-current", true);
  },

  renderFeaturedImage(id) {
    const activeImage = this.container.querySelector(
      selectors.visibleImageWrapper
    );
    const inactiveImage = this.container.querySelector(
      selectors.imageWrapperById(id)
    );

    activeImage.classList.add(classes.hide);
    inactiveImage.classList.remove(classes.hide);
  },

  renderAtcBar(variant) {
    handleAtcOptionChange(`Option1-${handleize(variant.option1)}`, false);
  },

  handleSmoothScrollClick(element) {
    const hash = element.hash;
    const body = document.querySelector("html");
    const target = document.getElementById(hash.replace("#", ""));
    scrollTo(body, target.offsetTop, 500);
  },
});

function init() {
  const $gallery = $(selectors.gallery);
  const $galleryIndex = $(selectors.galleryIndex);
  const $tFeatures = $(selectors.tabs.features);
  const $tInput = $(selectors.tabs.input);
  const $userImages = $(selectors.userImages);

  let fading = false;
  try {
    const options = JSON.parse($(selectors.schemaSettings).text());
    fading = options.fade_pdp;
  } catch (error) { }

  if ($(window).width() > 767) {
    if ($gallery.length > 0) {
      $gallery.slick({
        swipeToSlide: false,
        arrows: false,
        dots: false,
        slidesToShow: 1,
        asNavFor: selectors.galleryIndex,
        fade: fading,
        cssEase: 'linear',
      });
      $gallery.find("[data-color]").each((i, item) => {
        $(item).closest(selectors.slick).attr("data-color", $(item).data("color"));
      })
    }

    if ($galleryIndex.length > 0) {
      $galleryIndex.slick({
        swipeToSlide: true,
        arrows: true,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: selectors.gallery,
        prevArrow: htmlArrowPrev,
        nextArrow: htmlArrowNext,
      });
      $galleryIndex.find("[data-color]").each((i, item) => {
        $(item).closest(selectors.slick).attr("data-color", $(item).data("color"));
      })
    }
  }

  if ($tFeatures.length > 0) {
    $tFeatures.on("init", () => {
      if ($tInput.length > 0) {
        $tInput.show();
      }
    });
    $tFeatures.slick({
      swipeToSlide: true,
      arrows: false,
      dots: false,
      slidesToShow: 1,
      centerMode: true,
      centerPadding: "100px",
      autoplay: false,
      responsive: [
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            centerPadding: "50px",
          },
        },
        {
          breakpoint: 424,
          settings: {
            slidesToShow: 1,
            centerPadding: "20px",
          },
        },
      ],
    });

    $tFeatures.on("afterChange", (slick, currentSlide) => {
      const inputVal = currentSlide.currentSlide * 10;
      $tInput.val(inputVal).change();
    });
  }

  if ($userImages.length > 0) {
    $userImages.slick({
      swipeToSlide: true,
      arrows: true,
      dots: false,
      slidesToShow: 6,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 9000,
      prevArrow: htmlArrowPrev,
      nextArrow: htmlArrowNext,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 5,
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 425,
          settings: {
            slidesToShow: 1,
            centerMode: true,
            centerPadding: "30px",
          },
        },
      ],
    });
  }

  handleAtcBar();
}

function handleVideoPlayClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const $vParent = $source.closest(selectors.video.parent);
  const $vWrap = $(selectors.video.wrap);
  const $vContent = $vParent.find(selectors.video.content);
  const $vBg = $vParent.find(selectors.video.bg);

  if (
    $source.length > 0 &&
    $vParent.length > 0 &&
    $vWrap.length > 0 &&
    $vContent.length > 0
  ) {
    if ($vBg.length > 0) {
      $vBg.fadeOut(timing.default);
    }

    $vContent.fadeOut(timing.default, () => {
      $vWrap.fadeIn(timing.default);
    });
  }
}

function handleSpecsPlayClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const id = $source.data("pdp-specs-element");

  const $tElements = $(selectors.tabs.elements);
  const $tVideos = $(selectors.tabs.videos);
  const $tVideo = $(selectors.tabs.videoById(id));

  if ($tVideo.length > 0 && $tVideos.length > 0 && $tElements.length > 0) {
    $tElements.fadeOut(timing.default, () => {
      $tVideos.fadeIn(timing.default);
      $tVideo.show();
    });
  }
}

function handleSpecsReturnClick() {
  const $tElements = $(selectors.tabs.elements);
  const $tVideos = $(selectors.tabs.videos);
  const $tVideo = $(selectors.tabs.video);

  if ($tElements.length > 0 && $tVideos.length > 0 && $tVideo) {
    $tVideos.fadeOut(timing.default, () => {
      $tElements.fadeIn(timing.default);
      $tVideo.each((index, item) => {
        $(item).hide();
      });
    });
  }
}

function handleInputChange(event) {
  const value = Math.round(event.currentTarget.value / 10);
  const $tFeatures = $(selectors.tabs.features);
  const $slick = $tFeatures.slick("getSlick");

  if (
    $tFeatures.length > 0 &&
    $slick &&
    $slick.currentSlide &&
    $slick.currentSlide !== value
  ) {
    $tFeatures.slick("slickGoTo", value, false);
  }
}

function toggleAtcOptions() {
  const $options = $(selectors.atc.options);
  const $more = $(selectors.atc.more);

  if ($options.length > 0) {
    $options.slideToggle(timing.default);
  }

  if ($more.length > 0) {
    $more.slideToggle(timing.default);
  }

  return null;
}

function handleAtcOptionChange(optionName, toggle) {
  if (!optionName) {
    return null;
  }

  const $target = $(`#${optionName}`);
  const $newSwatch = $(selectors.atc.swatchByName(optionName));
  const $newText = $(selectors.atc.textByName(optionName));

  if ($newSwatch.length > 0) {
    $(selectors.atc.swatch)
      .not($newSwatch)
      .hide();
    $newSwatch.show();
  }

  if ($newText.length > 0) {
    $(selectors.atc.text)
      .not($newText)
      .hide();
    $newText.show();
  }

  if ($target.length > 0 && toggle) {
    $target.click();
    toggleAtcOptions();
  }

  return null;
}

function handleAtcOptionClick(event) {
  const $source = $(event.currentTarget);
  const targetData = $source.data(datasets.atc.option);

  handleAtcOptionChange(targetData, true);
}

function handleAtcSubmit() {
  $(selectors.submitButton).click();
}

function handleAtcBar() {
  const form = document.querySelector(selectors.atc.anchor);
  const atc = document.querySelector(selectors.atc.bar);

  if (!form || !atc) {
    return;
  }

  const gorgiasChat = document.getElementById(selectors.gorgiasChat);

  const rectangle = form.getBoundingClientRect();

  if (rectangle.top < 0) {
    if (!atc.classList.contains(classes.active)) {
      atc.classList.add(classes.active);
    }
    if (gorgiasChat && !gorgiasChat.classList.contains("gorgias-offset")) {
      gorgiasChat.classList.add("gorgias-offset");
    }
  } else if (atc.classList.contains(classes.active)) {
    atc.classList.remove(classes.active);
    if (gorgiasChat && gorgiasChat.classList.contains("gorgias-offset")) {
      gorgiasChat.classList.remove("gorgias-offset");
    }
  }
}

$(selectors.tabs.input).on("input propertychange", handleInputChange);
$(document).on("click", selectors.video.button, handleVideoPlayClick);
$(document).on("click", selectors.tabs.element, handleSpecsPlayClick);
$(document).on("click", selectors.tabs.return, handleSpecsReturnClick);
$(document).on("click", selectors.atc.more, toggleAtcOptions);
$(document).on("click", selectors.atc.option, handleAtcOptionClick);
$(document).on("click", selectors.atc.add, handleAtcSubmit);

let smoochInterval;
let smoochCount = 0;
smoochInterval = setInterval(function(){
  smoochCount++;
  if (smoochCount >= 15) {
    handleAtcBar();
    clearInterval(smoochInterval);
  }
}, 1000);

document.addEventListener("windowScrolledRedux", handleAtcBar);

$(document).ready(init);
