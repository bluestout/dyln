/**
 * Basic use:
 * <div data-tab-container>
 * <button data-tab-link=index></button>
 * <div data-tab=index></div>
 * </div>
 */

import $ from "jquery";
import { getUrlParams, getUrlHashParams } from "./helpers";

const datasets = {
  tab: "tab",
  link: "tab-link",
};

const selectors = {
  container: "[data-tab-container]",
  containerInner: "[data-tab-container-inner]",
  tab: `[data-${datasets.tab}]`,
  link: `[data-${datasets.link}]`,
  tabByIndex: (index) => `[data-${datasets.tab}="${index}"]`,
  linkByIndex: (index) => `[data-${datasets.link}="${index}"]`,
  slickOnLoad: "[data-pi-image-gallery-onload]",
  settings: "[data-product-schema-settings]",
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
        $(item).removeClass(classes.active)
          .fadeOut(variables.timing, () => {
            $target.fadeIn(variables.timing).addClass(classes.active);
            slickLoad($target);
          });
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
          $(item).removeClass(classes.active)
            .fadeOut(variables.timing, () => {
              $target.fadeIn(variables.timing).addClass(classes.active);
              slickLoad($target);
            });
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
  let $slicks

  if ($target.find(selectors.containerInner).length > 0) {
    $slicks = $target.find(selectors.containerInner).first().find(selectors.slickOnLoad).first();
  } else {
    $slicks = $target.find(selectors.slickOnLoad);
  }
  let fading = false;
  try {
    const options = JSON.parse($(selectors.settings).text());
    fading = options.fade_pi;
  } catch (error) { }
  $slicks.each((index, slick) => {
    if (!$(slick).hasClass(classes.slickInit)) {
      $(slick).slick({
        swipeToSlide: true,
        arrows: false,
        dots: false,
        slidesToShow: 1,
        centerPadding: "0%",
        centerMode: false,
        infinite: true,
        speed: 300,
        fade: fading,
        cssEase: 'linear',
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: false,
              infinite: true,
              dots: false,
              variableWidth: false,
              fade: fading,
              cssEase: 'linear',
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "25%",
              infinite: true,
              variableWidth: false,
              fade: fading,
              cssEase: 'linear',
            }
          }
        ]
      });
    }
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
$(document).ready(checkTabHash);
