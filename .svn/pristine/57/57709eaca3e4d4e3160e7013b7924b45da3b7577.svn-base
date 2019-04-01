require('./content.less');
import {getBannerInfo, TOP_UP} from 'pagesDir/_component/getBannerInfo/index';
const cookieUtil = require('cp').cookieUtil;
var utils = require('utils');
var paths = utils.path;
$(() =>{
  $('#topUp').click(function(){
    if(cookieUtil.getCookie('uuid') == null){
      $('[data-target=#login_modal]').click();
      return false;
    }
  });
  getBannerInfo(TOP_UP);

  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  $.ajax({
    url: paths.getIsSilverEnough_2(),
    type: 'GET',
    dataType: 'json',
  }).done(function (res) {
    if(res.success) {
      var model = res.data;
      renderView($('#tableBox'), $('#tableBoxTpl').html(), {'myModel': model });
      var arrAy = [
        parseFloat(model[0].message[0][1].split('%')[0]),
        parseFloat(model[0].message[1][1].split('%')[0]),
        parseFloat(model[1].message[0][1].split('%')[0]),
        parseFloat(model[1].message[1][1].split('%')[0])
      ];
      var getMax = Math.max.apply({}, arrAy);
      $('#maxSliver').text(getMax);
    }
  }).fail(function (err) {
    console.log(err);
  });
});