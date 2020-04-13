import $ from "jquery";

const datasets = {
  link: "header-link",
  block: "header-block",
  close: "header-block-close"
};

const elements = {
  header: "[data-section-type='header']",
  navToggle: "[data-navigation-toggle]",
  nav: "[data-header-navigation]",
  offset: "[data-header-offset]",
  banner: "[data-header-banner]",
  link: `[data-${datasets.link}]`,
  block: `[data-${datasets.block}]`,
  linkById: id => `[data-${datasets.link}="${id}"]`,
  blockById: id => `[data-${datasets.block}="${id}"]`,
  close: `[data-${datasets.close}]`
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

function handleHeaderLinkClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const $links = $(elements.link);
  const $blocks = $(elements.block);

  if ($source.length <= 0) {
    return;
  }

  const id = $source.data(datasets.link);
  const $block = $(elements.blockById(id));

  if ($(window).width() < 992) {
    if ($block.length > 0) {
      $blocks.not($block).slideUp();
      $block.slideToggle();
    }
    if ($source.length > 0) {
      $links.not($source).removeClass(classes.active);
      $source.toggleClass(classes.active);
    }
  } else {
    if ($links.length > 0) {
      $links.not($source).removeClass(classes.active);
    }
    if ($source.length > 0) {
      $source.toggleClass(classes.active);
    }
  }
}

function handleHeaderLinkClose(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const id = $source.data(datasets.close);
  const $link = $(elements.linkById(id));
  if ($link.length > 0) {
    $link.removeClass(classes.active);
  }
}

$(document).ready(() => {
  init();
});

$(document).on("click", elements.link, handleHeaderLinkClick);
$(document).on("click", elements.close, handleHeaderLinkClose);

document.addEventListener("ajaxReloaded", togglesInit);
