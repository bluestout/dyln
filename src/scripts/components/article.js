import $ from "jquery";

const selectors = {
  modal: {
    link: "[data-contact-modal-link]",
    close: "[data-contact-modal-close]",
  },
};

const variables = {
  modalName: "#contact-modal-",
};

function handleModalLinkClick(event) {
  console.log("handleModalLinkClick", event);
  const $this = $(event.currentTarget);
  const href = $this.attr("href");
  if (href.indexOf(variables.modalName) > -1) {
    const $modal = $(href);
    $modal.fadeIn(200, () => {
      $modal.find(selectors.modal.close).focus();
    });
  }
}

function handleModalCloseClick() {
  $(`[id^="${variables.modalName.replace("#", "")}"]`).fadeOut();
  $(selectors.modal.link)
    .first()
    .focus();
}

$(document).on("click", selectors.modal.link, handleModalLinkClick);
$(document).on("click", selectors.modal.close, handleModalCloseClick);

$(document).keyup((event) => {
  if (event.key === "Escape") {
    handleModalCloseClick();
  }
});
