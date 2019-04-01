const utils = require('utils');
const paths = utils.path;
export function queryCountry(callback){
  $.ajax({
    url: paths.intlCountry(),
    type: 'GET',
    dataType: 'json'
  }).done(res => {
    if(res.success){
      sessionStorage.setItem('country', JSON.stringify(res.data));
      callback(res.data);
    }
  });
}

export function queryAreaCode(callback) {
  $.ajax({
    url: paths.areaCodeQuery(),
    type: 'GET',
    dataType: 'json',
  }).done(res => {
    if(res.success){
      sessionStorage.setItem('areaCode', JSON.stringify(res.list));
      callback(res.list);
    }
  });
}

export function addAreaCode( $select, data){
  // var $areaCode = $('#section2 .areaCode');
  var optionArr = [];
  data.forEach(function(val, key){
    if(val.regionCode == 91){
      var option = `<option value="${val.regionCode}" selected>${val.countryName  +' (+'+val.regionCode})</option>`;
    } else {
      var option = `<option value="${val.regionCode}">${val.countryName  +' (+'+val.regionCode})</option>`;
    }
    optionArr.push(option);
  });
  $select.html(optionArr.join(''));
}