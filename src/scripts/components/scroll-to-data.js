import { scrollTo } from "./scroll-to";
import { closeAllHeaderLinks, closeMobileMenu } from "./header";

const data = "scroll-to";
const element = `[data-${data}]`;

const allScroll = document.querySelectorAll(element);

for (let i = 0; i < allScroll.length; i++) {
  const scroll = allScroll[i];
  scroll.addEventListener("click", clickListener);
}

function clickListener(event) {
  event.preventDefault();
  const source = event.currentTarget;
  let target = source.dataset.scrollTo;
  if (target) {
    target = document.querySelector(target);
    if (target) {
      closeAllHeaderLinks();
      closeMobileMenu();
      const body = document.querySelector("html");
      scrollTo(body, target.offsetTop, 1000);
    }
  }
}
