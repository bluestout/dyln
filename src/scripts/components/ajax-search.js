import $ from "jquery";

const el = {
  searchInput: "[data-blog-search-input]",
  results: "[data-blog-search-results]",
};

let currentAjaxRequest = null;
function handleSearchInput() {
  const term = $(this).val();
  const searchURL = `/search?type=article&q=*${term}*`;
  const $resultsList = $(el.results);
  if ($resultsList) {
    if (
      $resultsList.length > 0 &&
      term.length > 2 &&
      term !== $(this).attr("data-old-term")
    ) {
      $(this).attr("data-old-term", term);
      if (currentAjaxRequest !== null) {
        currentAjaxRequest.abort();
      }
      currentAjaxRequest = $.getJSON(`${searchURL}&view=json`, (data) => {
        $resultsList.empty();
        if (data.results_count === 0) {
          $resultsList.html(
            `<p class='ajax-search__note'>${
              theme.strings.no_results_for
              } "${term}".</p>`,
          );
        } else {
          let results = "";
          $.each(data.results, (index, item) => {
            const result = `
            <div class="ajax-search__item-wrap">
            <a href="${item.url}" class="ajax-search__item">
              <h4 class="ajax-search__item-link">${item.title}</h4>
            </a></div>`;
            results += result;
          });
          $resultsList.append(results);
          if (data.results_count > 5) {
            $resultsList.append(
              `<div class="ajax-search__more">
              <a class="ajax-search__more-link " href="${searchURL}">Show more</a>
            </div>`,
            );
          }
        }
      });
    }
  }
}

$(document).on("keyup change", el.searchInput, handleSearchInput);
