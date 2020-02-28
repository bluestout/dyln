import $ from "jquery";
import "slick-carousel";

const elements = {
  slider: "[data-collection-slider]",
};

function slider() {
  const $slider = $(elements.slider);
  if ($slider.length > 0 && $slider.find(">div").length > 1) {
    $slider.slick({
      swipeToSlide: true,
      arrows: true,
      dots: true,
      slidesToShow: 3,
      nextArrow: `<button type='button' class='slick-next slick-arrow'><span class='icon-fallback-text'>
        ${theme.strings.next}
        </span></button>`,
      prevArrow: `<button type='button' class='slick-prev slick-arrow'><span class='icon-fallback-text'>
        ${theme.strings.previous}
      </span></button>`,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    });
  }
}

$(document).ready(slider);
