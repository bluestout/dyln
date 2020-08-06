import "lazysizes/plugins/object-fit/ls.object-fit";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import "lazysizes/plugins/rias/ls.rias";
import "lazysizes/plugins/bgset/ls.bgset";
import "lazysizes";
import "lazysizes/plugins/respimg/ls.respimg";

import "../../styles/theme.scss";
import "../../styles/theme.scss.liquid";

import "../components/accordion";
import "../components/tabs";
import "../components/header";
import "../components/ajaxcart";
import "../components/scroll-to-data";
import "../components/rte";
import "../components/subscription";
import "../components/transitions";
import "../components/footer";
import "../components/diffuser-modal";
import "../components/custom-select";
import "../components/contact-sidebar";
import "../components/jquery.mobile-events";
import "../components/custom-slider";
import "../components/product-item";

import { focusHash, bindInPageLinks } from "@shopify/theme-a11y";

// Common a11y fixes
focusHash();
bindInPageLinks();

// Apply a specific class to the html element for browser support of cookies.
if (window.navigator.cookieEnabled) {
  document.documentElement.className = document.documentElement.className.replace(
    "supports-no-cookies",
    "supports-cookies"
  );
}

var windowScrolledRedux = new Event("windowScrolledRedux");
var windowWidthChanged = new Event("windowWidthChanged");
var ticking = false;

window.addEventListener("resize", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      document.dispatchEvent(windowWidthChanged);
      ticking = false;
    });
    ticking = true;
  }
});

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      document.dispatchEvent(windowScrolledRedux);
      ticking = false;
    });
    ticking = true;
  }
});
