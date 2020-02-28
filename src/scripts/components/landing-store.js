import $ from "jquery";
import "slick-carousel";

const elements = {
  gallerySlick: "[data-landing-gallery-slick]",
  events: "[data-landing-events]",
  gallery: "[data-landing-gallery]",
  galleryInner: "[data-landing-gallery-inner]",
  galleryDot: "[data-landing-gallery-dot]",
  galleryDotById: id => `[data-landing-gallery-dot="${id}"]`,
  galleryImage: "[data-landing-gallery-image]",
  galleryImageById: id => `[data-landing-gallery-image="${id}"]`
};

function init() {
  const $gallery = $(elements.gallerySlick);
  const $events = $(elements.events);

  if ($gallery.length > 0) {
    $gallery.slick({
      swipeToSlide: true,
      arrows: false,
      dots: true,
      slidesToShow: 1
    });
  }

  if ($events.length > 0) {
    $events.slick({
      swipeToSlide: true,
      arrows: false,
      dots: true,
      slidesToShow: 1
    });
  }
}

function handleGalleryScroll() {
  const $source = $(elements.gallery);
  const $images = $source.find(elements.galleryImage);
  const scroll = $source.scrollTop();
  $images.each((index, value) => {
    const $child = $(value);
    const id = $child.data("landing-gallery-image");
    if (id && !$child.hasClass("active")) {
      const offset = $child.get(0).offsetTop;
      if (scroll >= offset - $child.outerHeight(true) * 0.6) {
        $(elements.galleryDot).removeClass("active");
        $(elements.galleryDotById(id)).addClass("active");
      }
    }
  });
}

function handleGalleryDotClick(event) {
  const $source = $(event.currentTarget);
  const id = $source.data("landing-gallery-dot");
  if (id) {
    const parent = document.querySelector(elements.gallery);
    const image = document.querySelector(elements.galleryImageById(id));
    scrollTo(parent, image.offsetTop, 500);
  }
}

function scrollTo(element, to, duration) {
  const start = element.scrollTop;
  const change = to - start;
  let currentTime = 0;
  const increment = 20;

  function animateScroll() {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  }
  animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

$(document).ready(init);

document
  .querySelector(elements.gallery)
  .addEventListener("scroll", handleGalleryScroll);

$(elements.galleryDot).on("click", handleGalleryDotClick);
