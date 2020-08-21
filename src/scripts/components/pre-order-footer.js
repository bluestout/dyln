import $ from "jquery";

const activeClass = "active";

function handleAtcBar() {
  const form = document.querySelector("[data-po-atc-anchor]");
  const atc = document.querySelector(["[data-po-atc]"]);

  if (!form || !atc) {
    return;
  }

  const gorgiasChat = document.getElementById("gorgias-web-messenger-container");
  const rectangle = form.getBoundingClientRect();

  if (rectangle.top < 0) {
    if (!atc.classList.contains(activeClass)) {
      atc.classList.add(activeClass);
    }
    if (gorgiasChat && !gorgiasChat.classList.contains("gorgias-offset")) {
      gorgiasChat.classList.add("gorgias-offset");
    }
  } else if (atc.classList.contains(activeClass)) {
    atc.classList.remove(activeClass);
    if (gorgiasChat && gorgiasChat.classList.contains("gorgias-offset")) {
      gorgiasChat.classList.remove("gorgias-offset");
    }
  }
}

document.addEventListener("windowScrolledRedux", handleAtcBar);
