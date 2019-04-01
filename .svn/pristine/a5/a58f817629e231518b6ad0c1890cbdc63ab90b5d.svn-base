require('./content.less');
require('cp');
import { cookieUtil, path } from 'utils';

import { getBannerInfo, BLACKFRIDAYCYBER } from 'pagesDir/_component/getBannerInfo/index';
require('pagesDir/_component/flightAndhotel/index');

const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
$(() => {
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  $.noConflict();

  getBannerInfo(BLACKFRIDAYCYBER);


  $(document).on('click', '.copyText_1, .copyText', function(e) {
    e.stopPropagation();
    var val = $(this)[0];
    window.getSelection().selectAllChildren(val);
    document.execCommand('Copy');
    const TipsMsg = $(this)
      .siblings('.TipsMsg')[0];
      $ (TipsMsg).fadeIn(500).delay(2000).fadeOut(1000);
  });

  $(document).on('click', '.goSearch', function(e) {
    e.stopPropagation();
  });
});

// 活动倒计时
$(() => {
  function datetime_to_unix(date) {
    // var date = '2018-10-01 00:00:00';
    date = new Date(Date.parse(date.replace(/-/g, '/')));
    date = date.getTime();
    return parseInt(date / 1000);
  }
  function getGMTtime() {
    let d = new Date();
    let loaclTime = d.getTime();
    // console.log(loaclTime);
    let localOffset = d.getTimezoneOffset() * 60000;
    let utc = loaclTime + localOffset;
    let offset = 5.5;
    let bombay = utc + 3600000 * offset;
    // console.log(nd);
    return parseInt(bombay / 1000);
  }
  function GetRTime() {
    let cha_timestamp;
    let timestamp = getGMTtime();
    let timestamp_set0 = datetime_to_unix('2018-11-23 00:00:00');
    let timestamp_set2 = datetime_to_unix('2018-11-25 00:00:00');
    let timestamp_set3 = datetime_to_unix('2018-11-26 23:59:59');
    let cha_timestamp0 = timestamp_set0-timestamp;
    let cha_timestamp2 = timestamp_set2-timestamp;
    let cha_timestamp3 = timestamp_set3-timestamp;
    if(cha_timestamp0 <= 0){
      $('.Countdown .Countdown_time .in').removeClass('hidden');
      $('.Countdown .Countdown_time .end').addClass('hidden');
      if( cha_timestamp2 <= 0){
        // this.startOrEnd = 'end';
        $('.Countdown .Countdown_time .in').addClass('hidden');
        $('.Countdown .Countdown_time .end').removeClass('hidden').find('.status').text('Ends In');
        cha_timestamp = cha_timestamp3;
        if(cha_timestamp3 <= 0){
          cha_timestamp = 0;
          clearTimeout(timeOut);
          $('.Countdown .Countdown_time .in').removeClass('hidden').text('Campaign is closed.');
          $('.Countdown .Countdown_time .end').addClass('hidden');
        }
      }
    }else{
      $('.Countdown .Countdown_time .in').addClass('hidden');
      $('.Countdown .Countdown_time .end').removeClass('hidden').find('.status').text('Starts In');
      cha_timestamp = cha_timestamp0;
    }

    var sy_day = parseInt(cha_timestamp / (3600 * 24));
    var sy2_day = sy_day > 9 ? sy_day : '0' + sy_day;

    var sy1_hour = parseInt((cha_timestamp - sy_day * 24 * 3600) / 3600);
    var sy2_hour = sy1_hour > 9 ? sy1_hour : '0' + sy1_hour;

    var sy_hour = parseInt((cha_timestamp - sy_day * 3600 * 24) / 3600);

    var sy_min = parseInt((cha_timestamp - sy_hour * 3600 - sy_day * 24 * 3600) / 60);
    var sy2_min = sy_min > 9 ? sy_min : '0' + sy_min;

    var sy_miao = cha_timestamp - sy_day * 3600 * 24 - sy_hour * 3600 - sy_min * 60;
    var sy2_miao = sy_miao > 9 ? sy_miao : '0' + sy_miao;

    $('#RemainD1_1').text(sy2_day);
    $('#RemainH1_1').text(sy2_hour);
    $('#RemainM1_1').text(sy2_min);
    $('#RemainS1_1').text(sy2_miao);

    var timeOut = setTimeout(GetRTime, 1000);
    if (cha_timestamp <= 0) {
      // $('#Countdown_msg').text('Thank You All for being a Part of the HappyEasyGo Anniversary Sale');
      clearTimeout(timeOut);
    }
  }
  GetRTime();
});

function loacCarousel (){
  $('.vmcarousel-centered-infitine').vmcarousel({
    centered: true,
    start_item: 1,
    autoplay: true,
    infinite: true
  });
}

$(document).on('click', '.showTC', function(){
  var type = $(this).data('type');
  $('#noPrizeModal_'+ type).modal('show');
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
        $('.hotelSearchBar').css({
          position: 'fixed',
          top: '0',
          left: '0'
        });
      } else if (scroH < 60) {
        $('.hotelSearchBar').css({ position: 'absolute' });
      }
    });
  });
