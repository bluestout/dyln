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
  parentRsp: "accordion-parent-rsp",
  rspBreakpoint: "accordion-rsp-breakpoint"
};

const selectors = {
  button: "[data-accordion-button]",
  content: "[data-accordion-content]",
  parent: "[data-accordion-parent]",
  wrap: "[data-accordion-wrap]",
  buttonRsp: "[data-accordion-button-rsp]",
  contentRsp: "[data-accordion-content-rsp]",
  parentRsp: "[data-accordion-parent-rsp]",
  wrapRsp: "[data-accordion-wrap-rsp]",
  rspBreakpoint: "[data-accordion-rsp-breakpoint]",
  getContentById: (id) => `[data-${datasets.content}="${id}"]`,
  getContentByIdRsp: (id) => `[data-${datasets.contentRsp}="${id}"]`,
};

const classes = {
  open: "open",
};

const speed = 200;

function init() {
  checkAccordionState();
  checkAccordionStateRsp();
}

function checkAccordionState() {
  $(selectors.button).each(function() {
    const $source = $(this);
    const index = $source.data(datasets.button);
    const $parent = $source.closest(selectors.parent);
    const $wrap = $source.closest(selectors.wrap);

    if ($parent.length > 0) {
      const $content = $parent.find(selectors.getContentById(index));
      $source.removeClass(classes.open);
      $content.hide();
    }

    if ($wrap.length > 0) {
      $wrap.removeClass(classes.open);
    }

    if ($wrap.hasClass("is--open")) {
      $parent.find(selectors.getContentById(index)).show();
    }
  });
}

function checkAccordionStateRsp() {
  let breakpoint;

  if ($(selectors.rspBreakpoint).data(datasets.rspBreakpoint)) {
    breakpoint = $(selectors.rspBreakpoint).data(datasets.rspBreakpoint);
  } else {
    breakpoint = 992;
  }

  if ($(window).width() < breakpoint) {
    $(selectors.buttonRsp).each(function() {
      const $source = $(this);
      const index = $source.data(datasets.buttonRsp);
      const $parent = $source.closest(selectors.parentRsp);
      const $wrap = $source.closest(selectors.wrapRsp);
      if ($parent.length > 0) {
        const $content = $parent.find(selectors.getContentByIdRsp(index));
        $source.removeClass(classes.open);
        $content.hide();
      }
      if ($wrap.length > 0) {
        $wrap.removeClass(classes.open);
      }
    });
  }
}

function handleAccordionClick(event) {
  event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  const $source = $(event.currentTarget);
  const $parent = $source.closest(selectors.parent);
  const index = $source.data(datasets.button);
  const $content = $parent.find(selectors.getContentById(index));
  const $wrap = $source.closest(selectors.wrap);

  if ($parent.length <= 0 || $content.length <= 0) {
    return;
  }

  const closeOthers = $parent.data(datasets.parent) === true;

  // if a parent is set, close neighbor accordions when opening a new one
  if (closeOthers === true) {
    $(selectors.parent)
      .find(selectors.button)
      .not($source)
      .removeClass(classes.open);
    $(selectors.parent)
      .find(selectors.content)
      .not($content)
      .slideUp(speed);

    if ($wrap.length > 0) {
      $(selectors.parent)
        .find(selectors.wrap)
        .not($wrap)
        .removeClass(classes.open);
    }
  }
  $content.slideToggle(speed);
  $source.toggleClass(classes.open);
  if ($wrap.length > 0) {
    $wrap.toggleClass(classes.open);
  }
}

function handleAccordionClickRsp(event) {
  let breakpoint;

  if ($(selectors.rspBreakpoint).data(datasets.rspBreakpoint)) {
    breakpoint = $(selectors.rspBreakpoint).data(datasets.rspBreakpoint);
  } else {
    breakpoint = 992;
  }

  if ($(window).width() < breakpoint) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    const $source = $(event.currentTarget);

    const $parent = $source.closest(selectors.parentRsp);
    const index = $source.data(datasets.buttonRsp);
    const $content = $parent.find(selectors.getContentByIdRsp(index));
    const $wrap = $source.closest(selectors.wrapRsp);

    if ($parent.length <= 0 || $content.length <= 0) {
      return;
    }

    const closeOthers = $parent.data(datasets.parentRsp) === true;

    // if a parent is set, close neighbor accordions when opening a new one
    if (closeOthers === true) {
      $(selectors.parentRsp)
        .find(selectors.buttonRsp)
        .not($source)
        .removeClass(classes.open);
      $(selectors.parentRsp)
        .find(selectors.contentRsp)
        .not($content)
        .slideUp(speed);

      if ($wrap.length > 0) {
        $(selectors.parentRsp)
          .find(selectors.wrapRsp)
          .not($wrap)
          .removeClass(classes.open);
      }
    }
    $source.toggleClass(classes.open);
    $content.slideToggle(speed);
    if ($wrap.length > 0) {
      $wrap.toggleClass(classes.open);
    }
  }
}

$(document).on("click", selectors.button, handleAccordionClick);
$(document).on("click", selectors.buttonRsp, handleAccordionClickRsp);

$(document).ready(init);
