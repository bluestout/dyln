import $ from "jquery";

/* *
 * basic use:
 * <div data-accordion-parent=false>
 *   <div data-accordion-wrap=index>
 *     <div data-accordion-button=index>
 *       // title
 *     </div>
 *     <div data-accordion-content=index>
 *       // content
 *     </div>
 *   </div>
 * </div>
 *
 * wrap is optional, parent, button and content are required
 */

const datasets = {
  button: "accordion-button",
  content: "accordion-content",
  parent: "accordion-parent",
  buttonRsp: "accordion-button-rsp",
  contentRsp: "accordion-content-rsp",
  parentRsp: "accordion-parent-rsp"
};

const el = {
  button: "[data-accordion-button]",
  content: "[data-accordion-content]",
  parent: "[data-accordion-parent]",
  wrap: "[data-accordion-wrap]",
  buttonRsp: "[data-accordion-button-rsp]",
  contentRsp: "[data-accordion-content-rsp]",
  parentRsp: "[data-accordion-parent-rsp]",
  wrapRsp: "[data-accordion-wrap-rsp]",
  getContentById: id => `[data-${datasets.content}="${id}"]`,
  getContentByIdRsp: id => `[data-${datasets.contentRsp}="${id}"]`
};

const classes = {
  open: "open"
};

function init() {
  checkAccordionState();
  checkAccordionStateRsp();
}

function checkAccordionState() {
  $(el.button).each(function() {
    const $source = $(this);
    const index = $source.data(datasets.button);
    const $parent = $source.closest(el.parent);
    const $wrap = $source.closest(el.wrap);
    if ($parent.length > 0) {
      const $content = $parent.find(el.getContentById(index));
      $source.removeClass(classes.open);
      $content.hide();
    }
    if ($wrap.length > 0) {
      $wrap.removeClass(classes.open);
    }
  });
}

function checkAccordionStateRsp() {
  $(el.buttonRsp).each(function() {
    const $source = $(this);
    const index = $source.data(datasets.buttonRsp);
    const $parent = $source.closest(el.parentRsp);
    const $wrap = $source.closest(el.wrapRsp);
    if ($parent.length > 0) {
      const $content = $parent.find(el.getContentByIdRsp(index));
      $source.removeClass(classes.open);
      $content.hide();
    }
    if ($wrap.length > 0) {
      $wrap.removeClass(classes.open);
    }
  });
}

function handleAccordionClick(event) {
  event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  const $source = $(event.currentTarget);
  const $parent = $source.closest(el.parent);
  const index = $source.data(datasets.button);
  const $content = $parent.find(el.getContentById(index));
  const $wrap = $source.closest(el.wrap);

  if ($parent.length <= 0 || $content.length <= 0) {
    return;
  }

  const closeOthers = $parent.data(datasets.parent) === true;

  // if a parent is set, close neighbor accordions when opening a new one
  if (closeOthers === true) {
    $(el.parent)
      .find(el.button)
      .not($source)
      .removeClass(classes.open);
    $(el.parent)
      .find(el.content)
      .not($content)
      .slideUp();

    if ($wrap.length > 0) {
      $(el.parent)
        .find(el.wrap)
        .not($wrap)
        .removeClass(classes.open);
    }
  }
  $content.slideToggle();
  $source.toggleClass(classes.open);
  if ($wrap.length > 0) {
    $wrap.toggleClass(classes.open);
  }
}

function handleAccordionClickRsp(event) {
  if ($(window).width() < 992) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    const $source = $(event.currentTarget);

    const $parent = $source.closest(el.parentRsp);
    const index = $source.data(datasets.buttonRsp);
    const $content = $parent.find(el.getContentByIdRsp(index));
    const $wrap = $source.closest(el.wrapRsp);

    if ($parent.length <= 0 || $content.length <= 0) {
      return;
    }

    const closeOthers = $parent.data(datasets.parentRsp) === true;

    // if a parent is set, close neighbor accordions when opening a new one
    if (closeOthers === true) {
      $(el.parentRsp)
        .find(el.buttonRsp)
        .not($source)
        .removeClass(classes.open);
      $(el.parentRsp)
        .find(el.contentRsp)
        .not($content)
        .slideUp();

      if ($wrap.length > 0) {
        $(el.parentRsp)
          .find(el.wrapRsp)
          .not($wrap)
          .removeClass(classes.open);
      }
    }
    $source.toggleClass(classes.open);
    $content.slideToggle();
    if ($wrap.length > 0) {
      $wrap.toggleClass(classes.open);
    }
  }
}

$(document).on("click", el.button, handleAccordionClick);
$(document).on("click", el.buttonRsp, handleAccordionClickRsp);

$(document).ready(init);
