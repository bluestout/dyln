/**
 * Basic use:
 * <div data-po-tab-container>
 * <button data-po-tab-link=index></button>
 * <div data-po-tab=index></div>
 * </div>
 */

import $ from "jquery";
import { getUrlParams, getUrlHashParams } from "./helpers";

const datasets = {
  tab: "po-tab",
  link: "po-tab-link",
  image: "pi-image",
  value: "pi-option-value",
  addOn: {
    image: "add-on-image",
    value: "add-on-option-value",
  }
};

const htmlArrowNext = `<button type='button' class='slick-next slick-arrow'></button>`;
const htmlArrowPrev = `<button type='button' class='slick-prev slick-arrow'></button>`;

const selectors = {
  image: `[data-${datasets.image}]`,
  item: "[data-pi-item]",
  addOn: "[data-pop-add-on]",
  container: "[data-po-tab-container]",
  containerInner: "[data-po-tab-container-inner]",
  tab: `[data-${datasets.tab}]`,
  link: `[data-${datasets.link}]`,
  tabByIndex: (index) => `[data-${datasets.tab}="${index}"]`,
  linkByIndex: (index) => `[data-${datasets.link}="${index}"]`,
  slickOnLoad: "[data-pi-image-gallery-onload]",
  slickOnLoadInitial: `[data-pi-image-gallery-onload][data-init="true"]`,
  addOnSlickOnLoad: "[data-add-on-image-gallery-onload]",
  addOnSlickOnLoadInitial: `[data-add-on-image-gallery-onload][data-init="true"]`,
  settings: "[data-product-schema-settings]",
  addOn: {
    image: `[data-${datasets.addOn.image}]`,
  }
};

const classes = {
  active: "active",
  slickInit: "slick-initialized"
};

const variables = {
  timing: "fast",
  contactParam: "contact-tab",
  posted: "contact_posted",
};

function tabs(event) {
  event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  const $this = $(event.currentTarget);
  if (!$this.hasClass(classes.active)) {

    const index = $this.data(datasets.link);
    if ($this.closest(selectors.containerInner).length > 0) {
      const $container = $this.closest(selectors.containerInner);
      const $target = $container.find(selectors.tabByIndex(index));
      $container.find(selectors.link).not($this).each((i, item) => {
        $(item).removeClass(classes.active);
      });
      $this.addClass(classes.active);
      $container.find(`.${classes.active}${selectors.tab}`).each((i, item) => {
        $(item).removeClass(classes.active).hide();
        $target.addClass(classes.active).show();
        slickLoad($target);
      });
    } else {
      const $container = $this.closest(selectors.container);
      const $target = $container.find(selectors.tabByIndex(index));
      $container.find(selectors.link).not($this).each((i, item) => {
        if ($(item).closest(selectors.containerInner).length === 0) {
          $(item).removeClass(classes.active);
        }
      });
      $this.addClass(classes.active);
      $container.find(`.${classes.active}${selectors.tab}`).each((i, item) => {
        if ($(item).closest(selectors.containerInner).length === 0) {
          $(item).removeClass(classes.active).hide();
          $target.addClass(classes.active).show();
          slickLoad($target);
        }
      });
    }

    // reset all tabbed embedded iframes on tab change
    $(`${selectors.tab}:not(.${classes.active}) iframe`).each(function () {
      $(this).attr("src", $(this).attr("src"));
    });

    // pause all non-looping tabbed videos on tab change
    $(`${selectors.tab}:not(.${classes.active}) video:not([loop])`).each(
      function () {
        this.pause();
      }
    );
  }
}

function slickLoad($target) {
  let $slicks;
  let $addOnSlicks;

  if (!$target || $target.length === 0) {
    return null;
  }

  if ($target.find(selectors.containerInner).length > 0) {
    $slicks = $target.find(selectors.containerInner).first().find(selectors.slickOnLoad).first();
    $addOnSlicks = $target.find(selectors.containerInner).first().find(selectors.addOnSlickOnLoad).first();
  } else {
    $slicks = $target.find(selectors.slickOnLoad);
    $addOnSlicks = $target.find(selectors.addOnSlickOnLoad);
  }
  $slicks.each((index, slick) => {
    slickInit($(slick));
  });

  $addOnSlicks.each((index, slick) => {
    slickInitAddOn($(slick));
  });
}

function slickInit($item) {
  if (!$item || $item.length === 0) {
    return null;
  }
  if (!$item.hasClass(classes.slickInit)) {
    const arrows = $item.data("arrows") === true ? true : false;

    let fading = false;
    try {
      const options = JSON.parse($(selectors.settings).text());
      fading = options.fade_pi;
    } catch (error) { }

    $item.slick({
      swipeToSlide: true,
      arrows: arrows,
      dots: false,
      slidesToShow: 1,
      prevArrow: htmlArrowPrev,
      nextArrow: htmlArrowNext,
      speed: 300,
      fade: fading,
      cssEase: 'linear'
    });

    $item.on("afterChange", (event, slick, nextSlide) => {
      const $slide = $(event.currentTarget).find(`[data-slick-index="${nextSlide}"]`);
      const color = $slide.find(selectors.image).data(datasets.image);
      return $slide.closest(selectors.item).find(`[data-${datasets.value}="${color}"]`).click();
    });
  }
}

function slickInitAddOn($item) {
  if (!$item || $item.length === 0) {
    return null;
  }
  if (!$item.hasClass(classes.slickInit)) {
    let fading = false;
    try {
      const options = JSON.parse($(selectors.settings).text());
      fading = options.fade_pi;
    } catch (error) { }

    $item.slick({
      swipeToSlide: true,
      arrows: false,
      dots: false,
      slidesToShow: 1,
      speed: 300,
      fade: fading,
      cssEase: 'linear'
    });

    $item.on("afterChange", (event, slick, nextSlide) => {
      const $slide = $(event.currentTarget).find(`[data-slick-index="${nextSlide}"]`);
      const color = $slide.find(selectors.image).data(datasets.addOn.image);
      return $slide.closest(selectors.addOn).find(`[data-${datasets.addOn.value}="${color}"]`).click();
    });
  }
}

function init() {
  checkTabHash();
  $(selectors.slickOnLoadInitial).each((index, item) => {
    slickInit($(item));
  });
  $(selectors.addOnSlickOnLoadInitial).each((index, item) => {
    slickInitAddOn($(item));
  });
}

function checkTabHash() {
  const urlParams = getUrlParams();
  const urlHashParams = getUrlHashParams();
  const index = urlHashParams[variables.contactParam];

  if (urlParams[variables.posted]) {
    $(selectors.linkByIndex(5)).click();
  } else if (urlHashParams[variables.contactParam]) {
    $(selectors.linkByIndex(index)).click();
  }
}

$(document).on("click", selectors.link, tabs);
$(document).ready(init);
