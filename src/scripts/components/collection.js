import $ from "jquery";

const dataSets = {
  catOptionBtn: "cat-option",
  piColorValue: "pi-option-value",
  piOptionValue: "pi-option-value",
  piSizeValue: "pi-option-size",
  piMouthValue: "pi-option-mouth",
  subList: "cat-sub-list",
  subBtn: "cat-sub-button",
  currentFilter: "cat-current-item",
  currentType: "cat-current-type",
  colorStatus: "cat-color-value",
};

const selectors = {
  product: "[data-pi-item]",
  productCol: "[data-pi-item-col]",
  main: "[data-cat-button]",
  list: "[data-cat-list]",
  group: "[data-cat-group]",
  subBtn: `[data-${dataSets.subBtn}]`,
  subList: `[data-${dataSets.subList}]`,
  catOptionBtn: `[data-${dataSets.catOptionBtn}]`,
  currentParent: "[data-cat-current]",
  currentFilter: `[data-${dataSets.currentFilter}]`,
  currentType: `[data-${dataSets.currentType}]`,
  filterReset: "[data-cat-filter-reset]",
  colorStatus: `[data-${dataSets.colorStatus}]`,
};

const icons = {
  close:
    "<svg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'><g stroke='#00AEDB' stroke-width='2' fill='none' fill-rule='evenodd'><path d='M1.333 1.333L11 11M10.667 1.333L1 11'/></g></svg>",
};

const classNames = {
  active: "active",
};

const strings = {
  size: "Size",
  mouth: "Mouth",
  color: "Color",
  noFilter: "No filter",
  guard: "Guard",
};

const timers = {
  currentF: 250,
  product: 400,
  filterL: 250,
  filterDefault: 300,
  resetDefault: 300,
  buffer: 20,
};

function handleCatButtonClick(event) {
  event.preventDefault();

  const $source = $(event.currentTarget);
  const $parent = $source.closest(selectors.group);
  $source.toggleClass(classNames.active);
  $parent
    .find(selectors.list)
    .slideToggle(timers.filterL);

  $parent
    .find(selectors.subList)
    .slideUp(timers.filterL);

  $parent
    .find(selectors.subBtn)
    .removeClass(classNames.active);

  return null;
}

function handleCatSubButtonClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);
  const $parent = $source.closest(selectors.group);

  const type = $source.data(dataSets.subBtn);
  const $list = $parent.find(`[data-${dataSets.subList}="${type}"]`);

  $parent
    .find(selectors.subList)
    .not($list)
    .slideUp(timers.filterL);

  $parent
    .find(selectors.subBtn)
    .not($source)
    .removeClass(classNames.active);

  $source.toggleClass(classNames.active);
  $list.slideToggle(timers.filterL);
  return null;
}

function handleCatOptionClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);

  handleFilterChange($source);

  return filterLogic(timers.currentF + 50);
}

function handleFilterChange($source) {
  if (!$source || $source.length === 0) {
    return null;
  }

  const value = $source.data(dataSets.catOptionBtn);
  const $parent = $source.closest(selectors.subList);
  const type = $parent.data(dataSets.subList);

  $(selectors.colorStatus).data(dataSets.colorStatus, value);

  handleFilterCatButtonStatus($source);

  handleCurrentFilterBtn(value, type);

  if (type === strings.color) {
    handleProductColorSelect(value);
  }

  return null;
}

function handleProductColorSelect(value) {
  const $products = $(selectors.product);
  $products.each((index, product) => {
    if ($(product).closest(selectors.product).is(":visible")) {
      setTimeout(() => {
        $(product).find(`input[value="${value}"]`).click();
      }, 20);
    }
  });
}

let filterTimerHolder;
function filterLogic(timer) {
  clearTimeout(filterTimerHolder);
  filterTimerHolder = setTimeout(
    () => {
      let activeCount = 0;
      const $pItems = $(selectors.product);
      for (let i = 0; i < $pItems.length; i++) {
        const $pItem = $($pItems[i]);

        let hasColor = true;
        let hasMouth = true;
        let hasSize = true;
        let hasGuard = true;

        const mouthValue = getCurrentFilterValueByType(strings.mouth);
        const colorValue = getCurrentFilterValueByType(strings.color);
        const sizeValue = getCurrentFilterValueByType(strings.size);
        const guardValue = getCurrentFilterValueByType(strings.guard);
        const colorData = $(selectors.colorStatus).data(dataSets.colorStatus);

        hasSize = checkIfProductContainsOption($pItem, sizeValue);
        hasMouth = checkIfProductContainsOption($pItem, mouthValue);
        hasColor = checkIfProductContainsOption($pItem, colorValue);
        hasGuard = checkIfProductContainsOption($pItem, guardValue);

        if (hasColor && hasMouth && hasSize && hasGuard) {
          $pItem.closest(selectors.productCol).fadeIn(timers.product);
          handleProductColorSelect(colorData);
          activeCount++;
        } else {
          $pItem.closest(selectors.productCol).fadeOut(timers.product);
          handleProductColorSelect(colorData);
        }
      }

      handleActiveProductCount(activeCount);
      return checkIfActiveFilters(10);
    },
    timer ? timer : timers.filterDefault
  );
}

