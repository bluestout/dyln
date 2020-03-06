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

const classes = {
  hide: "hide"
};

const keyboardKeys = {
  ENTER: 13
};

const selectors = {
  submitButton: "[data-submit-button]",
  submitButtonText: "[data-submit-button-text]",
  comparePrice: "[data-compare-price]",
  comparePriceText: "[data-compare-text]",
  priceWrapper: "[data-price-wrapper]",
  imageWrapper: "[data-product-image-wrapper]",
  visibleImageWrapper: `[data-product-image-wrapper]:not(.${classes.hide})`,
  imageWrapperById: id => `${selectors.imageWrapper}[data-image-id='${id}']`,
  productForm: "[data-product-form]",
  productPrice: "[data-product-price]",
  thumbnail: "[data-product-single-thumbnail]",
  thumbnailById: id => `[data-thumbnail-id='${id}']`,
  thumbnailActive: "[data-product-single-thumbnail][aria-current]",
  gallery: "[data-pdp-gallery]",
  galleryIndex: "[data-pdp-gallery-index]",
  play: "[data-pdp-gallery-play]",
  videoWrap: "[data-pdp-video-wrap]",
  currentColor: "[data-pdp-current-color]",
  pdpOptions: "[data-pdp-options]",
  vParent: "[data-pdp-video-parent]",
  vContent: "[data-pdp-video-non-video]",
  vWrap: "[data-pdp-video-wrap]",
  vButton: "[data-pdp-video-button]",
  vBg: "[data-pdp-video-bg]",
  tElements: "[data-pdp-specs-elements]",
  tElement: "[data-pdp-specs-element]",
  tElementById: id => `[data-pdp-specs-element='${id}']`,
  tVideos: "[data-pdp-specs-videos]",
  tVideo: "[data-pdp-specs-video-wrap]",
  tVideoById: id => `[data-pdp-specs-video-wrap='${id}']`,
  tReturn: "[data-pdp-specs-return]",
  tFeatures: "[data-pdp-tab-features]",
  tInput: "[data-pdp-tab-features-input]"
};

