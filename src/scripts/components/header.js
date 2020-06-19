import $ from "jquery";
import { toggleTabindexInChildren } from "./helpers";

const datasets = {
  link: "header-link",
  block: "header-block",
  close: "header-block-close",
};

const selectors = {
  header: "[data-section-type='header']",
  navToggle: "[data-navigation-toggle]",
  nav: "[data-header-navigation]",
  offset: "[data-header-offset]",
  link: `[data-${datasets.link}]`,
  block: `[data-${datasets.block}]`,
  linkById: (id) => `[data-${datasets.link}="${id}"]`,
  blockById: (id) => `[data-${datasets.block}="${id}"]`,
  close: `[data-${datasets.close}]`,
  button: "[data-mobile-menu-button]",
  menu: "[data-menu-mobile]",
  headerBody: "[data-site-header]",
  announcement: "[data-announcement-bar]",
  barUsa: "[data-announcement-bar-usa]",
  barCa: "[data-announcement-bar-ca]",
  barOther: "[data-announcement-bar-other]",
  overlay: "[data-menu-mobile-overlay]",
  iframe: "[data-header-toggle-element]",
};

const classes = {
  scrolled: "scrolled",
  active: "active",
  fixed: "fixed",
  note: "notification",
  hide: "hide",
  noBanner: "no-banner",
  open: "open",
  closed: "closed",
};

function setIsHeaderScrolled() {
  const scroll = window.scrollY;
  if (scroll > 5) {
    document.querySelector(selectors.header).classList.add(classes.scrolled);
  } else {
    document.querySelector(selectors.header).classList.remove(classes.scrolled);
  }

  if (scroll >= 75) {
    document.querySelector(selectors.header).classList.add(classes.fixed);
  } else {
    document.querySelector(selectors.header).classList.remove(classes.fixed);
  }
}

function setHeaderBodyOffset(mode) {
  const scroll = window.scrollY;
  const $headerBody = $(selectors.headerBody);
  const height = $(selectors.announcement).outerHeight();

  const offset = height - scroll;

  if (height > 0 && Math.sign(offset) === 1) {
    if ($headerBody.css("top") !== offset) {
      $headerBody.css("top", offset);
    }
  } else if ($headerBody.css("top") !== 0 || mode === 2) {
    $headerBody.css("top", 0);
  }
}

function handleNavToggle(event) {
  event.preventDefault();
  document.querySelector(selectors.nav).classList.toggle(classes.active);
}

function togglesInit() {
  const navToggles = document.querySelectorAll(selectors.navToggle);
  for (let i = 0; i < navToggles.length; i++) {
    navToggles[i].addEventListener("click", handleNavToggle);
  }
}

function handleHeaderLinkClick(event) {
  event.preventDefault();
  const $link = $(event.currentTarget);
  const $links = $(selectors.link);

  if ($link.length <= 0) {
    return;
  }

  const id = $link.data(datasets.link);
  const $block = $(selectors.blockById(id));
  const $blocks = $(selectors.block);

  $blocks
    .not($block)
    .find(selectors.iframe)
    .toggle();
  toggleTabindexInChildren($block);
  toggleTabindexInChildren($blocks.not($block));
  $block.find(selectors.iframe).toggle();
  $links.not($link).removeClass(classes.active);
  $link.toggleClass(classes.active);

  if ($(window).width() < 992) {
    $blocks.not($block).slideUp();
    $block.slideToggle();
  }
}

function handleHeaderLinkClose(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const id = $source.data(datasets.close);
  const $link = $(selectors.linkById(id));
  const $block = $(selectors.blockById(id));
  if ($link.length > 0) {
    $link.removeClass(classes.active);
  }
  if ($block.length > 0) {
    toggleTabindexInChildren($block);
  }
}

function handleHeaderButtonClick(event) {
  const $menu = $(selectors.menu);
  const $button = $(event.currentTarget);
  const $ann = $(selectors.announcement);
  const headerHeight = $(selectors.headerBody).outerHeight();
  const $overlay = $(selectors.overlay);

  $ann.toggleClass(classes.closed);
  $menu.toggleClass(classes.open);
  $button.toggleClass(classes.open);
  $("html").toggleClass("no-scroll");

  setTimeout(() => {
    setHeaderBodyOffset(2);
  }, 20);

  $overlay.css("top", `${headerHeight}px`);

  $menu.css({
    top: `${headerHeight}px`,
    height: `calc(100% - ${headerHeight}px)`,
  });
}

function setAnnouncementByCountry() {
  if ($("body").hasClass("location-us")) {
    $(selectors.barUsa).show();
    $(selectors.barCa).hide();
    $(selectors.barOther).hide();
  } else if ($("body").hasClass("location-ca")) {
    $(selectors.barUsa).hide();
    $(selectors.barCa).show();
    $(selectors.barOther).hide();
  } else if ($("body").hasClass("location-other")) {
    $(selectors.barUsa).hide();
    $(selectors.barCa).hide();
    $(selectors.barOther).show();
  }
}

function onScroll() {
  setIsHeaderScrolled();
  setHeaderBodyOffset(1);
}

$(document).ready(() => {
  setHeaderBodyOffset();
});

$(document).on("click", selectors.link, handleHeaderLinkClick);
$(document).on("click", selectors.close, handleHeaderLinkClose);
$(document).on("click", selectors.button, handleHeaderButtonClick);

document.addEventListener("ajaxReloaded", togglesInit);
document.addEventListener("windowScrolledRedux", onScroll);
document.addEventListener("geoLocationComplete", setAnnouncementByCountry);
