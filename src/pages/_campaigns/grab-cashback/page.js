require('./content.less');
require('cp');
import { cookieUtil, path } from 'utils';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
require('../../_component/flightSearch/index');

import { getBannerInfo, GRABCASHBACK } from 'pagesDir/_component/getBannerInfo/index';
$(() => {
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  $.noConflict();

  getBannerInfo(GRABCASHBACK);
  if(!isLogin){
    $('.login-box').removeClass('hidden');
  }
  $.ajax({
    url: path.countDiwaliActivity(),
    type: 'GET',
    dataType: 'json',
  }).then(result => {
    if(result.succ){
      const data= result.data;
      $('#allCount').text(data.allCount);
      $('#allAmount').text(data.allAmount);
      $('#AllUser').text(data.AllUser);
    }
  });
});
  // 菜单固定
  $(function() {
    //获取要定位元素距离浏览器顶部的距离
    //滚动条事件
    $(window).scroll(function() {
      //获取滚动条的滑动距离
      var scroH = $(this).scrollTop();
      //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
      if (scroH >= 60) {
        $('.add-search').css({
          position: 'fixed',
          top: '0',
          left: '0'
        });
      } else if (scroH < 60) {
        $('.add-search').css({ position: 'absolute' });
      }
    });
  });



