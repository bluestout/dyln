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
let stepCount = 0;

function init() {
  $nextStepBtn.on("click", nextStep);
  $prevStepBtn.on("click", prevStep);

  return true;
}

function nextStep() {

  $navStep.eq(stepCount).fadeOut();

  stepCount++;
  $navStep.eq(stepCount).css("display", "flex")
    .hide()
    .fadeIn();


  return false;
}

function prevStep() {
  $navStep.eq(stepCount).fadeOut();

  stepCount--;
  $navStep.eq(stepCount).css("display", "flex")
    .hide()
    .fadeIn();


  return false;
}

if ($(window).width() <= 768) {
  $(document).ready(init);
}

