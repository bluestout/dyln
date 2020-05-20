import $ from "jquery";

const datasets = {
  tabs: {
    tab: "c-tab",
  },
};

const selectors = {
  country: "[data-c-contact-country]",
  select: "[data-c-country-select]",
  countryByHandle: (handle) => `[data-c-contact-country="${handle}"]`,
  tabs: {
    current: "[data-c-tab-current]",
    list: "[data-c-tab-list]",
    tab: `[data-${datasets.tabs.tab}]`,
  },
  quickNav: {
    button: "[data-c-q-n-button]",
    list: "[data-c-q-n-list]",
    link: "[data-c-q-n-link]",
  },
  modal: {
    link: "[data-contact-modal-link]",
    close: "[data-contact-modal-close]",
  },
};

const classes = {
  active: "active",
  open: "open",
};

const variables = {
  modalName: "#contact-modal-",
};

function handleCountryChange(event) {
  const $this = $(event.currentTarget);
  const countryValue = $this.val();
  const $newCountry = $(selectors.countryByHandle(countryValue));
  const $allCountries = $(selectors.country);
  $allCountries.not($newCountry).fadeOut(200, () => {
    $allCountries.not($newCountry).removeClass(classes.active);
    if (!$newCountry.hasClass(classes.active)) {
      $newCountry.fadeIn(200);
      $newCountry.addClass(classes.active);
    }
  });
}

function handleCurrentTabClick() {
  $(selectors.tabs.list).slideToggle();
  $(selectors.tabs.current).toggleClass(classes.open);
}

function handleTabClick(event) {
  const newTitle = $(event.currentTarget).data(datasets.tabs.tab);
  $(selectors.tabs.current).text(newTitle);
  handleCurrentTabClick();
}

function handleQuickNavButtonClick() {
  if ($(window).width() < 768) {
    $(selectors.quickNav.list).slideToggle();
    $(selectors.quickNav.button).toggleClass(classes.open);
  }
}

function handleModalLinkClick(event) {
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

$(document).on("change", selectors.select, handleCountryChange);
$(document).on("click", selectors.tabs.current, handleCurrentTabClick);
$(document).on("click", selectors.tabs.tab, handleTabClick);
$(document).on("click", selectors.quickNav.button, handleQuickNavButtonClick);
$(document).on("click", selectors.quickNav.link, handleQuickNavButtonClick);
$(document).on("click", selectors.modal.link, handleModalLinkClick);
$(document).on("click", selectors.modal.close, handleModalCloseClick);

$(document).keyup((event) => {
  if (event.key === "Escape") {
    handleModalCloseClick();
  }
});
