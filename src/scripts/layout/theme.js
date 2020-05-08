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