function getCurrentFilterValueByType(type) {
  const $currentParent = $(selectors.currentParent);
  const $currentSameType = $currentParent.find(
    `[data-${dataSets.currentType}="${type}"]`
  );

  if ($currentSameType.length === 0) {
    return strings.noFilter;
  }

  const value = $currentSameType.data(dataSets.currentFilter);
  return value;
}

function checkIfProductContainsOption($item, value) {
  if (value === strings.noFilter) {
    return true;
  }

  const $requiredOption = $item.find(
    `[data-${dataSets.piOptionValue}="${value}"]`
  );

  if ($requiredOption.length > 0) {
    return true;
  }

  return false;
}

function handleActiveProductCount(count) {
  if (count === 0) {
    // console.log("No prodcuts. Please adjust filters.");
  }

  return null;
}

function resetCurrentFilters() {
  const $currentParent = $(selectors.currentParent);
  $currentParent.children().fadeOut(timers.currentF, () => {
    $currentParent.children().remove();
    filterLogic(timers.buffer);
    resetFilterCatButtonStatus();
  });
}

function removeCurrentFilterOnClick(event) {
  const $source = $(event.currentTarget);
  $source.fadeOut(timers.currentF, () => {
    $source.remove();
    filterLogic(timers.buffer);
  });
}

function handleFilterCatButtonStatus($source) {
  const $parent = $source.closest(selectors.subList);
  $parent
    .children()
    .not($source)
    .removeClass(classNames.active);
  $source.addClass(classNames.active);
}

function resetFilterCatButtonStatus() {
  $(selectors.catOptionBtn).removeClass(classNames.active);
}

function handleCurrentFilterBtn(value, type) {
  const $currentParent = $(selectors.currentParent);
  const $currentSameType = $currentParent.find(
    `[data-${dataSets.currentType}="${type}"]`
  );

  const $newButton = $(getCurrentButtonPattern(value, type));
  $newButton.hide();
  $currentParent.append($newButton);

  if ($currentSameType.length > 0) {
    $currentSameType.fadeOut(timers.currentF, () => {
      $currentSameType.remove();
      $newButton.fadeIn(timers.currentF);
    });
  } else {
    $newButton.fadeIn(timers.currentF);
  }

  return null;
}

let resetCheckHolder;
function checkIfActiveFilters(time) {
  clearTimeout(resetCheckHolder);
  resetCheckHolder = setTimeout(
    () => {
      const $filters = $(selectors.currentFilter);
      const $reset = $(selectors.filterReset);
      const $filtersParent = $(selectors.currentParent);
      if ($filters.length > 0) {
        $reset.slideDown(timers.currentF);
        $filtersParent.addClass(classNames.active);
      } else {
        $reset.slideUp(timers.currentF);
        $filters.removeClass(classNames.active);
        $filtersParent.removeClass(classNames.active);
      }
    },
    time ? time : timers.resetDefault
  );
}

function getCurrentButtonPattern(value, type) {
  if (!value) {
    return "";
  }

  const icon = icons.close;
  const valueClean = value.replace("size-", "").replace("mouth-", "").replace("guard-", "");

  const pattern = `<button type="button" class="c-filter__current-filter" data-cat-current-item="${value}" data-cat-current-type="${type}">
    <span class="c-filter__current-title">${valueClean}</span>
    <span class="c-filter__current-icon">${icon}</span>
  </button>`;
  return pattern;
}

$(document).on("click", selectors.main, handleCatButtonClick);
$(document).on("click", selectors.subBtn, handleCatSubButtonClick);
$(document).on("click", selectors.catOptionBtn, handleCatOptionClick);
$(document).on("click", selectors.filterReset, resetCurrentFilters);
$(document).on("click", selectors.currentFilter, removeCurrentFilterOnClick);
