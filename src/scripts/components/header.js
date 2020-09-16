import $ from "jquery";
import { toggleTabindexInChildren } from "./helpers";
import { productImageHtml } from "./ajaxcart-html";

const datasets = {
  link: "header-link",
  block: "header-block",
  close: "header-block-close",
  focusIn: "header-focus-in",
  popTerm: "popular-term"
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
  focusById: (id) => `[data-${datasets.focusIn}="${id}"]`,
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
  openLoginBlock: "[data-header-open-login-block]",
  openRegisterBlock: "[data-header-open-register-block]",
  loginBlock: "[data-header-login-block]",
  registerBlock: "[data-header-register-block]",
  accountButton: "[data-mobile-account-button]",
  gorgiasChat: "#gorgias-web-messenger-container",
  searchInput: "[data-header-search-input]",
  results: "[data-header-search-results]",
  searchOptions: "[data-search-options]",
  popTerm: `[data-${datasets.popTerm}]`,
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
  setTimeout(() => {
    resetOffsetHeight();
  }, 401);
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

  if ($link.length <= 0) {
    return;
  }

  const id = $link.data(datasets.link);
  headerSublinkOpen(id);
}

function headerSublinkOpen(id) {
  const $link = $(selectors.linkById(id));

  if ($link.length <= 0) {
    return;
  }

  const $links = $(selectors.link);
  const $block = $(selectors.blockById(id));
  const $blocks = $(selectors.block);
  const $iframe = $(selectors.iframe);

  $blocks
    .not($block)
    .find(selectors.iframe)
    .hide();
  toggleTabindexInChildren($block);
  toggleTabindexInChildren($blocks.not($block), 2);
  $block.find(selectors.iframe).toggle();
  $links.not($link).removeClass(classes.active);
  $link.toggleClass(classes.active);

  $iframe.show();
  const $focusIn = $(selectors.focusById(id));
  if ($focusIn.length > 0) {
    $focusIn.focus();
  }

  if ($(window).width() < 992) {
    $blocks.not($block).slideUp();
    $block.slideToggle();
  }
}

function handleHeaderLinkClose(event) {
  event.preventDefault();
  const id = $(event.currentTarget).data(datasets.close);
  closeHeaderById(id);
}

function closeHeaderById(id) {
  if (!id) {
    return null;
  }
  const $link = $(selectors.linkById(id));
  const $block = $(selectors.blockById(id));
  $block.find(selectors.iframe).toggle();
  if ($link.length > 0) {
    $link.removeClass(classes.active);
  }
  if ($block.length > 0) {
    toggleTabindexInChildren($block, 2);
  }
  return null;
}

function closeAllHeaderLinks() {
  const $link = $(selectors.link);
  const $blocks = $(selectors.link);
  $blocks.find(selectors.iframe).hide();
  $link.removeClass(classes.active);
  toggleTabindexInChildren($blocks, 2);
}

