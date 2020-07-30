import $ from "jquery";
import { toggleTabindexInChildren } from "./helpers";

const selectors = {
  videoOpen: "[data-po-video-open]",
  videoModal: "[data-po-video-modal]",
  videoClose: "[data-po-video-close]",
  focusOut: "[data-po-video-focusout]",
  focusIn: "[data-po-video-focusin]",
};

function handleVideoOpenClick() {
  const $modal = $(selectors.videoModal);
  $modal.fadeIn();
  toggleTabindexInChildren($modal, 1);
  $(selectors.focusIn).focus();
  const video = $modal.find("video").get(0);
  if (video && !video.controls) {
    video.play();
  }
}

function handleVideoCloseClick() {
  const $modal = $(selectors.videoModal);
  $modal.fadeOut();
  toggleTabindexInChildren($modal, 2);
  $(selectors.focusOut).focus();
  const video = $modal.find("video").get(0);
  if (video && !video.controls) {
    video.pause();
    video.currentTime = 0;
  }
}

$(document).on("click", selectors.videoOpen, handleVideoOpenClick);
$(document).on("click", selectors.videoClose, handleVideoCloseClick);
