import $ from "jquery";

const elements = {
  modal: "[data-modal]",
  modalOverlay: "[data-modal-overlay]",
  closeModalBtn: "[data-close-modal]"
};

const classes = {
  openModal: "modal-opened",
  closeModal: "modal-closed"
};

const $modal = $(elements.modal);
const $modalOverlay = $(elements.modalOverlay);
const $closeModalBtn = $(elements.closeModalBtn);
const modalTimeout = $modal.data("time-interval");

console.log($modalOverlay);

function init() {

  $closeModalBtn.on("click", closeModal);

  setTimeout(function () {
    openModal();
  }, modalTimeout);

  $modal.on("click", (event) => {
    event.stopPropagation();
    return false;
  });

  return true;
}

function openModal() {
  $modal.removeClass(classes.closeModal).addClass(classes.openModal);
  $modalOverlay.removeClass(classes.closeModal).addClass(classes.openModal);

  return false;
}

function closeModal() {
  $modal.removeClass(classes.openModal).addClass(classes.closeModal);
  $modalOverlay.removeClass(classes.openModal).addClass(classes.closeModal);
}

$(document).ready(init);

