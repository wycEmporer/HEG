require('cp');
require('lessDir/base.less');
require('./content.less');
import { emitEvent } from '../_GAADS/adGAEvent';
import {skyscanerTrack } from 'srcDir/common/platformTrack';
const utils = require('utils');
const cookieUtil = require('cp').cookieUtil;
const isLogin = cookieUtil.getCookie('uuid') !== null ? true : false;
const {
 path, accountPath 
} = utils;
const queryStr = utils.parseQueryStr();
$(() => {
  let timer = null;
  let timer2 = null;
  let timers = 0;
  let flag = false;
  let ele = $('#contentWap');
  let model = {
    orderId: queryStr.orderid || queryStr.orderId,
    phoneNo: queryStr.phoneNo
  };
  let payStatusFlag = 1;
  let paramData = [];
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  let html = $('#payStatusTpl').html();
  model.returnUrl = '/account/?orderId=' + model.orderId + '&phoneNo=' + model.phoneNo;
  // model.text = 'Oops! Apologies - Payment failed. Please click on the Order ID to try again:';
  var renderTemp = _.template(html);
  ele.html(renderTemp(model));
  getSliver();

  (function getPayStatus() {
    $.ajax({
      url: accountPath.tripDetailUrl('orderId=' + model.orderId + '&phoneNo=' + model.phoneNo),
      type: 'GET',
      dataType: 'json'
    })
      .then(res => {
        if (res.code == 0) {
          let status = res.data.triplist[0].payStatus;
          model.status = status;
          if (status == 1) {
            clearTimeout(timer);
            let html = $('#payStatusTpl').html();
            model.returnUrl = path.returnUrl(model.orderId, model.phoneNo);
            var renderTemp = _.template(html);
            ele.html(renderTemp(model));
            let tripList = res.data.triplist;
            let segments = 0;
            tripList.forEach(v => {
              v.ticketsinfo.forEach(val => {
                segments += val.length;
              });
            });

            getparamData();
            getCouponAD(model.orderId);
            emitEvent('paymentState', 'Flight_payment_paypage_fedsuccess');
            res.data.order.platform == '2' && skyscanerTrack(res.data.order.orderid);
            res.data.order.platform == '3' && ixigo(res.data.order.orderid, res.data.order.fee.gt, segments);
            res.data.order.platform == '5' && wego(res.data.order.orderid, res.data.order.fee.gt);

          } else if (status == 2) {
            clearTimeout(timer);
            let html = $('#payStatusTpl').html();
            model.returnUrl = path.returnUrl(model.orderId, model.phoneNo);
            // model.text = 'Payment in process. You can review your trip details by clicking on the Order ID:';
            var renderTemp = _.template(html);
            ele.html(renderTemp(model));
            getSliver();
            payStatusFlag = 2;
            emitEvent('paymentState', 'Flight_payment_paypage_fedfail');
          } else if (status == 0) {
            if (timers > 18) {
              clearTimeout(timer);
              emitEvent('paymentState', 'Flight_payment_paypage_timeout');
              return;
            }
            timer = setTimeout(function() {
              getPayStatus();
            }, 10000);
            timers++;
          }
        } else {
          alert('Order(Trip) ID does not exist');
        }
      })
      .fail(res => {
        let model = {
          showClose: true,
          title: 'Oops!',
          text: 'Order(Trip) ID does not exist.',
          btnTex: false
        };
        let $bookExpire = $('#bookExpire');
        let $bookExpireCon = $bookExpire.find('.modal-content');
        renderView($bookExpireCon, $bookExpireCon.html(), { model });
        $bookExpire.modal('show');
      });
  })();

  function ixigo(inputTransactionId, inputAmount, inputSegments) {
    let baseUrl = (process.env.NODE_ENV === 'production' && !IS_UAT) ? 'https://www.ixigo.com' : 'https://build1.ixigo.com';
    window.ixiTransactionTracker = function(tag) {
      function updateRedirect(tag, t, p, v, s) {
        let u = baseUrl + '/ixi-api/tracker/updateConversion/' + tag + '?transactionId=' + t + '&pnr=' + p + '&saleValue=' + v + '&segmentNights=' + s;
        return '<img style=\'top:-999999px;left:-999999px;position:absolute\' src=\'' + u + '\' />';
      }
      var html = updateRedirect(tag, inputTransactionId, '', inputAmount, inputSegments);
      var temp = document.createElement('div');
      temp.innerHTML = html;
      document.body.appendChild(temp);
    };

    let script = document.createElement('script');
    script.src = baseUrl + '/ixi-api/tracker/track1021';
    document.getElementsByTagName('head')[0].appendChild(script);
    return false;
  }

  function wego(inputTransactionId, inputAmount) {
    let baseUrl = (process.env.NODE_ENV === 'production' && !IS_UAT) ? 'https://secure.wego.com' : 'https://secure.wegostaging.com';
    
    function updateRedirect(t, v, c) {
      let u = baseUrl + '/analytics/v2/conversions/' + 
      '?conversion_id=c-wego-happyeasygo.com&comm_currency_code=INR&bv_currency_code=INR&transaction_id=' + t +
      '&total_booking_value=' + v + '&commission=' + (v*0.02)+'&click_id='+ c +'&status=pending';
      return '<img style=\'top:-999999px;left:-999999px;position:absolute\' src=\'' + u + '\' />';
    }
    var clickId = cookieUtil.getCookie['wego_click_id'];
    var html = updateRedirect(inputTransactionId, inputAmount, clickId);
    var temp = document.createElement('div');
    temp.innerHTML = html;
    document.body.appendChild(temp);
  }
  
  $(document).on('click', '#anniverBtn', function(){
    clearTimeout(timer2);
  });
  
  function getparamData () {
    $.ajax({
    url: accountPath.tripIdDetailUrl('tripId=' + model.orderId + '&phoneNo=' + model.phoneNo),
    type:'get',
    dataType:'json'
    }).done(function(res){
      var voyageinfo = res.data.triplist[0].voyageinfo[0];
      var dtData= new Date(voyageinfo.at);
      var year = dtData.getFullYear();
      var month = (dtData.getMonth() + 1) >= 10 ? dtData.getMonth() + 1 : '0' + (dtData.getMonth() + 1);
      var day = dtData.getDate();
      var att = year + '-' + month + '-' + day;
      var att2 = year + '-' + month + '-' + (day+1);
      var paramData2 = {
        name:voyageinfo.ac, 
        code:'', 
        checkIn:att, 
        checkOut:att2, 
        guests:[{
          id:1, 
          adult:1, 
          child:0, 
          age:[]
        }], 
      };
      getHotelInfo(paramData2);
    }).fail(err => {
      alert('Order(Trip) ID does not exist');
      return getTripDeferr.reject();
    });
  }
  function getHotelInfo(paramData2){
    $.ajax({
      url: path.getPromotionInfo() + 'type=20&device=1',
      cache: true,
      dataType: 'json',
      type: 'GET',
    }).done(res => {
      if (res.success) {
        var model =[];
        res.list.forEach(function(val, index){
          var paramData1 = {
            top_price:val.landingPageAlt,
            bottom_price:val.landingPageTitle,
          };
          paramData.push(paramData1);
          model.push({
            url:val.url,
            alt:val.alt,
            title:val.title,
            href:val.href
          });
        });
        paramData.forEach(function(val, index){
          Object.assign(val, paramData2);
          model.forEach(function(value, idx){
            if(index == idx){
              value.params = JSON.stringify(val);
            }
          });
        });
        renderView($('#hotelInfo'), $('#hotelInfoTpl').html(), {'myModel': model });
      }
    }).fail(res => {
      
    });
  }
  /**
   * 
   * 获取酒店coupon 并弹窗；
   * @param {订单id} orderId 
   */
  function getCouponAD(orderId){
    $.ajax({
      url: '/heg_api/coupon/getCouponByOrderId.do' + '?orderId=' + orderId,
      type: 'GET',
      dataType: 'json',
    }).done(res => {
      if(res.data) {
        let data = res.data;
        let $shareModal = $('#shareModal');
        $shareModal.find('.hotel-coupon span').text(data.alt);
        $shareModal.find('.couponImg:first').attr('src', data.url);
        $shareModal.find('.validity span').text(data.landingPageTitle);
        if(isLogin){
          $shareModal.find('.footNote.login').show();
        }else{
          $shareModal.find('.footNote.unlogin').show();
        }
        if(new Date('2019-02-01 00:00:00') - new Date() <= 0 && new Date() - new Date('2019-03-01 00:00:00') <= 0) {
          $shareModal.find('.modal-content').addClass('newPam');
        } 
        $('#shareModal').modal('show');
      } else{
        location.replace('/account/?orderId=' + model.orderId + '&phoneNo=' + model.phoneNo);
      }

      $('#shareModal').on('hidden.bs.modal', function (e) {
        setTimeout(function() {
            location.replace('/account/?orderId=' + model.orderId + '&phoneNo=' + model.phoneNo);
          }, 4000);
      });
    });
  }
   // copy code
   $(document).on('click', '.coupon-value', function() {
    var val = $(this).find('span')[0];
    window.getSelection().selectAllChildren(val);
    document.execCommand('Copy');
    $('.TipsMsg').fadeIn(500).delay(2000).fadeOut(1000);
  });
  $('.redeemBtn').on('click', function(){
    if(!isLogin){
      $('#login_modal').modal({
        show:true,
        remote:'/static/tpl/loginTpl.html'
      });
      $(document).on('click', '.login-btn', function(){
        $(this).data('url', 'https://www.happyeasygo.com/hotel');
      });
    }else{
      location.href='https://www.happyeasygo.com/hotel';
    }
  });
   // change website  phone
  // $.getJSON(path.getSiteInfo()).then((res) =>{
  //   if(res.code === 0){
  //     var phoneArr = res.webSiteInfo.websitePhone;  
  //     $('.grayDarker .phoneNo').html(phoneArr);
  //   }
  // });

   // get maxSliver
   function getSliver () {
    $.getJSON(path.getIsSilverEnough_2()).then((res) =>{
      if(res.success){
        var model = res.data;
        var arrAy = [
          parseFloat(model[0].message[0][1].split('%')[0]),
          parseFloat(model[0].message[1][1].split('%')[0]),
          parseFloat(model[1].message[0][1].split('%')[0]),
          parseFloat(model[1].message[1][1].split('%')[0])
        ];
        var getMax = Math.max.apply({}, arrAy);
        $('#maxSliver').text(getMax);
      }
    });
   }

   $(document).on('click', '#goDetail', function(){
      if(payStatusFlag == 1) {
        emitEvent('paymentState', 'Flight_payment_paypage_waitHGdetails');
      } else {
        emitEvent('paymentState', 'Flight_payment_paypage_failHGdetails');
      }
   });
   $(document).on('click', '#topUp', function(){
      if(payStatusFlag == 1) {
        emitEvent('paymentState', 'Flight_payment_paypage_waittopup');
      } else {
        emitEvent('paymentState', 'Flight_payment_paypage_failtopup');
      }
   });
});


