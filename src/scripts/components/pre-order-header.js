import $ from "jquery";

const selectors = {
  anchorBtn: "[data-anchor-btn]",
  anchorTarget: "[data-anchor-target]",
  mobileImage: "[data-mobile-bg]"
};

function animateScroll() {
  let hrefAnchor = $(selectors.anchorBtn).attr("href");

  $('html, body').animate({
    scrollTop: $(hrefAnchor).offset().top
  }, 1000);
}

function setMobileBackground() {
  let $mobileBackgroundEl = $(".pre-order-header .container-fluid");
  let mobileImage = $mobileBackgroundEl.data("mobile-bg");

  $mobileBackgroundEl.css("background-image", "url('" + mobileImage + "')");
}

if($(window).width() < 1024) {
  setMobileBackground();
}

$(selectors.anchorBtn).on("click", animateScroll());
