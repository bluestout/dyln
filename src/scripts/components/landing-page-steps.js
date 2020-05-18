import $ from "jquery";

const elements = {
  illustrationHeader: "#illustrationHeader",
  navSelect: "[data-nav]",
};

const $illustrationHeader = $(elements.illustrationHeader);

function init() {
  $illustrationHeader.each(function () {
    let $firstStep = $(this).closest(".lp-steps__step-tab-content-wrapper").find(".lp-steps__step-tab-content").eq(0);
    $(this).appendTo($firstStep);
  });

  return true;
}

$(document).ready(init);

