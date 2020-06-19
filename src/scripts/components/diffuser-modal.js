import $ from "jquery";
import { toggleTabindexInChildren } from "./helpers";

const selectors = {
  close: "[data-diffuser-info-modal-close]",
  open: "[data-diffuser-info-modal-open]",
  modal: "[data-diffuser-info-modal]",
  focusIn: "[data-diffuser-info-modal-focusin]",
  focusOut: "[data-diffuser-info-modal-focusout]",
  closeSub: "[data-diffuser-sub-modal-close]",
  openSub: "[data-diffuser-sub-modal-open]",
  modalSub: "[data-diffuser-sub-modal]",
  focusInSub: "[data-diffuser-sub-modal-focusin]",
  focusOutSub: "[data-diffuser-sub-modal-focusout]",
};

function closeModal(noFocus) {
  $(selectors.modal).fadeOut("fast");
  toggleTabindexInChildren($(selectors.modal), 2);
  if (!noFocus) {
    $(selectors.focusOut).focus();
  }
}

function openModal() {
  $(selectors.modal).fadeIn("fast");
  toggleTabindexInChildren($(selectors.modal), 1);
  $(selectors.focusIn).focus();
}

function closeModalSub(noFocus) {
  $(selectors.modalSub).fadeOut("fast");
  toggleTabindexInChildren($(selectors.modalSub), 2);
  if (!noFocus) {
    $(selectors.focusOutSub).focus();
  }
}

function openModalSub() {
  $(selectors.modalSub).fadeIn("fast");
  toggleTabindexInChildren($(selectors.modalSub), 1);
  $(selectors.focusInSub).focus();
}

$(document).on("click", selectors.open, openModal);
$(document).on("click", selectors.close, closeModal);
$(document).on("click", selectors.openSub, openModalSub);
$(document).on("click", selectors.closeSub, closeModalSub);

$(document).keyup((event) => {
  if (event.key === "Escape") {
    closeModal(true);
    closeModalSub(true);
  }
});
