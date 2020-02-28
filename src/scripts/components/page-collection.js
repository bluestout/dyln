import $ from "jquery";
import "slick-carousel";

const classes = {
  active: "active"
};

const datasets = {
  button: "c-image-button",
  image: "c-image",
  gallery: "c-image-gallery",
  colors: "c-image-colors"
};

const elements = {
  slider: "[data-page-c-slider]",
  button: `[data-${datasets.button}]`,
  image: `[data-${datasets.image}]`,
  gallery: `[data-${datasets.gallery}]`,
  current: `.${classes.active}[data-${datasets.image}]`,
  colors: `[data-${datasets.colors}]`,
  item: "[data-c-item]"
};

function init() {
  offsetColorSwatches();
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

function handleColorClick(event) {
  const $source = $(event.currentTarget);
  const color = $source.data(datasets.button);
  const $parent = $source.closest(elements.item);
  const $newImage = $parent.find(`[data-${datasets.image}="${color}"]`);
  const $currentImage = $parent.find(elements.current);

  if (!$newImage.hasClass(classes.active)) {
    $currentImage.fadeOut("fast", () => {
      $newImage.fadeIn("fast");
      $newImage.addClass(classes.active);
      $currentImage.removeClass(classes.active);
    });
  }
}

function offsetColorSwatches() {
  const $allColors = $(elements.colors);
  $allColors.each((index, value) => {
    const $colors = $(value);
    const $product = $colors.closest(elements.item);
    const $gallery = $product.find(elements.gallery);
    const height = $gallery.height();
    // 22 = margin:10px, height: 12px
    $colors.css("top", height - 22);
  });
}

function handleWidthTransition() {
  offsetColorSwatches();
}

$(document).on("click", elements.button, handleColorClick);

$(document).on("windowWidthChanged", handleWidthTransition);

$(document).ready(init);
