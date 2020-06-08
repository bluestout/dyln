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

  console.log(values.articleTreshold);

  if ($newsletterModal.hasClass(classes.onlyMobile) && $(window).width() > values.articleTreshold) {
    console.log("is this exec");
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

