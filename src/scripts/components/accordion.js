import $ from "jquery";

/* *
 * basic use:
 * <div data-accordion-parent=false>
 *   <div data-accordion-button=true>
 *     // title
 *   </div>
 *   <div data-accordion-content>
 *     // content
 *   </div>
 * </div>
 *
 * parent and button booleans are optional
 * whole parent div is optional
 */

const el = {
  button: "[data-accordion-button]",
  content: "[data-accordion-content]",
  parent: "[data-accordion-parent]"
};

function checkAccordionState() {
  $(el.button).each(function() {
    // on document init, if the button data is true, open the accordion
    // if anything else, close it
    const $this = $(this);
    if ($this.data("accordion-button") === true) {
      $this.addClass("open");
    } else {
      $this.removeClass("open");
      $this.siblings(el.content).hide();
    }
  });
}

function openAccordion(event) {
  event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  const $source = $(event.currentTarget);
  // if a parent is set, close neighbor accordions when opening a new one
  if (
    $(el.parent).length > 0 &&
    $(el.parent).data("accordion-parent") === true
  ) {
    $(el.parent)
      .find(el.button)
      .not($source)
      .removeClass("open");
    $(el.parent)
      .find(el.content)
      .not($source.siblings(el.content))
      .slideUp();
  }
  $source.siblings(el.content).slideToggle();
  $source.toggleClass("open");
}

$(document).on("click", el.button, openAccordion);

$(document).ready(checkAccordionState);
