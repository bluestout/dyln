import $ from "jquery";

const selectors = {
  button: "[data-index-video-open]",
  backBtn: "[data-index-video-back-btn]",
  videoWrap: "[data-index-video]",
  contentWrap: "[data-index-video-content]",
  bg: "[data-index-video-bg]",
};

const classes = {
  active: "active",
};

function videoOpen() {
  const $wrap = $(selectors.videoWrap);
  const $content = $(selectors.contentWrap);
  const $bg = $(selectors.bg);

  $bg.toggleClass(classes.active);
  $content.fadeOut("fast", () => {
    $wrap.fadeIn();
  });
}

function sectionOpen() {
  const $content = $(selectors.contentWrap);
  const $wrap = $(selectors.videoWrap);
  const $bg = $(selectors.bg);

  $bg.toggleClass(classes.active);
  $wrap.fadeOut("fast", () => {
    $content.fadeIn();
  });

}

$(document).on("click", selectors.button, videoOpen);
$(document).on("click", selectors.backBtn, sectionOpen);
