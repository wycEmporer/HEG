require('./content.less');
require('cp');
import {cookieUtil, path} from 'utils';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
import {getBannerInfo, REFERRALACTIVITY} from 'pagesDir/_component/getBannerInfo/index';
$(() =>{
  getBannerInfo(REFERRALACTIVITY);
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  if(isLogin){
    $.ajax({
      url: path.getReferRankWeekCurrent(),
      type: 'GET',
      dataType: 'json',
    }).done(function (res) {
      if(res.succ){
        var model = res.data;
        model.isLogin = true;
        renderView($('#login_info'), $('#login_infoTpl').html(), {'myModel': model });
      }
    }).fail(function (err) {
      console.log(err);
    });
  }else{
    const model= {};
    model.isLogin = false;
    renderView($('#login_info'), $('#login_infoTpl').html(), {'myModel': model });
  }

  // Ranking 排行
  $.ajax({
    url: path.getReferRankWeekNow(),
    type: 'GET',
    dataType: 'json',
  }).done(function (res) {
    if(res.succ){
     var model = res.data;
      renderView($('#rankingList'), $('#rankingListTpl').html(), {'model': model });
    }
  }).fail(function (err) {
    console.log(err);
  });
}); 