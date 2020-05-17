import $ from "jquery";

const selectors = {
  country: "[data-c-contact-country]",
  select: "[data-c-country-select]",
  countryByHandle: (handle) => `[data-c-contact-country="${handle}"]`,
};

const classes = {
  active: "active",
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

$(document).on("change", selectors.select, handleCountryChange);
