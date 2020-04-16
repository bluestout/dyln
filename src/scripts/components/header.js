import $ from "jquery";

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
  overlay: "[data-menu-mobile-overlay]",
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

const events = {
  resize: "resize",
  click: "click",
  scroll: "scroll",
};

const windowScrolledRedux = new Event("windowScrolledRedux");
const windowWidthChanged = new Event("windowWidthChanged");

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
        setHeaderBodyOffset(1);
        document.dispatchEvent(windowScrolledRedux);
        ticking = false;
      });
      ticking = true;
    }
  });

  setHeaderBodyOffset();
}

function togglesInit() {
  const navToggles = document.querySelectorAll(selectors.navToggle);
  for (let i = 0; i < navToggles.length; i++) {
    navToggles[i].addEventListener(events.click, handleNavToggle);
  }
}

function handleHeaderLinkClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const $links = $(selectors.link);
  const $blocks = $(selectors.block);

  if ($source.length <= 0) {
    return;
  }

  const id = $source.data(datasets.link);
  const $block = $(selectors.blockById(id));

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
  const $link = $(selectors.linkById(id));
  if ($link.length > 0) {
    $link.removeClass(classes.active);
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

  setTimeout(() => {
    setHeaderBodyOffset(2);
  }, 20);

  $overlay.css("top", `${headerHeight}px`);

  $menu.css({
    top: `${headerHeight}px`,
    height: `calc(100vh - ${headerHeight}px)`,
  });
}

$(document).ready(() => {
  init();
});

$(document).on("click", selectors.link, handleHeaderLinkClick);
$(document).on("click", selectors.close, handleHeaderLinkClose);
$(document).on("click", selectors.button, handleHeaderButtonClick);

document.addEventListener("ajaxReloaded", togglesInit);
