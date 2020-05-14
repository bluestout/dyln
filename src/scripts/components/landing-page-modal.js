import $ from "jquery";

const elements = {
  modal: "[data-modal]",
  modalOverlay: "[data-modal-overlay]",
  timeTreshold: "[data-time-treshold]"
};

const $modal = $(elements.modal);
const $modalOverlay = $(elements.modalOverlay);

function init() {
  if ($newsletterModal.hasClass("only--mobile") && $(window).width() > elements.articleTreshold) {
    destroy();
    return false;
  }

  $newsletterOpenBtn.on("click", openModal);

  $(document).on("click", closeModal);

  $newsletterModal.on("click", (event) => {
    event.stopPropagation();
    return false;
  });

  return true;
}

function openModal() {
  $newsletterModal.addClass(elements.openModalSelector);
  $newsletterModalOverlay.addClass(elements.openModalSelector);

  return false;
}

function closeModal() {
  $newsletterModal.removeClass(elements.openModalSelector);
  $newsletterModalOverlay.removeClass(elements.openModalSelector);
}

function destroy() {
  $newsletterModal.removeClass(elements.openModalSelector);
  $newsletterModalOverlay.removeClass(elements.openModalSelector);
  $newsletterModal.off("click");
}

$(document).ready(init);

