import $ from "jquery";
import "slick-carousel";

const elements = {
  slider: "[data-testimonials-slider]",
  input: "[data-testimonials-input]",
};

function init() {
  const $slider = $(elements.slider);
  const $input = $(elements.input);

  if ($slider.length > 0 && $slider.find(">div").length > 1) {
    $slider.slick({
      swipeToSlide: true,
      arrows: true,
      prevArrow: "<div class='slick-prev'></div>",
      nextArrow: "<div class='slick-next'></div>",
      dots: false,
      slidesToShow: 1,
      centerMode: false,
      variableWidth: false,
      infinite: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerPadding: '20px',
            centerMode: true,
            infinite: true,
            dots: false,
            variableWidth: false
          }
        }
      ]
    });
  }

  $slider.on("afterChange", (slick, currentSlide) => {
    const inputVal = currentSlide.currentSlide * 10;
    $input.val(inputVal).change();
  });
}

function handleInputChange(event) {
  const value = Math.round(event.currentTarget.value / 10);
  const $slider = $(elements.slider);
  if ($slider.length > 0 && $slider.hasClass("slick-initialized")) {
    $slider.slick("slickGoTo", value, false);
  }
}

$(document).ready(init);

$(elements.input).on("input propertychange", handleInputChange);
