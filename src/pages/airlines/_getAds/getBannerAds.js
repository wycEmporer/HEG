const paths = require('utils').path;
export function getBannerInfo(addr){
  $.ajax({
    url: paths.getPromotionInfo() + 'type=13&device=1&addr=airline-page',
    type: 'GET',
    dataType: 'json',
  }).then(res => {
    if(res.success){
      loadInfo(res.list[0]);
    }
    
  });
}
function loadInfo(res){

  $('#banner').html(`<img src="${res.landingPageUrl == null?'':res.landingPageUrl}" alt="${res.landingPageAlt == null?'':res.landingPageAlt}" title="${res.landingPageTitle == null?'':res.landingPageTitle}" class="banImg">`);
  $('#banner').attr('href', res.alt);
}