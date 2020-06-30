import $ from "jquery";

const elements = {
  animatedElements: "[data-transition]",
  transitionWave: "[data-transition-wave]",
  transitionFade: "[data-transition-fade]",
};

const classes = {
  waveTransitioned: "wave-transition",
  fadeTransitioned: "fade-transition",
};

const $animatedElements = $(elements.animatedElements);
const $transitionWave = $(elements.transitionWave);

const $transitionFade = $(elements.transitionFade);
const $window = $(window);

function onScroll() {
  $transitionWave.addClass(classes.waveTransitioned);
  $transitionFade.addClass(classes.fadeTransitioned);

  checkIfInView();

  return false;
}

function checkIfInView() {
  let windowHeight = $window.height();
  let windowTopPosition = $window.scrollTop();
  let windowBottomPosition = windowTopPosition + windowHeight;

  $.each($animatedElements, function() {
    const $this = $(this);
    const elementHeight = $($this).outerHeight();
    const elementTopPosition = $($this).offset().top;
    const elementBottomPosition = elementTopPosition + elementHeight;

    if (
      elementBottomPosition >= windowTopPosition &&
      elementTopPosition <= windowBottomPosition
    ) {
      $this.addClass("in-view");
    } else {
      $this.removeClass("in-view");
    }
  });
}

document.addEventListener("windowScrolledRedux", onScroll);
$(window).trigger("scroll");
