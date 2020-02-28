const elements = {
  header: "[data-section-type='header']",
  drawerToggle: "[data-cart-drawer-toggle]",
  drawer: "[data-cart-drawer]",
  navToggle: "[data-navigation-toggle]",
  nav: "[data-header-navigation]",
  notification: "[data-header-notification]",
  notificationClose: "[data-header-notification-close]",
  offset: "[data-header-offset]",
  banner: "[data-header-banner]"
};

const classes = {
  scrolled: "scrolled",
  active: "active",
  fixed: "fixed"
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

function handleDrawerToggle(event) {
  event.preventDefault();
  document.querySelector(elements.drawer).classList.toggle(classes.active);
  document.querySelector("html").classList.toggle("no-scroll");
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

  /*
  const drawerToggles = document.querySelectorAll(elements.drawerToggle);

  for (let i = 0; i < drawerToggles.length; i++) {
    drawerToggles[i].addEventListener(events.click, handleDrawerToggle);
  }
  */
}

function notificationInit() {
  const isClosed = localStorage.getItem("notificationClosed");

  if (isClosed) {
    $(elements.header).removeClass("notification");
    $(elements.offset).removeClass("notification");
  } else {
    $(elements.header).addClass("notification");
    $(elements.offset).addClass("notification");
    $(elements.notification).removeClass("hide");
  }

  if (
    $(elements.banner).length > 0 ||
    ($(elements.notification).length > 0 &&
      $(elements.notification).css("display") !== "none")
  ) {
    $(elements.header).addClass("notification");
    $(elements.offset).addClass("notification");
  } else {
    $(elements.header).addClass("no-banner");
  }
}

function closeNotification() {
  $(elements.notification).addClass("hide");
  localStorage.setItem("notificationClosed", true);
  $(elements.header).removeClass("notification");
  $(elements.offset).removeClass("notification");
  $(elements.header).addClass("no-banner");
}

$(document).ready(() => {
  notificationInit();
  init();
});

$(document).on("click", elements.notificationClose, closeNotification);

document.addEventListener("ajaxReloaded", togglesInit);
