import $ from "jquery";

const el = {
  button: "[data-qty-change]",
};

function QuantityChange(event) {
  if (typeof event !== "undefined") {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  }
  const $source = $(event.currentTarget);
  const $input = $($source.data("qty-change"));
  // if no max, inventory is not tracked, so there's technically no limit to how many of that product can be added
  const max = parseInt($input.attr("max"), 10) || 99999;
  const direction = $source.data("direction");
  const value = parseInt($input.val(), 10);
  if (direction === "down") {
    if (value > 0) {
      $input.val(value - 1);
    }
  } else if (direction === "up") {
    if (value < max) {
      $input.val(value + 1);
    }
  }
  $input.change();
}

$(document).on("click", el.button, QuantityChange);
