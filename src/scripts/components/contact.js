import $ from "jquery";
import { slice } from "lodash-es";

const selectors = {
  showAll: "[data-faq-show-all]",
  initHidden: "[data-faq-hidden-init]",
};

const timing = {
  default: "200",
};

function handleShowButtonClick() {
  $(selectors.showAll).fadeOut(timing.default);
  $(selectors.initHidden).slideDown(timing.default);
}

$(document).on("click", selectors.showAll, handleShowButtonClick);
