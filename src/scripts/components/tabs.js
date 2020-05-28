/**
 * Basic use:
 * <div data-tabs-container>
 * <button data-tab-link=index></button>
 * <div data-tab=index></div>
 * </div>
 */

import $ from "jquery";
import { getUrlParams } from "./helpers";

const datasets = {
  tab: "tab",
  link: "tab-link",
};

const selectors = {
  container: "[data-tabs-container]",
  tab: `[data-${datasets.tab}]`,
  link: `[data-${datasets.link}]`,
  tabByIndex: (index) => `[data-${datasets.tab}="${index}"]`,
  linkByIndex: (index) => `[data-${datasets.link}="${index}"]`,
};

const classes = {
  active: "active",
};

const variables = {
  timing: "fast",
  contactParam: "contact-tab",
};

function tabs(event) {
  event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  const $this = $(event.currentTarget);
  if (!$this.hasClass(classes.active)) {
    const $container = $this.closest(selectors.container);
    const index = $this.data(datasets.link);
    const $target = $container.find(selectors.tabByIndex(index));
    $container
      .find(selectors.link)
      .not($this)
      .removeClass(classes.active);
    $this.addClass(classes.active);
    $container
      .find(`.${classes.active}${selectors.tab}`)
      .removeClass(classes.active)
      .fadeOut(variables.timing, () => {
        $target.fadeIn(variables.timing).addClass(classes.active);
      });

    // reset all tabbed embedded iframes on tab change
    $(`${selectors.tab}:not(.${classes.active}) iframe`).each(function() {
      $(this).attr("src", $(this).attr("src"));
    });

    // pause all non-looping tabbed videos on tab change
    $(`${selectors.tab}:not(.${classes.active}) video:not([loop])`).each(
      function() {
        this.pause();
      }
    );
  }
}

function checkTabHash() {
  const urlParams = getUrlParams();
  if (urlParams[variables.contactParam]) {
    const index = urlParams[variables.contactParam];
    $(selectors.linkByIndex(index)).click();
  }
}

$(document).on("click", selectors.link, tabs);
$(document).ready(checkTabHash);
