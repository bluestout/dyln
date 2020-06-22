import $ from "jquery";

const elements = {
  animatedElements: "[data-transition]",
  transitionWave: "[data-transition-wave]",
  transitionWaveRsp: "[data-transition-wave-rsp]",
  transitionFade: "[data-transition-fade]",
};

const classes = {
  waveTransitioned: "wave-transition",
  waveTransitionedRsp: "wave-transition-rsp",
  fadeTransitioned: "fade-transition",
};

const $animatedElements = $(elements.animatedElements);
const $transitionWave = $(elements.transitionWave);
const $transitionWaveRsp = $(elements.transitionWaveRsp);

const $transitionFade = $(elements.transitionFade);
const $window = $(window);

function onScroll() {
  $transitionWave.addClass(classes.waveTransitioned);
  $transitionWaveRsp.addClass(classes.waveTransitionedRsp);
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
