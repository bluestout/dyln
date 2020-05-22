//Check visitor IP Location Function

jQuery.ajax({
  url:
    "https://api.ipstack.com/check?access_key=c9ac55ecdf7513abc5581dd4c89b042b",
  dataType: "jsonp",
  success: function(location) {
    // If the visitor is browsing from US.
    if (location.country_code === "US") {
      $("#cart").addClass("loc-us");
      $("#cart li.location-us").addClass("offer-active");
      $("#promo .loca-us").addClass("offer-active");

      $("#promo-sub .sub-us").addClass("offer-active");

      $(".product-offer .bpro-us").addClass("p-active");
      $("#promo-product-wrap .bpro-us").addClass("p-active");
      $("#nproduct-color-var .rose-quartz").addClass("not-avilable");
      $("#nproduct-color-var .pearl-grey").addClass("not-avilable");
      $("#nproduct-color-var .dyln-blue").addClass("not-avilable");
      // select avilable bottle
      $(".product-insulated #nproduct-color-var li.black").click();
    } else if (location.country_code === "CA") {
      $("#cart").addClass("loc-ca");
      $("#cart li.location-ca").addClass("offer-active");
      $("#promo .loca-ca").addClass("offer-active");
      $("#promo-sub .sub-ca").addClass("offer-active");
      $(".product-offer .bpro-ca").addClass("p-active");
      $("#promo-product-wrap .bpro-ca").addClass("p-active");
      $("#nproduct-color-var .rose-quartz").addClass("not-avilable");
      $("#nproduct-color-var .pearl-grey").addClass("not-avilable");
    } else {
      $("#cart").addClass("loc-other");
      $("#cart li.location-other").addClass("offer-active");
      $("#promo .loca-other").addClass("offer-active");
      $("#promo-sub .sub-other").addClass("offer-active");
      $(".product-offer .bpro-other").addClass("p-active");
      $("#promo-product-wrap .bpro-other").addClass("p-active");
    }
    var country4px = [
      "AU",
      "AT",
      "BE",
      "BN",
      "BG",
      "KH",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HK",
      "HU",
      "IE",
      "IT",
      "JP",
      "LV",
      "LI",
      "LU",
      "MO",
      "MY",
      "MC",
      "NL",
      "NZ",
      "NO",
      "PH",
      "PL",
      "PT",
      "RO",
      "SG",
      "SK",
      "SI",
      "ES",
      "SE",
      "CH",
      "TW",
      "TH",
      "KR",
      "VN",
      "LA",
    ];
    if ($.inArray(location.country_code, country4px) != -1) {
      $("#nproduct-color-var .pearl-grey").addClass("not-avilable");
    } else {
      $("#nproduct-color-var .rose-quartz").addClass("not-avilable");
      $("#nproduct-color-var .pearl-grey").addClass("not-avilable");
      $("#nproduct-color-var .dyln-blue").addClass("not-avilable");
      // select avilable bottle
      $(".product-insulated #nproduct-color-var li.black").click();
    }
  },
});

// Check IP for display variant color
jQuery.ajax({
  url:
    "https://api.ipstack.com/check?access_key=c9ac55ecdf7513abc5581dd4c89b042b",
  dataType: "jsonp",
  success: function(location) {
    // If the visitor is browsing from US.
    //console.log("Country Code: "+location.country_code);
    var country4px = [
      "AU",
      "AT",
      "BE",
      "BN",
      "BG",
      "KH",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HK",
      "HU",
      "IE",
      "IT",
      "JP",
      "LV",
      "LI",
      "LU",
      "MO",
      "MY",
      "MC",
      "NL",
      "NZ",
      "NO",
      "PH",
      "PL",
      "PT",
      "RO",
      "SG",
      "SK",
      "SI",
      "ES",
      "SE",
      "CH",
      "TW",
      "TH",
      "KR",
      "VN",
      "LA",
    ];
    // product page
    var sUrl = window.location.href;
    var newBtl = false;
    if (
      sUrl.indexOf("dyln-insulated-alkaline-water-bottle-32-oz-wide-mouth") !=
      -1
    ) {
      newBtl = true;
    }
    if (location.country_code === "CA") {
      // FOR Canada
      // colors- finish
      console.log("WE are in Canada");
      $("#scr-pos.vr-finish").removeClass("cls-hidden");

      $("#product-box-wrap .vr-slave-color ul li").addClass("m-active");
      $("#product-box-wrap .vr-finish ul li").addClass("f-active");

      // Set default product

      // diffusers set
      if (newBtl) {
        var difAvla = "";
      } else {
        var difAvla = "";
      }

      $("#product-options-new li")
        .not(difAvla)
        .addClass("y-active");
      $("ul.pro-option li")
        .not(difAvla)
        .addClass("y-active");
    } else if (location.country_code === "GB") {
      console.log("WE are in UK");
      $("#scr-pos.vr-finish").removeClass("cls-hidden");

      $("#product-box-wrap .vr-slave-color ul li").addClass("m-active");
      $("#product-box-wrap .vr-finish ul li").addClass("f-active");

      // Set default product

      // diffusers set
      if (newBtl) {
        var difAvla = ".3diffusers,.9diffusers,.8diffusers";
      } else {
        var difAvla = ".3diffusers,.9diffusers,.8diffusers";
      }

      $("#product-options-new li")
        .not(difAvla)
        .addClass("y-active");
      $("ul.pro-option.dif li")
        .not(difAvla)
        .addClass("y-active");
    } else if ($.inArray(location.country_code, country4px) != -1) {
      console.log("WE are in 4PX");
      $("#scr-pos.vr-finish").removeClass("cls-hidden");

      $("#product-box-wrap .vr-slave-color ul li").addClass("m-active");
      $("#product-box-wrap .vr-finish ul li").addClass("f-active");

      // Set default product

      // diffusers set
      if (newBtl) {
        var difAvla = ".3diffusers,.9diffusers,.8diffusers";
      } else {
        var difAvla = ".3diffusers,.9diffusers,.8diffusers";
      }
      $("#product-options-new li")
        .not(difAvla)
        .addClass("y-active");
      $("ul.pro-option.dif li")
        .not(difAvla)
        .addClass("y-active");
    } else {
      console.log("WE are in Other");

      // Set default product

      var dfmP = "matte|9378529219|dyln-blue";

      var dfP = dfmP.split("|");
      //console.log(dfP[1]);
      // change url
      $(
        'a[href="/products/dyln-living-alkaline-stainless-steel-water-bottle"]'
      ).each(function() {
        var newhref = $(this).attr("href") + "?variant=" + dfP[1];
        $(this).attr("href", newhref);
      });

      var nvUri = sUrl.indexOf(dfP[1]);
      if (nvUri != -1) {
      } else {
        //console.log('custom defaultproduct: '+dfmP );
        $("#SingleOptionSelector-0").val(dfP[0]);
        $("#product-color-var li." + dfP[2]).click();
      }

      // diffusers set
      if (newBtl) {
        var difAvla = ".3diffusers,.9diffusers,.8diffusers";
      } else {
        var difAvla = ".3diffusers,.9diffusers,.8diffusers";
      }

      $("#product-options-new li")
        .not(difAvla)
        .addClass("y-active");
      $("ul.pro-option.dif li")
        .not(difAvla)
        .addClass("y-active");
    }
  },
});
