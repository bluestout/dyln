import { scrollTo } from "./scroll-to";

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
  const href = source.dataset.scrollTo;
  if (href) {
    const hashLoc = href.indexOf("#");
    if (hashLoc > -1) {
      const id = href.substring(hashLoc);
      const target = document.getElementById(id);
      const body = document.querySelector("html");
      scrollTo(body, target.offsetTop, 1000);
    }
  }
}
