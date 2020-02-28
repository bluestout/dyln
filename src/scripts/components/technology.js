import $ from "jquery";
import "slick-carousel";

const elements = {
  slider: "[data-tech-slider]",
};

function slider() {
  const $slider = $(elements.slider);
  if ($slider.length > 0 && $slider.find(">div").length > 1) {
    $slider.slick({
      swipeToSlide: true,
      arrows: false,
      dots: true,
      slidesToShow: 1,
    });
  }
}

$(document).ready(slider);
