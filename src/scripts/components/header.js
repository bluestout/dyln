import $ from "jquery";

const elements = {
  header: "[data-section-type='header']",
  drawer: "[data-cart-drawer]",
  navToggle: "[data-navigation-toggle]",
  nav: "[data-header-navigation]",
  notification: "[data-header-notification]",
  notificationClose: "[data-header-notification-close]",
  offset: "[data-header-offset]",
  banner: "[data-header-banner]",
  link: "[data-header-link]"
};

const classes = {
  scrolled: "scrolled",
  active: "active",
  fixed: "fixed",
  note: "notification",
  hide: "hide",
  noBanner: "no-banner"
};

const events = {
  resize: "resize",
  click: "click",
  scroll: "scroll"
};

const windowScrolledRedux = new Event("windowScrolledRedux");
const windowWidthChanged = new Event("windowWidthChanged");

function setIsHeaderScrolled() {
  const scroll = window.scrollY;
  if (scroll > 5) {
    document.querySelector(elements.header).classList.add(classes.scrolled);
  } else {
    document.querySelector(elements.header).classList.remove(classes.scrolled);
  }

  if (scroll >= 75) {
    document.querySelector(elements.header).classList.add(classes.fixed);
  } else {
    document.querySelector(elements.header).classList.remove(classes.fixed);
  }
}

function handleNavToggle(event) {
  event.preventDefault();
  document.querySelector(elements.nav).classList.toggle(classes.active);
}

function init() {
  let ticking = false;

  window.addEventListener(events.resize, () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        document.dispatchEvent(windowWidthChanged);
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener(events.scroll, () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setIsHeaderScrolled();
        document.dispatchEvent(windowScrolledRedux);
        ticking = false;
      });
      ticking = true;
    }
  });
}

function togglesInit() {
  const navToggles = document.querySelectorAll(elements.navToggle);
  for (let i = 0; i < navToggles.length; i++) {
    navToggles[i].addEventListener(events.click, handleNavToggle);
  }
}

function notificationInit() {
  const isClosed = localStorage.getItem("notificationClosed");

  if (isClosed) {
    $(elements.header).removeClass(classes.note);
    $(elements.offset).removeClass(classes.note);
  } else {
    $(elements.header).addClass(classes.note);
    $(elements.offset).addClass(classes.note);
    $(elements.notification).removeClass(classes.hide);
  }

  if (
    $(elements.banner).length > 0 ||
    ($(elements.notification).length > 0 &&
      $(elements.notification).css("display") !== "none")
  ) {
    $(elements.header).addClass(classes.note);
    $(elements.offset).addClass(classes.note);
  } else {
    $(elements.header).addClass(classes.noBanner);
  }
}

function closeNotification() {
  $(elements.notification).addClass(classes.hide);
  localStorage.setItem("notificationClosed", true);
  $(elements.header).removeClass(classes.note);
  $(elements.offset).removeClass(classes.note);
  $(elements.header).addClass(classes.noBanner);
}

function handleHeaderLinkClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  if ($source.length > 0) {
    $source.toggleClass(classes.active);
  }
}

$(document).ready(() => {
  notificationInit();
  init();
});

$(document).on("click", elements.notificationClose, closeNotification);

$(document).on("click", elements.link, handleHeaderLinkClick);

document.addEventListener("ajaxReloaded", togglesInit);
