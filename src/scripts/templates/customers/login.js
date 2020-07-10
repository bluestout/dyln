/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

import "../../../styles/login.scss";

const selectors = {
  recoverPasswordFormTriggers: "[data-recover-toggle]",
  recoverPasswordForm: "[data-recover-form]",
  loginForm: "[data-login-form]",
  formState: "[data-form-state]",
  resetSuccess: "[data-reset-success]",
};

const classes = {
  hide: "hide",
  blur: "blur-out",
};

function onShowHidePasswordForm(evt) {
  evt.preventDefault();
  toggleRecoverPasswordForm();
}

function checkUrlHash() {
  const hash = window.location.hash;

  // Allow deep linking to recover password form
  if (hash === "#forgot") {
    toggleRecoverPasswordForm();
  }
}

/**
 *  Show/Hide recover password form
 */
function toggleRecoverPasswordForm() {
  const login = document.querySelector(selectors.loginForm);
  const recover = document.querySelector(selectors.recoverPasswordForm);

  if (login.classList.contains(classes.hide)) {
    recover.classList.add(classes.blur);
    setTimeout(() => {
      recover.classList.add(classes.hide);
      login.classList.remove(classes.hide);

      setTimeout(() => {
        login.classList.remove(classes.blur);
      }, 10);
    }, 250);
  } else {
    login.classList.add(classes.blur);

    setTimeout(() => {
      login.classList.add(classes.hide);
      recover.classList.remove(classes.hide);

      setTimeout(() => {
        recover.classList.remove(classes.blur);
      }, 10);
    }, 250);
  }
}

/**
 *  Show reset password success message
 */
function resetPasswordSuccess() {
  // check if reset password form was
  // successfully submitted and show success message.

  if (document.querySelector(selectors.formState)) {
    document
      .querySelector(selectors.resetSuccess)
      .classList.remove(classes.hide);
  }
}

if (document.querySelector(selectors.recoverPasswordForm)) {
  checkUrlHash();
  resetPasswordSuccess();

  const triggers = document.querySelectorAll(
    selectors.recoverPasswordFormTriggers
  );

  for (let i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener("click", onShowHidePasswordForm);
  }
}