function handleHeaderButtonClick() {
  const $menu = $(selectors.menu);
  const $button = $(selectors.button);
  const $ann = $(selectors.announcement);
  const $overlay = $(selectors.overlay);
  $ann.toggleClass(classes.closed);
  $(selectors.gorgiasChat).toggleClass(classes.hide);

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

function resetOffsetHeight() {
  $(selectors.offset).css("min-height", $(selectors.headerBody).outerHeight());
}

function onScroll() {
  setIsHeaderScrolled();
  setHeaderBodyOffset();
}

function handleLoginOpenClick(event) {
  event.stopPropagation();
  event.preventDefault();
  $(selectors.registerBlock).fadeOut(150, () => {
    $(selectors.loginBlock).fadeIn();
  });
}

function handleRegisterOpenClick(event) {
  event.stopPropagation();
  event.preventDefault();
  $(selectors.loginBlock).fadeOut(150, () => {
    $(selectors.registerBlock).fadeIn();
  });
}

function handleAccountMobileBtnClick() {
  if (!$(selectors.menu).hasClass(classes.open)) {
    handleHeaderButtonClick();
  }

  setTimeout(() => {
    if (!$(selectors.linkById(4)).hasClass(classes.active)) {
      headerSublinkOpen(4);
    }
  }, 50);
}

let currentAjaxRequest = null;
function handleSearchInput() {
  const term = $(this).val();
  let resources = "";
  try {
    resources = JSON.parse($(selectors.searchOptions).text());
  } catch (error) {
    resources = {
      "type": "product,page,article,collection"
    }
  }
  const searchObject = {};
  searchObject["q"] = $(this).val();
  searchObject["resources"] = resources;
  const searchURL = "/search/suggest.json";
  const $resultsList = $(selectors.results);

  $resultsList.show();

  if ($resultsList.length > 0) {
    if (
      $resultsList.length > 0 &&
      term.length > 2 &&
      term !== $(this).attr("data-old-term")
    ) {
      $(this).attr("data-old-term", term);
      if (currentAjaxRequest !== null) {
        currentAjaxRequest.abort();
      }
      currentAjaxRequest = $.getJSON(searchURL, searchObject).done((data) => {
        let results = "";
        let products = "";
        let collections = "";
        let articles = "";
        let pages = "";

        if (data.resources.results.products.length > 0) {
          for (let i = 0; i < data.resources.results.products.length; i++) {
            products += productHtml(data.resources.results.products[i]);
          }
          results =
            `<div class="main-search__block">
            <h4 class="main-search__title">${theme.strings.search_products}</h4>
            ${products}
          </div>`;
        }

        if (data.resources.results.products.length > 0) {
          for (let i = 0; i < data.resources.results.collections.length; i++) {
            collections += collectionHtml(data.resources.results.collections[i]);
          }
          results += `<div class="main-search__block">
          <h4 class="main-search__title">${theme.strings.search_collections}</h4>
          ${collections}
        </div>`;
        }

        if (data.resources.results.articles.length > 0) {
          for (let i = 0; i < data.resources.results.articles.length; i++) {
            articles += articleHtml(data.resources.results.articles[i]);
          }
          results += `<div class="main-search__block">
          <h4 class="main-search__title">${theme.strings.search_articles}</h4>
          ${articles}
        </div>`;
        }

        if (data.resources.results.pages.length > 0) {
          for (let i = 0; i < data.resources.results.pages.length; i++) {
            pages += pageHtml(data.resources.results.pages[i]);
          }
          results += `<div class="main-search__block">
          <h4 class="main-search__title">${theme.strings.search_pages}</h4>
          ${pages}
        </div>`;
        }
        $resultsList.html(results);
      });
    }
  }
}

function handlePopLinkClick(event) {
  const $this = $(event.currentTarget);
  const $input = $(selectors.searchInput);
  $input.val($this);
  return $input.change();
}

function closeSearch(event) {
  let $container = $(".blog-search form");
  let $resultsList = $(selectors.results);

  if (
    !$container.is(event.target) &&
    $container.has(event.target).length === 0
  ) {
    return $resultsList.hide();
  }
  return null;
}

function productHtml(product) {
  if (!product || product.length === 0) {
    return "";
  }
  let price = `<span class="visually-hidden">${theme.strings.regular_price}</span>${theme.currency.symbol}${product.price}`;
  if (product.compare_at_price_max > product.price_min) {
    price = `<s><span class="visually-hidden">${theme.strings.on_sale}</span>${theme.currency.symbol}${product.compare_at_price_max}</s>${price}`;
  }

  const template =
    `<div class="main-search__item-wrap">
    <a href="${product.url}" class="main-search__item d-flex">
      <span class="main-search__img-wrap">${productImageHtml(product, "200x200")}</span>
      <span class="main-search__content-wrap">
        <h4 class="main-search__item-link">${product.title}</h4>
        <span class="main-search__price">
          ${price}
        </span>
      </span>
    </a>
  </div>`;
  return template;
}

function collectionHtml(collection) {
  if (!collection || collection.length === 0) {
    return "";
  }

  const template =
    `<div class="main-search__item-wrap">
    <a href="${collection.url}" class="main-search__item">
      <h4 class="main-search__item-link">${collection.title}</h4>
    </a>
  </div>`;
  return template;
}

function articleHtml(article) {
  if (!article || article.length === 0) {
    return "";
  }
  let image = "";
  let flexClass = "";
  let closeWrap = "";
  let openWrap = "";

  if (article.featured_image.url) {
    image = `<span class="main-search__img-wrap">${productImageHtml(article, "200x200")}</span>`
    flexClass = " d-flex";
    openWrap = `<span class="main-search__content-wrap">`;
    closeWrap = "</span>"
  }

  const template =
    `<div class="main-search__item-wrap">
      <a href="${article.url}" class="main-search__item${flexClass}">
        ${image}
        ${openWrap}
        <h4 class="main-search__item-link">${article.title}</h4>
        ${closeWrap}
      </a>
    </div>`;
  return template;
}

function pageHtml(page) {
  if (!page || page.length === 0) {
    return "";
  }
  const template =
    `<div class="main-search__item-wrap">
    <a href="${page.url}" class="main-search__item">
      <h4 class="main-search__item-link">${page.title}</h4>
    </a>
  </div>`;
  return template;
}

function mouseUpEvent(event) {
  closeLoginOnClickOut(event);
}

function closeLoginOnClickOut(event) {
  const loginIndex = 4;
  const $clickBlock = $(event.target).closest(selectors.blockById(loginIndex));
  const $clickLink = $(event.target).closest(selectors.linkById(loginIndex));
  const $loginLink = $(selectors.linkById(loginIndex));
  if ($clickBlock.length === 0 && $clickLink.length === 0 && $loginLink.hasClass(classes.active)) {
    closeHeaderById(loginIndex);
  }
}

$(document).on("keyup change", selectors.searchInput, handleSearchInput);
$(document).ready(() => { setHeaderBodyOffset() });

$(document).on("click", selectors.link, handleHeaderLinkClick);
$(document).on("click", selectors.close, handleHeaderLinkClose);
$(document).on("click", selectors.button, handleHeaderButtonClick);
$(document).on("click", selectors.openLoginBlock, handleLoginOpenClick);
$(document).on("click", selectors.openRegisterBlock, handleRegisterOpenClick);
$(document).on("click", selectors.accountButton, handleAccountMobileBtnClick);
$(document).on("click", selectors.popTerm, handlePopLinkClick);
$(document).on("mouseup", mouseUpEvent);

document.addEventListener("ajaxReloaded", togglesInit);
document.addEventListener("windowScrolledRedux", onScroll);
document.addEventListener("windowWidthChanged", resetOffsetHeight);
document.addEventListener("geoLocationComplete", setAnnouncementByCountry);

export { closeAllHeaderLinks, closeMobileMenu };
