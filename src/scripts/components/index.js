import $ from "jquery";

const selectors = {
  button: "[data-index-video-open]",
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

$(document).on("click", selectors.button, videoOpen);
