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
  search: {
    input: "[data-contact-search-input]",
    results: "[data-contact-search-results]",
    form: "[data-contact-search-form]",
    submit: "[data-contact-search-submit]",
  },
};

const classes = {
  active: "active",
  open: "open",
};

const variables = {
  modalName: "#contact-modal-",
};

function handleCountryChange() {
  const countryValue = $(selectors.select).val();
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

function handleFaqSearchSubmitClick(event) {
  event.preventDefault();
  searchFaqContentAjax();
}

let currentAjaxRequest = null;
function searchFaqContentAjax() {
  const term = $(selectors.search.input).val();
  const $form = $(selectors.search.form);
  const searchURL = `/search?type=article&q=${term}&faq-only="true"`;
  const $resultsList = $(selectors.search.results);
  $resultsList.show();

  if ($resultsList.length) {
    if (
      $resultsList.length > 0 &&
      term.length > 2 &&
      term !== $form.attr("data-old-term")
    ) {
      $form.attr("data-old-term", term);
      if (currentAjaxRequest !== null) {
        currentAjaxRequest.abort();
      }
      currentAjaxRequest = $.getJSON(`${searchURL}&view=json`, (data) => {
        let faqResults = 0;
        $resultsList.empty();
        if (data.results_count === 0) {
          $resultsList.html(
            `<p class='contact-body__question'>
              ${theme.strings.no_results_for} "${term}".
            </p>`
          );
        } else {
          let results = "";
          $.each(data.results, (index, item) => {
            let isFaq = false;
            if (item.url.indexOf("faqs") > -1) {
              isFaq = true;
              faqResults++;
            }
            if (isFaq) {
              const result = `
              <div class="contact-body__answer">
                <a href="${item.url}">
                ${item.title}
                </a>
              </div>`;
              results += result;
            }
          });
          if (faqResults > 0) {
            results = `<h4 class="contact-body__question">
              ${theme.strings.search_results}
              <h4> ${results}`;
          }
          $resultsList.append(results);
          if (faqResults > 5) {
            $resultsList.append(
              `<div>
                <a class="contact-body__question mt-3" href="${searchURL}">
                  ${theme.strings.show_more}
                </a>
              </div>`
            );
          }
        }
      });
    }
  }
}

$(document).on("change", selectors.select, handleCountryChange);
$(document).on("click", selectors.tabs.current, handleCurrentTabClick);
$(document).on("click", selectors.tabs.tab, handleTabClick);
$(document).on("click", selectors.quickNav.button, handleQuickNavButtonClick);
$(document).on("click", selectors.quickNav.link, handleQuickNavButtonClick);
$(document).on("click", selectors.modal.link, handleModalLinkClick);
$(document).on("click", selectors.modal.close, handleModalCloseClick);
$(document).on("click", selectors.search.submit, handleFaqSearchSubmitClick);
document.addEventListener("customSelectChange", handleCountryChange);

$(document).keyup((event) => {
  if (event.key === "Escape") {
    handleModalCloseClick();
  }
});
