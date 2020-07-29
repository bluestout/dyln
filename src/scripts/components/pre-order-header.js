import $ from "jquery";

const selectors = {
  anchorBtn: "[data-anchor-btn]",
  anchorTarget: "[data-anchor-target]"
};

function animateScroll() {
  let hrefAnchor = $(selectors.anchorBtn).attr("href");

  $('html, body').animate({
    scrollTop: $(hrefAnchor).offset().top
  }, 1000);
}

$(selectors.anchorBtn).on("click", animateScroll());
