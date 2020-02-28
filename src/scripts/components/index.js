import $ from "jquery";
import "slick-carousel";

const elements = {
  slider: "[data-index-stories]",
  input: "[data-index-stories-input]"
};

function init() {
  const $slider = $(elements.slider);

  if ($slider.length > 0 && $slider.find(">div").length > 1) {
    $slider.slick({
      swipeToSlide: true,
      arrows: true,
      dots: false,
      slidesToShow: 4,
      centerMode: true,
      initialSlide: 1,
      centerPadding: "100px",
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }
}

function handleInputChange(event) {
  const value = Math.round(event.currentTarget.value / 10);
  const $slider = $(elements.slider);
  if ($slider.length > 0 && $slider.hasClass("slick-initialized")) {
    console.log("value: ", value);
    $slider.slick("slickGoTo", value, false);
  }
}

$(document).ready(init);

$(elements.input).on("input propertychange", handleInputChange);
