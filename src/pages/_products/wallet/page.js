require('./content.less');
require('cp');
import {cookieUtil, path} from 'utils';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
import {getBannerInfo, WALLET} from 'pagesDir/_component/getBannerInfo/index';

$(() =>{
  getBannerInfo(WALLET);
  
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  if(isLogin){
    $.when($.get(path.getGoldUrl()), $.get(path.getSilverUrl())).then((gold, silver) =>{
      let model = {
        gold: gold[0].happyGoldBalance,
        silver: silver[0].balance,
        total: gold[0].happyGoldBalance + silver[0].balance,
      };
      renderView($('#walletAmount'), $('#walletAmountTpl').html(), model);
    });
  }
});
$(() => {
  $('#prom-wrap').removeClass('hidden').find('.promotion-con').animate({left:'0', }, 500);

  $('#prom-wrap .closed').click(function(){
    $('#prom-wrap').css({display: 'none'});
  });
});