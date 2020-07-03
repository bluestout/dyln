import $ from "jquery";
import { getUrlParams } from "./helpers";

const customSelectChange = new Event("customSelectChange");

// any select with data-custom attribute will be "converted" to a custom dropdown
$(document).ready(() => {
  $("select[data-custom]").each(function() {
    const $this = $(this);
    const numberOfOptions = $(this).children("option").length;

    $this.addClass("custom-select-hidden");
    $this.wrap(`<div class="custom-select" data-custom-select></div>`);
    $this.after(
      `<button type="button" class="custom-select-styled" data-custom-select-styled></div>`
    );

    const $styledSelect = $this.next("[data-custom-select-styled]");
    const params = getUrlParams();
    if (params.sort_by && $("body").hasClass("template-collection")) {
      $styledSelect.text($(`option[value="${params.sort_by}"]`).text());
    } else {
      $styledSelect.text(
        $this
          .children("option")
          .eq(0)
          .text()
      );
    }

    const $list = $(
      `<div class="custom-select-options" data-custom-select-options></div>`
    ).insertAfter($styledSelect);

    for (let i = 0; i < numberOfOptions; i++) {
      if (
        $this
          .children("option")
          .eq(i)
          .attr("disabled") !== "disabled"
      ) {
        $("<button />", {
          text: $this
            .children("option")
            .eq(i)
            .text(),
          rel: $this
            .children("option")
            .eq(i)
            .val(),
          type: "button",
          class: "custom-select-option",
        }).appendTo($list);
      }
    }

    const $listItems = $list.children(".custom-select-option");

    $styledSelect.click(function(e) {
      e.stopPropagation();

      $("[data-custom-select-styled].active")
        .not(this)
        .each(function() {
          $(this)
            .removeClass("active")
            .next("[data-custom-select-options]")
            .hide();
        });

      $(this)
        .toggleClass("active")
        .next("[data-custom-select-options]")
        .toggle();
    });

    $listItems.click(function(e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass("active");
      $this.val($(this).attr("rel"));
      $this.change();
      $list.hide();
      document.dispatchEvent(customSelectChange);
    });
  });
});

$(document).on("click", "[data-custom-select-free]", (event) => {
  event.stopPropagation();
  const $this = $(event.currentTarget);
  $this
    .toggleClass("active")
    .next("[data-custom-select-options]")
    .toggle();
});

$(document).click(() => {
  const $styledSelect = $("[data-custom-select-styled]");
  const $list = $("[data-custom-select-options]");
  $styledSelect.removeClass("active");
  $list.hide();
});
