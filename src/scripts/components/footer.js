import $ from "jquery";

const selectors = {
  smsOptIn: "[data-sms-opt-in]",
  emailOptIn: "[data-email-opt-in]",
  buttonSlider: "[data-button-slider]",
  emailInput: "[data-email-input]",
  phoneInput: "[data-phone-input]",
  submitPhone: "[data-phone-submit]"
};

const classes = {
  right: "right",
  active: "active",
};

function handleSmsOptInClick() {
  $(selectors.buttonSlider).addClass(classes.right);
  $(selectors.phoneInput).addClass(classes.active);
  $(selectors.smsOptIn).addClass(classes.active);
  $(selectors.emailInput).removeClass(classes.active);
  $(selectors.emailOptIn).removeClass(classes.active);
}

function handleEmailOptInClick() {
  $(selectors.buttonSlider).removeClass(classes.right);
  $(selectors.phoneInput).removeClass(classes.active);
  $(selectors.smsOptIn).removeClass(classes.active);
  $(selectors.emailInput).addClass(classes.active);
  $(selectors.emailOptIn).addClass(classes.active);
}

function triggerSmsSubmission(event) {
  event.preventDefault();

  $(".opt-in-sms").find("button[type='button']").trigger("click");
}

function moveCustomBtn() {
  setTimeout(function () {
    $("[data-phone-submit]").insertAfter($(".XIWpM"));
  }, 1500);
}

$(document).ready(() => {
  $(selectors.smsOptIn).on("click", handleSmsOptInClick);
  $(selectors.emailOptIn).on("click", handleEmailOptInClick);
  $(selectors.submitPhone).on("click", triggerSmsSubmission);

  moveCustomBtn();
});
