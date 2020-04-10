import $ from "jquery";
import "slick-carousel";

const elements = {
  slider: "[data-user-stories]",
  input: "[data-user-stories-input]"
};

function init() {
  const $slider = $(elements.slider);

  if ($slider.length > 0 && $slider.find(">div").length > 1) {
    $slider.slick({
      swipeToSlide: true,
      arrows: true,
      dots: false,
      slidesToShow: 3,
      centerMode: true,
      initialSlide: 1,
      centerPadding: "100px",
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            centerPadding: "50px"
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            centerPadding: "50px"
          }
        },
        {
          breakpoint: 425,
          settings: {
            slidesToShow: 1,
            centerPadding: "20px"
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
    $slider.slick("slickGoTo", value, false);
  }
}

$(document).ready(init);

$(elements.input).on("input propertychange", handleInputChange);
