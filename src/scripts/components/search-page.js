import { getUrlParams } from "./helpers";
import { productImageHtml } from "./ajaxcart-html";

const selectors = {
  results: "[data-search-page-results]",
  searchOptions: "[data-search-options]",
  searchPage: "[data-search-override-defaults]"
};


let currentAjaxRequest = null;
function handleSearchInput() {
  const term = getUrlParams().q;
  let resources = "";
  try {
    resources = JSON.parse($(selectors.searchOptions).text());
  } catch (error) {
    resources = {
      "type": "product,page,article,collection"
    }
  }

  resources.limit = 99;
  const searchObject = {};
  searchObject["q"] = term;
  searchObject["resources"] = resources;
  const searchURL = "/search/suggest.json";
  const $resultsList = $(selectors.results);


  $resultsList.show();

  if ($resultsList.length > 0) {
    if (currentAjaxRequest !== null) {
      currentAjaxRequest.abort();
    }
    currentAjaxRequest = $.getJSON(searchURL, searchObject).done((data) => {
      let results = "";
      let products = "";
      let collections = "";
      let articles = "";
      let pages = "";

      if (data.resources.results.products.length > 0) {
        for (let i = 0; i < data.resources.results.products.length; i++) {
          products += productHtml(data.resources.results.products[i]);
        }
        results += `<h4 class="search-page__block-title">${theme.strings.search_products}</h4>`;
        results += `${products}`;
      }

      if (data.resources.results.products.length > 0) {
        for (let i = 0; i < data.resources.results.collections.length; i++) {
          collections += collectionHtml(data.resources.results.collections[i]);
        }
        results += `<h4 class="search-page__block-title">${theme.strings.search_collections}</h4>`;
        results += `${collections}`;
      }

      if (data.resources.results.articles.length > 0) {
        for (let i = 0; i < data.resources.results.articles.length; i++) {
          articles += articleHtml(data.resources.results.articles[i]);
        }
        results += `<h4 class="search-page__block-title">${theme.strings.search_articles}</h4>`;
        results += `${articles}`;
      }

      if (data.resources.results.pages.length > 0) {
        for (let i = 0; i < data.resources.results.pages.length; i++) {
          pages += pageHtml(data.resources.results.pages[i]);
        }
        results += `<h4 class="search-page__block-title">${theme.strings.search_pages}</h4>`;
        results += `${pages}`;
      }
      $resultsList.html(results);
    });
  }
}

function stripHtml(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function productHtml(product) {
  if (!product || product.length === 0) {
    return "";
  }
  let price = `<span class="visually-hidden">${theme.strings.regular_price}</span>${theme.currency.symbol}${product.price}`;
  if (product.compare_at_price_max > product.price_min) {
    price = `<s><span class="visually-hidden">${theme.strings.on_sale}</span>${theme.currency.symbol}${product.compare_at_price_max}</s>${price}`;
  }

  const inStock = product.available ? "" : `<span class="search-page__result-note">${theme.strings.sold_out}</span>`;
  const onSale = product.compare_at_price_max > product.price_min ? `<span class="search-page__result-note">${theme.strings.on_sale}</span>` : "";

  const template =
  `<div class="search-page__item"><a class="search-page__result-link" href="${product.url}" title="${stripHtml(product.title)}">
    <span class="row">
      <span class="col-lg-2 col-sm-3 col-4 align-self-center text-center">
        ${productImageHtml(product, "200x200")}
      </span>
      <span class="col-lg-7 col-sm-5 col-5 align-self-center">
        <h4 class="search-page__result-title">${stripHtml(product.title)}</h4>${onSale}${inStock}
      </span>
      <span class="col-lg-3 col-sm-4 col-3 align-self-center">
        <span class="search-page__result-price">${price}</span>
      </span>
    </span>
  </a></div>`;
  return template;
}

function collectionHtml(collection) {
  if (!collection || collection.length === 0) {
    return "";
  }

  const template =
  `<div class="search-page__item">
  <a class="search-page__result-link" href="${collection.url}" title="${stripHtml(collection.title)}">
    <h4 class="search-page__result-title">${stripHtml(collection.title)}</h4>
  </a>
  </div>`;
  return template;
}

function articleHtml(article) {
  if (!article || article.length === 0) {
    return "";
  }
  let image = "";
  let closeWrap = "";
  let openWrap = "";
  let tags = "";

  if (article.featured_image.url) {
    image = `<span class="col-lg-2 col-sm-3 col-6 align-self-center search-page__image-col">${productImageHtml(article, "200x200")}</span>`
    openWrap = `<span class="col-lg-10 col-sm-9 align-self-center">`;
    closeWrap = "</span>";
  } else {
    openWrap = `<span class="col-12 align-self-center">`;
    closeWrap = "</span>";
  }

  const date = new Date(article.published_at);
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
  const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date);
  if (article.tags.indexOf("faq") > -1 ) {
    tags = `<span class="search-page__result-tag">${article.tags[0]}</span>`;
  } else if (article.tags.length > 0) {
    tags = `<span class="search-page__result-tag">${article.tags[0]} &#8212; ${month} ${day} ${year}</span>`;
  }

  const template =
  `<div class="search-page__item">
  <a class="search-page__result-link" href="${article.url}" title="${stripHtml(article.title)}">
    <span class="row">
      ${image}
      ${openWrap}
        <h4 class="search-page__result-title">${stripHtml(article.title)}</h4>
        ${tags}
      ${closeWrap}
    </span>
  </a>
  </div>`;
  return template;
}

function pageHtml(page) {
  if (!page || page.length === 0) {
    return "";
  }
  const template =
  `<div class="search-page__item">
  <a class="search-page__result-link" href="${page.url}" title="${stripHtml(page.title)}">
    <h4 class="search-page__result-title">${stripHtml(page.title)}</h4>
  </a>
  </div>`;
  return template;
}

function init() {
  if ($(selectors.searchPage).length > 0 && $(selectors.results).length) {
    handleSearchInput();
  }
}

$(document).ready(init);
