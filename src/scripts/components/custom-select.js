import $ from "jquery";

const customSelectChange = new Event("customSelectChange");

// check if url has parameters
function getUrlParams() {
  const params = {};
  if (window.location.search.length > 0) {
    const pairs = document.location.search.substr(1).split("&");
    for (let i = 0; i < pairs.length; i++) {
      const paramsSplit = pairs[i].split("=");
      params[paramsSplit[0]] = paramsSplit[1];
    }
  }
  return params;
}

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

    $styledSelect.focus(function(e) {
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

    $(document).click(() => {
      $styledSelect.removeClass("active");
      $list.hide();
    });
  });

  $("[data-custom-select-free]").click(function(event) {
    event.stopPropagation();
    $(this)
      .toggleClass("active")
      .next("[data-custom-select-options]")
      .toggle();
  });
});
