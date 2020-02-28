/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

import { CountryProvinceSelector } from "@shopify/theme-addresses";

import "../../../styles/account.scss";

const selectors = {
  addressContainer: "[data-address]",
  addressToggle: "[data-address-toggle]",
  addressCountry: "[data-address-country]",
  addressProvince: "[data-address-province]",
  addressProvinceWrapper: "[data-address-province-wrapper]",
  addressForm: "[data-address-form]",
  addressDeleteForm: "[data-address-delete-form]",
};

const classes = {
  hide: "hide",
  blur: "blur-out",
};

function initializeAddressForm(countryProvinceSelector, container) {
  const countrySelector = container.querySelector(selectors.addressCountry);
  const provinceSelector = container.querySelector(selectors.addressProvince);
  const provinceWrapper = container.querySelector(
    selectors.addressProvinceWrapper,
  );
  const addressForm = container.querySelector(selectors.addressForm);
  const deleteForm = container.querySelector(selectors.addressDeleteForm);
  const addressForms = document.querySelectorAll(selectors.addressForm);

  countryProvinceSelector.build(countrySelector, provinceSelector, {
    onCountryChange: (provinces) =>
      provinceWrapper.classList.toggle(classes.hide, !provinces.length),
  });

  if ("addressCountryNew" in countrySelector.dataset) {
    const option = document.createElement("option");
    option.text = theme.strings.country_cap || "COUNTRY";
    option.value = "";
    option.setAttribute("selected", "selected");
    option.setAttribute("disabled", "disabled");
    countrySelector.insertBefore(option, countrySelector.childNodes[0]);
  }

  const addressToggles = container.querySelectorAll(selectors.addressToggle);
  for (let i = 0; i < addressToggles.length; i++) {
    addressToggles[i].addEventListener("click", () => {
      // addressForm.classList.toggle(classes.hide);

      if (addressForm.classList.contains(classes.hide)) {
        for (let j = 0; j < addressForms.length; j++) {
          const element = addressForms[i];
          if (element !== addressForm) {
            element.classList.add(classes.blur);
          }
        }

        addressForm.classList.remove(classes.hide);
        setTimeout(() => {
          addressForm.classList.remove(classes.blur);
        }, 10);

        setTimeout(() => {
          for (let j = 0; j < addressForms.length; j++) {
            const element = addressForms[j];
            if (element !== addressForm) {
              element.classList.add(classes.hide);
            }
          }
        }, 260);
      } else {
        addressForm.classList.add(classes.blur);
        setTimeout(() => {
          addressForm.classList.add(classes.hide);
        }, 250);
      }
    });
  }

  if (deleteForm) {
    deleteForm.addEventListener("submit", (event) => {
      const confirmMessage = deleteForm.getAttribute("data-confirm-message");

      if (
        !window.confirm(
          confirmMessage || "Are you sure you wish to delete this address?",
        )
      ) {
        event.preventDefault();
      }
    });
  }
}

const addresses = document.querySelectorAll(selectors.addressContainer);

if (addresses.length) {
  const countryProvinceSelector = new CountryProvinceSelector(
    window.theme.allCountryOptionTags,
  );

  for (let i = 0; i < addresses.length; i++) {
    initializeAddressForm(countryProvinceSelector, addresses[i]);
  }
}
