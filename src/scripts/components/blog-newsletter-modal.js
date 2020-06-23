import $ from "jquery";

const elements = {
  newsletterBtn: "[data-newsletter-open-btn]",
  newsletterModal: "[data-newsletter-modal]",
  newsletterModalOverlay: "[data-newsletter-modal-overlay]",
};

const classes = {
  openModalSelector: "modal-opened",
  onlyMobile: "only--mobile"
};

const values = {
  articleTreshold: 768
};

const $newsletterModal = $(elements.newsletterModal);
const $newsletterModalOverlay = $(elements.newsletterModalOverlay);

function init() {
  const $newsletterOpenBtn = $(elements.newsletterBtn);

  if ($("body").hasClass("template-article")) {
    values.articleTreshold = 1280;
  }

  if ($newsletterModal.hasClass(classes.onlyMobile) && $(window).width() > values.articleTreshold) {
    destroy();
    return false;
  }

  $newsletterOpenBtn.on("click", openModal);

  return true;
}

function openModal() {
  $newsletterModal.addClass(classes.openModalSelector);
  $newsletterModalOverlay.addClass(classes.openModalSelector);

  return false;
}

function closeModal() {
  $newsletterModal.removeClass(classes.openModalSelector);
  $newsletterModalOverlay.removeClass(classes.openModalSelector);
}

function destroy() {
  $newsletterModal.removeClass(classes.openModalSelector);
  $newsletterModalOverlay.removeClass(classes.openModalSelector);
  $newsletterModal.off("click");
}

$(document).ready(init);
$(document).mouseup(function(e) {
  const $newsletterModal = $(elements.newsletterModal);

  if (!$newsletterModal.is(e.target) && $newsletterModal.has(e.target).length === 0) {
    closeModal();
  }
});
