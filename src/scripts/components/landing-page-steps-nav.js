import $ from "jquery";

const elements = {
  stepSelector: "[data-step]",
  navSelect: "[data-nav]",
  prevStepBtn: "[data-prev-step]",
  nextStepBtn: "[data-next-step]",
};

const $prevStepBtn = $(elements.prevStepBtn);
const $nextStepBtn = $(elements.nextStepBtn);
const $navStep = $(elements.stepSelector);
const lastItemNum = ($navStep.length - 2);
let stepCount = 0;

function init() {
  $nextStepBtn.on("click", nextStep);
  $prevStepBtn.on("click", prevStep);

  return true;
}

function nextStep() {
  if (stepCount > lastItemNum) {
    return false;
  }

  if (stepCount === lastItemNum) {
    $nextStepBtn.addClass("disabled");
  }

  $navStep.eq(stepCount).fadeOut();

  stepCount++;

  if (stepCount > 0) {
    $prevStepBtn.removeClass("disabled");
  }

  $navStep.eq(stepCount).css("display", "flex")
    .hide()
    .fadeIn();


  return false;
}

function prevStep() {
  if (stepCount <= 0) {
    return false;
  }

  $navStep.eq(stepCount).fadeOut();

  stepCount--;

  if (stepCount < $navStep.length - 1) {
    $nextStepBtn.removeClass("disabled");
  }

  if (stepCount === 0) {
    $prevStepBtn.addClass("disabled");
  }

  $navStep.eq(stepCount).css("display", "flex")
    .hide()
    .fadeIn();

  return false;
}

if ($(window).width() <= 768) {
  $(document).ready(init);
}

