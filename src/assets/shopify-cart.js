/* Api Call
  ============================================================ */
var shopDomain = document.getElementById("shop_domain").value;
var appId = '', productId = '', accessToken = '';

switch (shopDomain) {
    case 'dyln-dev-store.myshopify.com':
        appId = '6';
        productId = '9466954689';
        accessToken = '3a62f3fd1dac5f343cbd1ad84c21cccd';
        break;
    default:
        appId = '6';
        productId = '3864576067';
        accessToken = 'faad12aaa52bd5489594eca9bc822fd2';
        break;
}

var shopClient = ShopifyBuy.buildClient({
    accessToken: accessToken,
    appId: appId,
    domain: shopDomain
});

/* Generate DOM elements for variant selectors
  ============================================================ */
function generateSelectors(product) {
    var elements = '';

    product.options.map(function(option) {
        elements +='<ul name="' + option.name + '" class="' + option.name + ' ext-variant-selectors select">';

        var count = 0;

        option.values.map(function(value) {
            count++;

            if(count == 1) {
              var active = 'v-active';
            } else {
              var active = '';
            }

            if (value.indexOf('Free') < 0) {
              elements += '<li value="' + value + '" class="'+ active +'">' + value + '</li>';
            }
        });

        elements += '</ul>';
    });

  return elements;
}


  function attachOnVariantSelectListeners(product) {
    $('.extvariant-selectors li').on('click', function(event) {
      var $element = $(event.target);
      $element.siblings('li').removeClass('v-active');
      $element.addClass('v-active');

      var name = $element.parents('.select').attr('name');
      var value = $element.attr('value');
      product.options.filter(function(option) {
        return option.name === name;
      })[0].selected = value;

      selectedVariant = product.selectedVariant;

      var selectedVariantImage = product.selectedVariantImage;
      var checkUrl = selectedVariant.checkoutUrl(1);
      updateProductTitle(product.title);
      updateVariantImage(selectedVariantImage);
      updateVariantTitle(selectedVariant);
      updateVariantPrice(selectedVariant);
      updatecompareAtPrice(selectedVariant);
      updateCheckUrl(checkUrl);

    });
  }



 /* Update product title
  ============================================================ */
  function updateProductTitle(title) {
    $('#ext-product .product-title').text(title);
  }

  /* Update product image based on selected variant
  ============================================================ */
  function updateVariantImage(image) {
    var src = (image) ? image.src : ShopifyBuy.NO_IMAGE_URI;

    $('#ext-product .variant-image').attr('src', src);
  }

  /* Update product variant title based on selected variant
  ============================================================ */
  function updateVariantTitle(variant) {
    $('#ext-product .variant-title').text(variant.title);
  }

  /* Update product variant price based on selected variant
  ============================================================ */
  function updateVariantPrice(variant) {
    $('#ext-product .variant-price').text('$' + variant.price);
  }

 /* Update product compareAtPrice price based on selected variant
  ============================================================ */
  function updatecompareAtPrice(variant) {
    if(variant.compareAtPrice){
    $('#ext-product .variant-compareAtPrice').text('$' + variant.compareAtPrice);

    }else{
    $('#ext-product .variant-compareAtPrice').addClass('none');
    }
  }

  /* Update product checkout url based on selected variant
  ============================================================ */
  function updateCheckUrl(checkUrl) {
    var src = checkUrl;

    $('#ext-product a.ck-url').attr('href', src);
  }


  /* Close popup / goto checkout page
  ============================================================ */

  $('#ext-product .ck-url').on('click', function() {
    $.post('/cart/add.js', {
      quantity: 1,
      id: selectedVariant.id,
    }).always(function (res) {
      var response = JSON.parse(res.responseText);

      if (res.status !== 200) {
        var error = response.description;
        document.querySelector('#ext-product .purchase-error').innerHTML = error;
      } else {
        location.reload();
      }
    });
  // var url = $(this).attr('href');
  // window.open( url, '_blank');
  });

  // Initialize Extra Diffuser Cart Modal
  /* Set Product ID
  ============================================================ */
  var selectedVariant;

  /* Fetch product and init
  ============================================================ */
  shopClient.fetchProduct(productId).then(function (fetchedProduct) {
    var product = fetchedProduct;

    selectedVariant = product.selectedVariant;

    var selectedVariantImage = product.selectedVariantImage;
    var currentOptions = product.options;
    var variantSelectors = generateSelectors(product);

    $('.extvariant-selectors').html(variantSelectors);
    var checkUrl = selectedVariant.checkoutUrl(1);

    updateProductTitle(product.title);
    updateVariantImage(selectedVariantImage);
    updateVariantTitle(selectedVariant);
    updateVariantPrice(selectedVariant);
    updatecompareAtPrice(selectedVariant);
    // updateCheckUrl(checkUrl);
    attachOnVariantSelectListeners(product);
  });
