require('./content.less');
require('cp');
import {cookieUtil, path, offerPath} from 'utils';
import {getBannerInfo, SPRINGTRAVEL} from 'pagesDir/_component/getBannerInfo/index';
require('../../_component/flightSearch/index');
require('../../_component/hotelSearch/index');

const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
$(() =>{
  // getBannerInfo(SPRINGTRAVEL);
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  function timeTransform(data){
    var Data = new Date(data);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const Y = Data.getFullYear();
    const M = Data.getMonth();
    const D = Data.getDate() > 9 ? Data.getDate() : '0' + Data.getDate();
    const timeTill = month[M] + ' ' + D + ',' + Y;
    return timeTill;      
  }
  const couponCode = window.location.search; 
  var coupon_Type =couponCode.split('&')[2] == undefined ? '' : couponCode.split('&')[2].split('=')[1];
  var detailId =couponCode.split('&')[0].split('=')[1] -0;
  var type = couponCode.split('&')[1].split('=')[1];

  if(type == 2) {
    $.ajax({
      url: path.getCouponPromn() + couponCode,
      type: 'GET',
      dataType: 'json',
      // cache: true,
      // data:couponCode,
      headers: {'x-Device': 'PC'},
    }).done(res => {
      if(res.succ){
        const model = res.data[0];   
        const startTill = timeTransform(model.startDate);
        const endTill = timeTransform(model.endDate);
        model.validTill = startTill + ' - ' + endTill;
        model.suitablePlatform = model.suitablePlatform.split(','); 
        model.coupon_Type = coupon_Type;
        model.name = model.title;
        renderView($('#couponInfoList'), $('#couponInfoListTpl').html(), {model});
        if(model.couponType == 2){
          $('#hotelSearchBar').show();
        }else{
          $('#flightSearchBar').show();
        }
      }
    });
  } else {
    $.ajax({
      url: offerPath.sponsoredDetail(),
      type: 'POST',
      contentType: 'application/json',
      data:JSON.stringify({
        detailId,
        type:coupon_Type
      }),
    }).done(res => {
      if(res.code == 200){
        var model = res.data;
        
        const startTill = timeTransform(model.validityFrom);
        const endTill = timeTransform(model.validityTo);
        model.validTill = startTill + ' - ' + endTill;
        model.landingPageDescription = model.introduction;
        model.couponCode = model.code;
        model.coupon_Type = coupon_Type;
        if(coupon_Type == 1){
          model.suitablePlatform = model.device.split(',');
        } else {
          model.name = model.sponsoredName;
        }
        
        renderView($('#couponInfoList'), $('#couponInfoListTpl').html(), {model});
        if(model.couponType == 2){
          $('#hotelSearchBar').show();
        }else{
          $('#flightSearchBar').show();
        }
      }
    });
  }
   

  // copy Code
  $(document).on('click', '.couponCode', function(){
    var val =$(this)[0];
    window.getSelection().selectAllChildren(val);
    document.execCommand('Copy' );
    const TipsMsg = $(this).parents('p').siblings('.TipsMsg')[0];
    $ (TipsMsg).fadeIn(500).delay(2000).fadeOut(1000);
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
      $('.selector').css({
        position: 'fixed',
        top: '0',
        left: '0'
      });
    } else if (scroH < 60) {
      $('.selector').css({ position: 'absolute' });
    }
  });
});

