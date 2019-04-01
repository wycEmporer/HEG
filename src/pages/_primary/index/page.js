const cookieUtil = require('cp').cookieUtil;
require('lessDir/base.less');
require('./content.less');
require('./cityLaye/cityLayer.js');
import { ENGINE_METHOD_ALL } from 'constants';
import 'pagesDir/_component/hotelSearch/index';
require('./couponBanner/slider.css');
require('./loopbanner/index');
require('./couponBanner/kwiks');
var utils = require('utils');
import {getCamCouInfo} from 'pagesDir/_component/couponModal';

import {path, flightPath, offerPath} from 'utils';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;

if (utils.parseQueryStr().referer) {
  cookieUtil.setCookie('referer', utils.parseQueryStr().referer);
}
getCamCouInfo();
// get coupon Info
$(() =>{
  var src = window.location.pathname.split('/')[1];

  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  getaddOfferInfo();
  function getaddOfferInfo(){
    $.ajax({
      url: path.getPromotionInfo() + 'type=32&device=1',
      cache: true,
      dataType: 'json',
      type: 'GET',
    }).done(res => {
      if (res.success) {
        $('.discoverBox .ad .ad_img').attr('src', res.list[0].landingPageUrl);
      } 
    }).fail(res => {
     
    });
  }
  getCouponInfo();
  function getCouponInfo(){
    $.ajax({
      url: path.getCouponInfo(),
      type: 'post',
      data: JSON.stringify({
        'device':1, 
        'page':1, 
        'pageSize':100
      }),
      dataType: 'json',
      headers: {
        'x-Device': 'PC',
        'Content-Type':'application/json'
      },
    }).done(function (res) {
      if(res.success){
        let model = [];
        model = res.data;
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        var flightCou = [];
        var hotelCou = [];
        model.forEach(function(v, i){
          var endDate = new Date(v.endDate);
          v.couponValidity = Math.ceil((new Date(v.endDate) - new Date())/1000/60/60/24 + 1 );
          v.validTill = (endDate.getDate() - 0 + 100).toString().slice(1, 3) + ' ' + month[endDate.getMonth()] + ', ' + endDate.getFullYear();
          if(v.couponType == 1) {
            flightCou.push(v);
          } else {
            hotelCou.push(v);
          }
        });
        if(src == 'flight') {
          model = flightCou;
        } else if(src == 'hotels') {
          model = hotelCou;
        }
        var length = model.length;
        renderView($('#couponCard'), $('#couponCardTpl').html(), {'myModel': model });
        if( length < 2 ) {
          $('.left2').addClass('hidden');
          $('.right2').addClass('hidden');
          return false;
        } 
        var self = this,
        container = jQuery('.flexslider'),
        clone = container.clone( false );
      
        var slides = container.find('.slides');
        slides.kwicks({
          max : 400,
          spacing : 20,
          normWoH:350,
          length : length*2,
          calLength :3
        });
      }
    }).fail(function (err) {
      console.log(err);
    });
  }

    // 获取 热门城市
    // getHotDestion();
    // 获取博客
    // getInspiration();
  
    function getHotDestion(){
      $.ajax({
        url: flightPath.selectAll(),
        cache: true,
        dataType: 'json',
        type: 'GET',
      }).done(res => {
        if(res.success) {
          let model = res.data;
          if(model.length <= 6) {
            $('.showMoreBtn').addClass('hidden');
          }
          renderView($('#discoverCard'), $('#discoverCardTpl').html(), {'myModel': model });
        }
      }).fail(res => {
        
      });
    }
    function getInspiration(){
      $.ajax({
        url: offerPath.blogSelectAll(),
        cache: true,
        dataType: 'json',
        type: 'GET',
      }).done(res => {
        let model = res.data;
        if(res.success){
          renderView($('#blogCard'), $('#blogCardTpl').html(), {'myModel': model });
        }
        
      }).fail(res => {
        
      });
    }
  $(document).on('click', '.roundtrip', function(){
    $(this).parents('.flightType').siblings('.LS-trip').children('.section2').find('.seg').removeClass('hidden');
    $(this).parents('.flightType').siblings('.LS-trip').children('.section2').find('.r-date').removeClass('hidden');
  });
  $(document).on('click', '.oneway', function(){ 
    $(this).parents('.flightType').siblings('.LS-trip').children('.section2').find('.seg').addClass('hidden');
    $(this).parents('.flightType').siblings('.LS-trip').children('.section2').find('.r-date').addClass('hidden');
  });

  // 收集邮箱
  $(document).on('click', '#exclusiveEmail', function(){
    $(this).siblings('.checkError').addClass('hidden');
    let email  = $(this).siblings('input').val();
    if(email != '') {
      $.ajax({
        url: offerPath.exclusiveEmail() +'?email=' + email,
        cache: true,
        dataType: 'json',
        type: 'GET',
      }).done(res => {
        if(res.succ) {
          $('#saveEmailModal').modal('show');
          setTimeout(function(){
            $('#saveEmailModal').modal('hide');
          }, 3000);
        } else {
          $(this).siblings('.checkError').removeClass('hidden');
        }
      }).fail(res => {
        $(this).siblings('.checkError').removeClass('hidden');
      });
    } else {
      $(this).siblings('.checkError').removeClass('hidden');
    }
  });


  // 复制
  $(document).on('click', '.copyText', function(e){
    var val =$(this)[0];
    window.getSelection().selectAllChildren(val);
    document.execCommand('Copy' );
    const TipsMsg = $(this).parents('.copy').siblings('.TipsMsg')[0];
    $ (TipsMsg).fadeIn(500).delay(2000).fadeOut(1000);
    return false;
  });
});

//go top
$(() => {
  $('#backTop').click(function() {
    $('body, html').animate(
      {scrollTop: '0px'},
      400,
      'swing'
    );
  });
  $(window).scroll(function() {
    if ($(document).scrollTop() > 500) {
      $('#backTop').removeClass('hidden');
    } else {
      $('#backTop').addClass('hidden');
    }
  });
});


