import $ from "jquery";

const elements = {
    sliderWrapper: "[data-slider-wrapper]",
    sliderItem: "[data-slider-item]",
    nextArrow: "[data-next-arrow]",
    prevArrow: "[data-prev-arrow]"
};

const $sliderWrapper = $(elements.sliderWrapper);
const $sliderItems = $(elements.sliderItem);
const sliderWrapperWidth = $sliderWrapper.outerWidth();
let sliderItemsWidth = 0;

function init() {

    return true;
}

function nextArrow() {

    if (sliderWrapperWidth > $sliderWrapper.outerWidth()) {
        return false;
    }

    sliderItemsWidth = sliderItemsWidth + $sliderItems.outerWidth();
    $sliderWrapper.animate({scrollLeft: sliderItemsWidth}, 500);
}

function prevArrow() {

    if (sliderItemsWidth === 0) {
        return false;
    }

    sliderItemsWidth = sliderItemsWidth - $sliderItems.outerWidth();
    $sliderWrapper.animate({scrollLeft: sliderItemsWidth}, 500);
}

$(document).ready(init);
$(elements.nextArrow).on("click", nextArrow);
$(elements.prevArrow).on("click", prevArrow);
$(elements.sliderWrapper).swipeend(function(e, touch) {
    console.log(touch.direction);
    console.log(touch.xAmount);

    if (touch.direction === "left") {
        sliderItemsWidth = sliderItemsWidth + 450;
        $sliderWrapper.animate({scrollLeft: sliderItemsWidth}, 300);
    }

    if (touch.direction === "right") {
        sliderItemsWidth = sliderItemsWidth - 450;
        $sliderWrapper.animate({scrollLeft: sliderItemsWidth}, 300);
    }
});

