import $ from "jquery";

const elements = {
  newsletterBtn: "[data-newsletter-open-btn]",
  newsletterModal: "[data-newsletter-modal]",
  newsletterModalOverlay: "[data-newsletter-modal-overlay]",
  openModalSelector: "modal-opened",
  articleTreshold: 768
};

const $newsletterModal = $(elements.newsletterModal);
const $newsletterModalOverlay = $(elements.newsletterModalOverlay);

function init() {
  const $newsletterOpenBtn = $(elements.newsletterBtn);

  if ($("body").hasClass("template-article")) {
    elements.articleTreshold = 1280;
  }

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

