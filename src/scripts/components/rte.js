import $ from "jquery";

function wrapTable() {
  $(`.rte table`).wrap(`<div class="rte__table-wrapper"></div>`);
}

function iframeReset() {
  const $iframeVideo = $(
    `.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]`
  );
  const $iframeReset = $iframeVideo.add(`.rte iframe#admin_bar_iframe`);

  $iframeVideo.each(function() {
    $(this).wrap(`<div class="rte__video-wrapper"></div>`);
  });

  $iframeReset.each(function() {
    this.src = this.src;
  });
}

$(document).ready(() => {
  wrapTable();
  iframeReset();
});
