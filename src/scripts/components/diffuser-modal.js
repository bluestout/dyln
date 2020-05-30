import $ from "jquery";
import { toggleTabindexInChildren } from "./helpers";

const selectors = {
  close: "[data-diffuser-info-modal-close]",
  open: "[data-diffuser-info-modal-open]",
  modal: "[data-diffuser-info-modal]",
  focusIn: "[data-diffuser-info-modal-focusin]",
  focusOut: "[data-diffuser-info-modal-focusout]",
};

function closeModal() {
  $(selectors.modal).fadeOut("fast");
  toggleTabindexInChildren($(selectors.modal), 2);
  $(selectors.focusOut).focus();
}

function openModal() {
  $(selectors.modal).fadeIn("fast");
  toggleTabindexInChildren($(selectors.modal), 1);
  $(selectors.focusIn).focus();
}

$(document).on("click", selectors.open, openModal);
$(document).on("click", selectors.close, closeModal);

$(document).keyup((event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
