import $ from "jquery";
import { toggleTabindexInChildren } from "./helpers";

const selectors = {
  videoOpen: "[data-index-video-open]",
  videoModal: "[data-index-video-modal]",
  videoClose: "[data-index-video-close]",
  focusOut: "[data-index-video-focusout]",
  focusIn: "[data-index-video-focusin]",
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
  iframeReset();
}

function iframeReset() {
  const $iframeVideo = $(`${selectors.videoModal} iframe[src*="youtube.com/embed"]`);
  $iframeVideo.each(function() {
    this.src = this.src;
  });
}

$(document).on("click", selectors.videoOpen, handleVideoOpenClick);
$(document).on("click", selectors.videoClose, handleVideoCloseClick);
