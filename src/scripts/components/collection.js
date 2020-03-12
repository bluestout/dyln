import $ from "jquery";

const dataSets = {
  catOptionBtn: "cat-option",
  catOptionWrap: "cat-sub-wrap",
  piColorValue: "pi-option-value",
  piSizeValue: "pi-option-size",
  piMouthValue: "pi-option-mouth",
  subList: "cat-sub-list",
  subBtn: "cat-sub-button",
  currentFilter: "cat-current-item",
  currentType: "cat-current-type"
};

const selectors = {
  collection: "[data-collection]",
  product: "[data-pi-item]",
  productCol: "[data-pi-item-col]",
  main: "[data-cat-button]",
  list: "[data-cat-list]",
  subBtn: `[data-${dataSets.subBtn}]`,
  subList: `[data-${dataSets.subList}]`,
  catOptionBtn: `[data-${dataSets.catOptionBtn}]`,
  catOptionWrap: `[data-${dataSets.catOptionWrap}]`,
  currentParent: "[data-cat-current]",
  currentFilter: `[data-${dataSets.currentFilter}]`,
  currentType: `[data-${dataSets.currentType}]`,
  i: {
    close: "[data-icon-close-rendered]"
  },
  filterReset: "[data-cat-filter-reset]"
};

const classNames = {
  active: "active"
};

const strings = {
  size: "Size",
  mouth: "Mouth",
  color: "Color",
  noFilter: "No filter"
};

const timers = {
  currentF: 200,
  product: 600,
  filterL: 200,
  filterDefault: 250,
  resetDefault: 250
};

function handleCatButtonClick(event) {
  event.preventDefault();

  const $source = $(event.currentTarget);
  $source.toggleClass(classNames.active);
  $(document)
    .find(selectors.list)
    .slideToggle(timers.filterL);

  $(document)
    .find(selectors.subList)
    .slideUp(timers.filterL);

  $(document)
    .find(selectors.subBtn)
    .removeClass(classNames.active);

  return null;
}

function handleCatSubButtonClick(event) {
  event.preventDefault();
  const $source = $(event.currentTarget);

  const type = $source.data(dataSets.subBtn);
  const $list = $(document).find(`[data-${dataSets.subList}="${type}"]`);

  $(document)
    .find(selectors.subList)
    .not($list)
    .slideUp(timers.filterL);

  $(document)
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

  if (type === strings.color) {
    handleProductColorSelect(value);
  }

  return handleCurrentFilterBtn(value, type);
}

function handleProductColorSelect(value) {
  const $products = $(selectors.product);
  $products.find(`[data-${dataSets.piColorValue}="${value}"]`).click();
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

        const mouthValue = getCurrentFilterValueByType(strings.mouth);
        const colorValue = getCurrentFilterValueByType(strings.color);
        const sizeValue = getCurrentFilterValueByType(strings.size);

        hasSize = checkIfProductHasSize($pItem, sizeValue);
        hasMouth = checkIfProductHasMouth($pItem, mouthValue);
        hasColor = checkIfProductHasColor($pItem, colorValue);

        if (hasColor && hasMouth && hasSize) {
          $pItem.closest(selectors.productCol).slideDown(timers.product);
          activeCount++;
        } else {
          $pItem.closest(selectors.productCol).slideUp(timers.product);
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

function checkIfProductHasColor($item, value) {
  if (value === strings.noFilter) {
    return true;
  }

  const $requiredOption = $item.find(
    `[data-${dataSets.piColorValue}="${value}"]`
  );

  if ($requiredOption.length && $requiredOption.length > 0) {
    return true;
  }

  return false;
}

function checkIfProductHasSize($item, value) {
  if (value === strings.noFilter) {
    return true;
  }

  const $requiredOption = $item.find(
    `[data-${dataSets.piSizeValue}="${value}"]`
  );

  if ($requiredOption.length && $requiredOption.length > 0) {
    return true;
  }

  return false;
}

function checkIfProductHasMouth($item, value) {
  if (value === strings.noFilter) {
    return true;
  }

  const $requiredOption = $item.find(
    `[data-${dataSets.piMouthValue}="${value}"]`
  );

  if ($requiredOption.length && $requiredOption.length > 0) {
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
    filterLogic(20);
  });
}

function removeCurrentFilterOnClick(event) {
  const $source = $(event.currentTarget);
  $source.fadeOut(timers.currentF, () => {
    $source.remove();
    filterLogic(20);
  });
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
      if ($filters.length > 0) {
        $reset.slideDown(timers.currentF);
      } else {
        $reset.slideUp(timers.currentF);
      }
    },
    time ? time : timers.resetDefault
  );
}

function getCurrentButtonPattern(value, type) {
  if (!value) {
    return "";
  }

  const $closeIconElement = $(selectors.i.close);
  const icon = $closeIconElement.length > 0 ? $closeIconElement.html() : "";
  const valueClean = value.replace("size-", "").replace("mouth-", "");

  const pattern = `<button type="button" class="c-filter__current-filters" data-cat-current-item="${value}" data-cat-current-type="${type}">
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
