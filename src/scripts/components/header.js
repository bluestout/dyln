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
  headerContainer: "[data-site-header-container]",
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

function setHeaderBodyOffset() {
  const scroll = window.scrollY;
  const $anno = $(selectors.announcement);

  if (scroll >= 50 && $anno.length > 0) {
    $anno.slideUp(400);
  } else if ($anno.length > 0) {
    $anno.slideDown(400);
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
    .hide();
  toggleTabindexInChildren($block);
  toggleTabindexInChildren($blocks.not($block), 2);
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
  $block.find(selectors.iframe).toggle();
  if ($link.length > 0) {
    $link.removeClass(classes.active);
  }

  if ($block.length > 0) {
    toggleTabindexInChildren($block, 2);
  }
}

function closeAllHeaderLinks() {
  const $link = $(selectors.link);
  const $blocks = $(selectors.link);
  $blocks.find(selectors.iframe).hide();
  $link.removeClass(classes.active);
  toggleTabindexInChildren($block, 2);
}

function handleHeaderButtonClick() {
  const $menu = $(selectors.menu);
  const $button = $(selectors.button);
  const $ann = $(selectors.announcement);
  const $overlay = $(selectors.overlay);
  $ann.toggleClass(classes.closed);

  const headerHeight = $(selectors.headerBody).outerHeight();
  $menu.toggleClass(classes.open);
  $button.toggleClass(classes.open);
  $("html").toggleClass("no-scroll");

  setTimeout(() => {
    setHeaderBodyOffset();
  }, 20);

  $overlay.css("top", `${headerHeight}px`);

  $menu.css({
    top: `${headerHeight}px`,
    height: `calc(100% - ${headerHeight}px)`,
  });
}

function closeMobileMenu() {
  const $menu = $(selectors.menu);
  const $button = $(selectors.button);
  const $ann = $(selectors.announcement);
  $menu.removeClass(classes.open);
  $button.removeClass(classes.open);
  $ann.removeClass(classes.closed);
  $("html").removeClass("no-scroll");
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

export { closeAllHeaderLinks, closeMobileMenu };
