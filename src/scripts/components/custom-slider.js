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

function nextArrow() {
    let maxScroll = calculateMaxScroll();

    if (sliderItemsWidth > maxScroll) {
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

function calculateMaxScroll() {
    let elementWidth = $sliderItems.length * $sliderItems.outerWidth();
    let maxScrollVal = elementWidth - sliderWrapperWidth;

    return maxScrollVal;
}

$(elements.nextArrow).on("click", nextArrow);
$(elements.prevArrow).on("click", prevArrow);
$(elements.sliderWrapper).swipeend(function(e, touch) {

    if ($(window).width() < 1024) {
        return false;
    }

    let maxScrollVal = calculateMaxScroll();

    if (touch.direction === "left") {
        if ($sliderWrapper.scrollLeft() > maxScrollVal) {
            return false;
        }

        sliderItemsWidth = sliderItemsWidth + 480;
        $sliderWrapper.animate({scrollLeft: sliderItemsWidth}, 300);
    }

    if (touch.direction === "right") {
        if ($sliderWrapper.scrollLeft() === 0) {
            return false;
        }

        sliderItemsWidth = sliderItemsWidth - 480;
        $sliderWrapper.animate({scrollLeft: sliderItemsWidth}, 300);
    }
});

