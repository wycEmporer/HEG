require('./content.less');
require('cp');
import {cookieUtil, path} from 'utils';
require('./banner/jquery.zySlide.js');
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
require('../_common/cityLayer.js');
require('../../_component/flightSearch/index');
$(() =>{
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  $.noConflict();
  jQuery('.zy-Slide').zySlide({ speed: 500 })
  .css('border', '0px solid blue');




  // 菜单固定
  $(function(){
    //获取要定位元素距离浏览器顶部的距离
    //滚动条事件
    $(window).scroll(function(){
    //获取滚动条的滑动距离
      var scroH = $(this).scrollTop();
      //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
      if(scroH>=60){
          $('.add-search').css({
              'position':'fixed',
              'top':'0',
              'left':'0'
            });
      }else if(scroH<60){
          $('.add-search').css({'position':'relative'});
      }
    });
  });
 // copy code 
  $(document).on('click', '.copyIcon', function(){
    var val =$(this).siblings('.text')[0];
    window.getSelection().selectAllChildren(val);
    document.execCommand('Copy' );
    const TipsMsg = $(this).parents('.copyIconBox').siblings('.TipsMsg')[0];
    $ (TipsMsg).fadeIn(500).delay(2000).fadeOut(1000);
      });
});  


// 活动倒计时 
$(() => {
  
	function datetime_to_unix(){
    var date='2018-09-01 00:00:00';
    date = new Date(Date.parse(date.replace(/-/g, '/')));
    date = date.getTime();
   return parseInt(date/1000);
  }

  function getGMTtime(){
    let d = new Date();
    let loaclTime = d.getTime();
    // console.log(loaclTime);
   
    let localOffset = d.getTimezoneOffset() * 60000;
    
    let utc = loaclTime + localOffset;
  
    let offset = 5.5;
    let bombay = utc + (3600000*offset);
    
    // console.log(nd);
    return parseInt(bombay/1000);
  }

  function GetRTime(){
    
    var timestamp = getGMTtime();

    
    var timestamp_set = datetime_to_unix();

    
    var cha_timestamp = (timestamp_set-timestamp) > 0 ? (timestamp_set-timestamp) : 0;
    
    
    var sy_day = parseInt(cha_timestamp/(3600*24));
    
    
    var sy1_hour = parseInt(cha_timestamp/(3600));
    var sy2_hour = sy1_hour > 9 ? sy1_hour : '0' + sy1_hour;

    var sy_hour = parseInt((cha_timestamp-sy_day*3600*24)/3600);
   
    var sy_min = parseInt((cha_timestamp-sy_hour*3600-sy_day*24*3600)/60);
    var sy2_min = sy_min > 9 ? sy_min : '0' + sy_min;
    
    var sy_miao = cha_timestamp-sy_day*3600*24-sy_hour*3600-sy_min*60;
    var sy2_miao = sy_miao > 9 ? sy_miao : '0' + sy_miao;
    
    // $('#RemainD').text(sy_day);
    $('#RemainH1_1').text((sy2_hour+'').substr(0, 1));
    $('#RemainH2_1').text((sy2_hour+'').substr(1, 1));
    $('#RemainM1_1').text((sy2_min+'').substr(0, 1));
    $('#RemainM2_1').text((sy2_min+'').substr(1, 1));
    $('#RemainS1_1').text((sy2_miao+'').substr(0, 1));
    $('#RemainS2_1').text((sy2_miao+'').substr(1, 1));

    var timeOut = setTimeout(GetRTime, 1000);
    if(cha_timestamp == 0) {
      // $('#Countdown_msg').text('Thank You All for being a Part of the HappyEasyGo Anniversary Sale');
      clearTimeout(timeOut);
    }
  }
  GetRTime();
});