register("product", {
  async onLoad() {
    const productFormElement = document.querySelector(selectors.productForm);

    this.product = await this.getProductJson(
      productFormElement.dataset.productHandle
    );
    this.productForm = new ProductForm(productFormElement, this.product, {
      onOptionChange: this.onFormOptionChange.bind(this)
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
    return fetch(`/products/${handle}.js`).then(response => {
      return response.json();
    });
  },

  onFormOptionChange(event) {
    const variant = event.dataset.variant;

    // this.renderImages(variant);
    this.renderPrice(variant);
    this.renderComparePrice(variant);
    this.renderSubmitButton(variant);
    this.renderCurrentColor(variant);
  },

  onClickEvent(event) {
    const thumbnail = event.target.closest(selectors.thumbnail);
    const source = event.originalTarget;
    if (source && source.nodeName === "A" && source.hash) {
      event.preventDefault();
      this.handleSmoothScrollClick(source);
    }

    if (!thumbnail) {
      return;
    }

    event.preventDefault();

    this.renderFeaturedImage(thumbnail.dataset.thumbnailId);
    this.renderActiveThumbnail(thumbnail.dataset.thumbnailId);
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

  renderPrice(variant) {
    const priceElement = this.container.querySelector(selectors.productPrice);
    const priceWrapperElement = this.container.querySelector(
      selectors.priceWrapper
    );

    priceWrapperElement.classList.toggle(classes.hide, !variant);

    if (variant) {
      priceElement.innerHTML = formatMoney(variant.price, theme.moneyFormat);
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
  handleSmoothScrollClick(element) {
    const hash = element.hash;
    const body = document.querySelector("html");
    const target = document.getElementById(hash.replace("#", ""));
    scrollTo(body, target.offsetTop, 500);
  }
});

function init() {
  const $gallery = $(selectors.gallery);
  const $galleryIndex = $(selectors.galleryIndex);
  const $tFeatures = $(selectors.tFeatures);
  const $tInput = $(selectors.tInput);

  if ($gallery.length > 0) {
    $gallery.slick({
      swipeToSlide: true,
      arrows: false,
      dots: false,
      slidesToShow: 1
    });
  }

  if ($galleryIndex.length > 0) {
    $galleryIndex.slick({
      swipeToSlide: true,
      arrows: true,
      dots: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: selectors.gallery,
      prevArrow:
        "<button type='button' class='slick-prev slick-arrow'><svg width='16' height='38' viewBox='0 0 16 38' xmlns='http://www.w3.org/2000/svg'><path d='M15 0L1 19l14 19' stroke='#848A8D' fill='none' fill-rule='evenodd' stroke-linecap='round'/></svg></button>",
      nextArrow:
        "<button type='button' class='slick-next slick-arrow'><svg width='16' height='38' viewBox='0 0 16 38' xmlns='http://www.w3.org/2000/svg'><path d='M1 38l14-19L1 0' stroke='#848A8D' fill='none' fill-rule='evenodd' stroke-linecap='round'/></svg></button>"
    });
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
      autoplay: true,
      autoplaySpeed: 8500
    });

    $tFeatures.on("afterChange", (slick, currentSlide) => {
      const inputVal = currentSlide.currentSlide * 10;
      $tInput.val(inputVal).change();
    });
  }
}

function handleGalleryPlayClick(event) {
  event.preventDefault();
  const $parent = $(event.currentTarget).closest(selectors.videoWrap);
  const $video = $parent.find("video");
  if ($video.length === 1 && $video[0]) {
    if ($video[0].paused) {
      $video[0].play();
    } else {
      $video[0].pause();
    }
  }
}

function handleVideoPlayClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const $vParent = $source.closest(selectors.vParent);
  const $vWrap = $(selectors.vWrap);
  const $vContent = $vParent.find(selectors.vContent);
  const $vBg = $vParent.find(selectors.vBg);

  if (
    $source.length > 0 &&
    $vParent.length > 0 &&
    $vWrap.length > 0 &&
    $vContent.length > 0
  ) {
    if ($vBg.length > 0) {
      $vBg.fadeOut("fast");
    }

    $vContent.fadeOut("fast", () => {
      $vWrap.fadeIn("fast");
    });
  }
}

function handleSpecsPlayClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const id = $source.data("pdp-specs-element");

  const $tElements = $(selectors.tElements);
  const $tVideos = $(selectors.tVideos);
  const $tVideo = $(selectors.tVideoById(id));

  if ($tVideo.length > 0 && $tVideos.length > 0 && $tElements.length > 0) {
    $tElements.fadeOut("fast", () => {
      $tVideos.fadeIn("fast");
      $tVideo.show();
    });
  }
}

function handleSpecsReturnClick() {
  const $tElements = $(selectors.tElements);
  const $tVideos = $(selectors.tVideos);
  const $tVideo = $(selectors.tVideo);

  if ($tElements.length > 0 && $tVideos.length > 0 && $tVideo) {
    $tVideos.fadeOut("fast", () => {
      $tElements.fadeIn("fast");
      $tVideo.each((index, item) => {
        $(item).hide();
      });
    });
  }
}

function handleInputChange(event) {
  const value = Math.round(event.currentTarget.value / 10);
  const $tFeatures = $(selectors.tFeatures);
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

$(selectors.tInput).on("input propertychange", handleInputChange);

$(document).on("click", selectors.play, handleGalleryPlayClick);
$(document).on("click", selectors.vButton, handleVideoPlayClick);
$(document).on("click", selectors.tElement, handleSpecsPlayClick);
$(document).on("click", selectors.tElement, handleSpecsPlayClick);
$(document).on("click", selectors.tReturn, handleSpecsReturnClick);

$(document).ready(init);
