import $ from "jquery";

function tabs(event) {
  event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  const $this = $(event.currentTarget);
  if (!$this.hasClass("active")) {
    const $container = $this.closest("[data-tabs-container]");
    const index = $this.data("tab-link");
    const $target = $container.find(`[data-tab="${index}"]`);
    $container
      .find("[data-tab-link]")
      .not($this)
      .removeClass("active");
    $this.addClass("active");
    $container
      .find(".active[data-tab]")
      .removeClass("active")
      .fadeOut("fast", () => {
        $target.fadeIn("fast").addClass("active");
      });

    // reset all tabbed embedded iframes on tab change
    $("[data-tab]:not(.active) iframe").each(function() {
      $(this).attr("src", $(this).attr("src"));
    });

    // pause all non-looping tabbed videos on tab change
    $("[data-tab]:not(.active) video:not([loop])").each(function() {
      this.pause();
    });
  }
}

$(document).on("click", "[data-tab-link]", tabs);
