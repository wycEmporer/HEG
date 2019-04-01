require('cp');
require('dataFormat');
require('lessDir/base.less');
require('./content.less');
require('./paging/pagination.less');
require('datepicker/datepicker.js');
require('./CancelOrder');
import renderView from './renderView';
import {dataLayer} from './dataLayer.js';
import {uploadImg, subImg, removeImg, getIdenOtp} from './uploadImg.js';
import pagination from './paging/am-pagination';
import {checkWithdrawal, profileCheckForm} from './checkForm.js';
import {emailReg, mobReg, pwdReg, nameReg} from 'formVerify';
import orderSendOtp from './orderSendOtp.js';
import {queryAreaCode, addAreaCode} from '../../_primary/booking/passengerSupport/index';
import { SetPayment, getPaymentChannel } from './payment/index';
import * as formReg from 'formVerify';
import * as Hotel from './hotel';
import { profile } from './profile';
import { myCoupon } from './myCoupon';
import {cancelController} from './htmlTemplate/cancelController';
import {changeFlightController} from './htmlTemplate/changeFlightController';
import {skyscanerTrack} from 'srcDir/common/platformTrack';

var utils = require('utils');
var paths = utils.path;

const IS_PROD = (process.env.NODE_ENV === 'production' && !IS_UAT) ? 'PROD' :'TEST';
var cookieUtil = utils.cookieUtil;
var accountPath = utils.accountPath;
var queryObj = utils.parseQueryStr();
let paramData = [];
let delegate = {
  payment:{
    isUseGold:false,
    useGold: null,
    goldBalance: null,
    payfor: null,
  },
  isLogin: cookieUtil.getCookie('uuid') == null ? false : true,
  refund:null
};

(function(w, $, _){
  function ViewModel(){
    this.init.apply(this, arguments);
  }
  ViewModel.prototype.init = function(){
    queryObj = utils.parseQueryStr();
    var tokenOnoff = /^token\/.+/.test(queryObj.src);
    if(!delegate.isLogin && !tokenOnoff){
      this.unLoginSearch();
      // return;
      // if user not sign in and has orderId,here return and go through line 624 , if here not return would be popup sign in window
      if(queryObj.orderId){
        if(queryObj.src == 'hotels'){
          $('.primaryNav dd').eq(1).addClass('active').siblings('dd').removeClass('active');
        }
        return;
      }
    }
    switch(queryObj.src){
      case 'trips':
        $('.primaryNav dd').eq(0).addClass('active').siblings('dd').removeClass('active');

        if(!delegate.isLogin){
          return;
        }
        this.tripsController();
      break;

      case /^token\/.+/.test(queryObj.src) && queryObj.src:
        $('.primaryNav dd').eq(0).addClass('active').siblings('dd').removeClass('active');
        
        let token = queryObj.src.split('/')[1];
        this.tripsListController();
      break;

      case /^h_token\/.+/.test(queryObj.src) && queryObj.src:
        $('.primaryNav dd').eq(1).addClass('active').siblings('dd').removeClass('active');
        
        let H_token = queryObj.src.split('/')[1];
        Hotel.hotelList(H_token);
      break;

      case /^trips\/.+/.test(queryObj.src) && queryObj.src:
        $('.primaryNav dd').eq(0).addClass('active').siblings('dd').removeClass('active');

        let tripId = queryObj.src.split('/')[1];
        
      this.tripDetailController(tripId);
      break;
      case /^cancel\/.+/.test(queryObj.src) && queryObj.src:
        $('.primaryNav dd').eq(0).addClass('active').siblings('dd').removeClass('active');

        this.cancelFlightController();
      break;
      case /^change\/.+/.test(queryObj.src) && queryObj.src:
        $('.primaryNav dd').eq(0).addClass('active').siblings('dd').removeClass('active');

        this.changeFlightController();
      break;
      case /^hotels(\/.+)?/.test(queryObj.src) && queryObj.src:
        $('.primaryNav dd').eq(1).addClass('active').siblings('dd').removeClass('active');
        let hotelId = queryObj.src.split('/')[1];
        
        if(!delegate.isLogin){
          if(hotelId){
            $('#login_modal').modal({
              show:true,
              remote:'/static/tpl/loginTpl.html',
            });
            return;
          }else{
            this.unLoginSearchHotel();
            return;
          }
        }
        hotelId ? Hotel.hotelDetail(hotelId) : Hotel.hotelList();
      break;
      case 'profile':
      $('.primaryNav dd').eq(2).addClass('active').siblings('dd').removeClass('active');
      if(cookieUtil.getCookie('uuid') == null){
        $('#login_modal').modal({ 
          show:true,
          remote:'/static/tpl/loginTpl.html',
        });
        return;
      }
      this.profileController();
      break;

      case /^wallet(\/[a-z]+)?/.test(queryObj.src) && queryObj.src:
        $('.primaryNav dd').eq(3).addClass('active').siblings('dd').removeClass('active');

        if(!delegate.isLogin){
          $('#login_modal').modal({
            show:true,
            remote:'/static/tpl/loginTpl.html',
          });
          return;
        }
        
        switch(queryObj.src.split('/')[1]){
          case 'withdraw':this.loadWithdrawal();
          break;
          case 'recharge': this.loadRecharge();
          break;
          default: this.walletController();
          break;
        }
      break;
      case 'myCoupon':
        $('.primaryNav dd').eq(4).addClass('active').siblings('dd').removeClass('active');
        if(!delegate.isLogin){
          $('#login_modal').modal({
            show:true,
            remote:'/static/tpl/loginTpl.html',
          });
          return;
        }
        this.myCouponController();
      break;
      
      case 'print':
        $('.primaryNav dd').eq(5).addClass('active').siblings('dd').removeClass('active');
        if(cookieUtil.getCookie('uuid') == null){
          $('#login_modal').modal({
            show:true,
            remote:'/static/tpl/loginTpl.html',
          });
          return;
        }
        this.printConttroller();
      break;

      case 'cancellation':
        $('.primaryNav dd').eq(6).addClass('active').siblings('dd').removeClass('active');
        if(cookieUtil.getCookie('uuid') == null){
          $('#login_modal').modal({
            show:true,
            remote:'/static/tpl/loginTpl.html',
          });
          return;
        }
        this.cancellationController();
      break;
     
      case 'security':
        $('.primaryNav dd').eq(7).addClass('active').siblings('dd').removeClass('active');
        if(cookieUtil.getCookie('uuid') == null){
          $('#login_modal').modal({
            show:true,
            remote:'/static/tpl/loginTpl.html',
          });
          return;
        }
        this.securityController();
        break;

      case 'security/identity':
        $('.primaryNav dd').eq(7).addClass('active').siblings('dd').removeClass('active');
        if(cookieUtil.getCookie('uuid') == null){
          $('#login_modal').modal({
            show:true,
            remote:'/static/tpl/loginTpl.html',
          });
          return;
        }
        this.identityController();
        break;
      default:
        if(cookieUtil.getCookie('uuid') == null){
          $('#login_modal').modal({
            show:true,
            remote:'/static/tpl/loginTpl.html',
          });
          return;
        }
        this.tripsController();
      break;
    }
  };
  ViewModel.prototype.unLoginSearch = function(){
    var html = $('#unLogin').html();
    renderView($('#rightside'), html, {model:{isLogin:delegate.isLogin}});
    if(!delegate.isLogin){
      var areaCodeData = JSON.parse(sessionStorage.getItem('areaCode') == 'undefined' ? null: sessionStorage.getItem('areaCode'));
      if(areaCodeData && areaCodeData.length != 0){
        addAreaCode( $('#areaCodeSele'), areaCodeData);
      } else {
        queryAreaCode(addAreaCode.bind(null, $('#areaCodeSele')));
      }
    }
  };
  ViewModel.prototype.unLoginSearchHotel = function(){
    var html = $('#unLogin').html();
    renderView($('#rightside'), html, {model:{isLogin:delegate.isLogin}});
    if(!delegate.isLogin){
      var areaCodeData = JSON.parse(sessionStorage.getItem('areaCode') == 'undefined' ? null: sessionStorage.getItem('areaCode'));
      if(areaCodeData && areaCodeData.length != 0){
        addAreaCode( $('#areaCodeSele'), areaCodeData);
      } else {
        queryAreaCode(addAreaCode.bind(null, $('#areaCodeSele')));
      }
    }
  };
  ViewModel.prototype.cancellationController = function(){
      var html = $('#printTpl').html();
      renderView($('#rightside'), html, {model:{isLogin:delegate.isLogin}});
  };
  ViewModel.prototype.printConttroller = function(){
      var html = $('#printTpl').html();
      renderView($('#rightside'), html, {model:{isLogin:delegate.isLogin}});
  };
  ViewModel.prototype.securityController = function(){
    var html = $('#securityTpl').html();
    $('#rightside').html(html);
  };
  ViewModel.prototype.tripsController = function(model, params){
    let id = utils.parseQueryStr().orderId;
    
    switch(id != undefined){
      case true:
      this.tripDetailController(id);
      break;
      default:
      this.tripsListController();
      break;
    }  
  };
  ViewModel.prototype.tripsListController = function(filterObj){
    var orderListRequestModel = {};
    var status1 = sessionStorage.getItem('orderTabRole');
    var emailOrPhone = delegate.isLogin ? '' : sessionStorage.getItem('emailOrPhone');
    var type = delegate.isLogin ? '' : sessionStorage.getItem('type');
    queryObj = utils.parseQueryStr();
    let token = queryObj.src.split('/')[1];
    var status = status1 == (null || undefined) ? 'To be paid' : status1;
    orderListRequestModel = {
      status:status,
      pageNum:1,
      pageSize:10,
      emailOrPhone:emailOrPhone,
      type:type
    }; 
    if(filterObj != undefined){
      Object.assign(orderListRequestModel, filterObj);
    }
    
    if(!delegate.isLogin){
      orderListRequestModel.token = token;
    }

    var viewElement = $('#rightside');
    viewElement.html($('#loadingTpl').html());
    var viewHtml = $('#tripsListTpl').html();
    $.ajax({
      url:accountPath.queryUserOrderNew(),
      type:'POST',
      data:JSON.stringify(orderListRequestModel),
      dataType: 'json',
      headers: {
        'x-Device': 'PC',
        'Content-Type':'application/json'
      },
      // dataType:'json',
    }).done(function(res){
      if(res.succ){
        var data = res.data;
        data.stateArr =[];
        data.pageNum = orderListRequestModel.pageNum;
        if(data.list.length != 0){
          // data = data.sort(function(a, b){
          //   return b.departDateTime - a.departDateTime;
          // });
          var monthArray = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
          var weekArray = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT']; 
          
          $.each(data.list, function(i, val){
            if(data.stateArr.indexOf(val.bookStatus) < 0){
              data.stateArr.push(val.bookStatus);
            }
            var date = new Date(val.departDateTimeString.replace(/T.*/, ''));
            val.month = monthArray[date.getMonth()];
            val.date = date.getDate();
            val.week = weekArray[date.getDay()];
          });
          if(status == 'To be paid'){
            sessionStorage.setItem('ToBePaidNum', data.totalSize);
          }
        }else{
          if(status == 'To be paid'){
            sessionStorage.setItem('ToBePaidNum', 0);
          }
          data.stateArr.push(status);
        }
        var ToBePaidNum = sessionStorage.getItem('ToBePaidNum');
        data.ToBePaidNum = ToBePaidNum;
        data.token = orderListRequestModel.token;
        data.isLogin = delegate.isLogin;
        renderView(viewElement, viewHtml, {model:data});  
        status = status =='To be paid' ? 'Tobepaid' : status;
        $('.tripsTitle ul li.' + status +'').addClass('active');
        paginationContral(data);
      }else {
        if(res.code == 1){
          alert('Token expired or does not exist.');
          location.replace(location.pathname + '?src=trips');
        }else if(res.code == 2){
          alert('Token error.');
          location.replace(location.pathname + '?src=trips');
        }
      } 
      
    }).fail(err =>{
      var apiHttpStatus= err.status;
      if(apiHttpStatus == 504){
        var data = {
          list :[],
          code:504
        };
        renderView(viewElement, viewHtml, {model:data}); 
      }
    });
  };

  function paginationContral(data){
    var pagersm = pagination('#paginationContral', {
      page: data.pageNum,
      totals: data.totalSize,
      pageSize: 10,
      theme: 'bootstrap',
      btnSize: 'sm'
    });
    jQuery('#paginationContral').on('am.pagination.change', function (e) {
        var pageNum = e.page;
        var filterObj = {pageNum:pageNum};
        ViewModel.prototype.tripsListController(filterObj);
    });
  }

  var payStatusTimer;
  function payStatus(e, id){
    // clearInterval(payStatusTimer);
    payStatusTimer = setInterval(function(){
      $.ajax({
        url: paths.isPay(id),
        type:'GET',
        dataType:'json',
        cache: false,
      }).done(function(res){
        if(res.success === 0){
          // setTimeout(function(){
          //   payStatus(e, id);
          // }, 2000);
        }else if(res.success == 1){
          clearInterval(payStatusTimer);
          ViewModel.prototype.tripDetailController(id, queryObj.phoneNo, true);
        }else if(res.success == 2 || res.success == 3){
          clearInterval(payStatusTimer);
          console.log('payment has error');
        }
      }).fail(function(){
        clearInterval(payStatusTimer);
        return;
      });
    }, 5000);
  }

  ViewModel.prototype.tripDetailController = function(id, phoneNo, oldFlag){
    var viewHtml = $('#f_detail_template').html();
    var viewElement = $('#rightside');
    clearInterval(payStatusTimer);
    $(document).off('update.pay');
    $(document).on('update.pay', payStatus);
    viewElement.html($('#loadingTpl').html());
    var token = utils.parseQueryStr().token;
    var emailOrPhone = sessionStorage.getItem('emailOrPhone');
    let getGoldDeferr = $.Deferred();
    let getTripDeferr = $.Deferred();

    if(cookieUtil.getCookie('uuid') !== null){
      $.getJSON(paths.getGoldUrl(), function(data){
        getGoldDeferr.resolve(data);
      });
    }else{
      getGoldDeferr.resolve(false);
    }
    phoneNo = phoneNo ? `phoneNo=${phoneNo}` : '';
    let url = oldFlag ? accountPath.tripDetailUrl(`orderId=${id}&${phoneNo}`) : `${accountPath.queryOrderDetailByTripIdNew()}?tripId=${id}&token=${token}&emailOrPhone=${emailOrPhone}`;
    $.ajax({
      url: url,
      type:'GET',
      contentType:'application/json',
      dataType:'json'
    }).done(function(result){
      if(result.code === 0){
        return getTripDeferr.resolve(result);
      }else if(result.code === 1){
        alert('Order(Trip) ID does not exist');
        
        return getTripDeferr.reject(result);
      }else if(result.code === 2){

        alert('Order(Trip) ID does not exist');
        return getTripDeferr.reject(result);
      }else if(result.code === 3){
        alert('Phone No does not exist');
        return getTripDeferr.reject(result);
      }else if(result.code === 5){
        alert(result.message);
        location.replace(location.pathname + '?src=trips');
        return getTripDeferr.reject(result);
      }else{
        return getTripDeferr.reject(result);
      }
    }).fail(err => {
      alert('Order(Trip) ID does not exist');
      return getTripDeferr.reject();
    });

    $.when(getGoldDeferr, getTripDeferr).then(function(data, result){
      tripDetailDate(data, result);
    }, function(err, res){
      location.replace(location.pathname + '?src=trips');
    });

    function tripDetailDate(data, result){
      var model = {
        payD:null,
        fee:null,
        triplist: null,
        goldVal: null,
        isLogin: false,
        hasUseGold:false,
        hasVerifiedOtp: result.data.order.hasVerifiedOtp,
        InsuranceDetails: result.data.flightInsuranceDtos,
        otpMob: null,
        status: result.data.order.status,
      };
      var payData = {};

      delegate.payment.hasVerifiedOtp = model.hasVerifiedOtp;
      if(data){
        delegate.payment.goldBalance = data.happyGoldBalance;
        model.goldBalance = data.happyGoldBalance;
        model.isLogin = true;
        model.otpMob = cookieUtil.getCookie('phone');
      }
      var Tstatus = {
        1:'Refunding',
        2:'Changing',
        3:'Refunding',
        4:'Changed',
        5: 'Refunded',
        105:'Upcoming',
        106:'Complete',
        107:'To be paid',
        108: 'Fail',
        109:'Fail'
      };
      var Ptype = {
        1: '(Adult)',
        2: '(Child)',
        3: '(Infant)'
      };
      if(result.data.triplist[0]['isPayable']){
        $(document).trigger('update.pay', [id]);
      }
      // skyscanerTrack
      result.data.order.platform == '2' && skyscanerTrack(result.data.order.orderid);

      if(result.data.order){
        let orderSum = result.data.order;
        var ofee = orderSum.fee;
        model.isIntl = orderSum.international;
        model.payfor = orderSum.payamount || 0;
        model.orderId = orderSum.orderid;
        delegate.payment.payfor = orderSum.payamount || 0;
        model.product = orderSum.product;
        delegate.payment.hasPhone = model.hasPhone = orderSum.hasPhone;
        model.fee = {
          'Base Fare': ofee.bf,
          'Taxes & Fees':ofee.gst,
          'Customer Prom.': ofee.dist,
          'Conv. Fee': ofee.cf,
          'Insurance': ofee.insp == null?0:ofee.insp,
          'Grand Total': ofee.gt,
        };
        model.payD = {
          Coupon: ofee.cn,
          HappySilver: ofee.hs,
          HappyGold: ofee.hg,
          PayPrice: ofee.pp,
        };
        if(ofee.hg < 0){
          model.hasUseGold = true;
        }
      }

      var triplist = result.data.triplist;

      var d = new Date(triplist[0].creatTime + 900000);
      var offset = d.getTimezoneOffset() * 60000;
      var IndiaTime = d.getTime() + offset + 3600000 * 5.5;
      triplist[0].exTime = new Date(IndiaTime).toString().replace(/(GMT|UTC).*/, '');

      $.each(triplist, function(i, data){
        data.r = data.refundable ? '' : 'Non-refundable';
        $.each(data.voyageinfo, function(key, value){
          value.ddate = $.formatStr(value.dt.replace(/\s.*/, ''));
          value.adate = $.formatStr(value.at.replace(/\s.*/, ''));
          value.dtime = value.dt.replace(/.*\s/, '');
          value.atime = value.at.replace(/.*\s/, '');
          value.dOrigin = value.dt;
          value.dt = $.formatStr(value.dt.replace(/\s.*/, ''));
        });
        // ticketsinfo ticketno and status insert travellerinfo make new travellersInfo
        data.travellersInfo = [];
        var averagePrice = (data.price / data.travellerinfo.length).toFixed(2);
        
        //isTicketNo use for judge print
        data.isTicketNo = false;
        data.isOperateable = false;
        $.each(data.ticketsinfo, function(key, value){
          $.each(data.travellerinfo, function(i, val){
            data.isTicketNo =  data.isTicketNo ||  !!value[i].ticketno;
            data.isOperateable = data.isOperateable || !!Number(val.status);
            val.ticketno = value[i].ticketno;
            val.Tstatus = Tstatus[value[i].status];
            val.price = averagePrice;
            val.Ptype = Ptype[val.passengerType];
          });
          data.travellersInfo.push($.extend(true, [], data.travellerinfo));
        });
        
        data.isChangeable = data.refundable && data.isOperateable && data.isTicketNo;
      });
      
      model.triplist = triplist;
      dataLayer(model);
      renderView(viewElement, viewHtml, {myModel: model});

      var voyageinfo = model.triplist[0].voyageinfo[0];
      var dtData= (new Date(voyageinfo.at) - new Date() )> 0 ? new Date(voyageinfo.at) : new Date();
      var year = dtData.getFullYear();
      var month = (dtData.getMonth() + 1) >= 10 ? dtData.getMonth() + 1 : '0' + (dtData.getMonth() + 1);
      var day = dtData.getDate();
      var att = year + '-' + month + '-' + day;
      var att2 = year + '-' + month + '-' + (day+1);
      var paramData2 = {
        name:voyageinfo.ac, 
        code:'565', 
        target_from:'heg_ticket',
        checkIn:att, 
        checkOut:att2, 
        guests:[{
          id:1, 
          adult:0, 
          child:0, 
          age:[]
        }], 
      };
      getHotelInfo(paramData2);
      
      queryDiwaliByOrderId(model.orderId);
      if(model.triplist[0].isPayable){
        var payData = {
          fee:{
            cf: model.fee['Conv. Fee'],
            totalDis: model.fee['Customer Prom.'],
            totalPrice: model.payfor - model.fee['Conv. Fee'],
          },
          hasUseGold: model.hasUseGold,
          exTime: triplist[0].exTime,
          happyGoldBalance:  model.goldBalance,
          isLogin: model.isLogin,
          orderId: model.orderId,
          isUseGold: false,
          goldInfo: {},
          useGold: null,
          useHappyGold: model.payD.HappyGold,
          isNewPay: true,
        };
        getPaymentChannel().then(res => {
          SetPayment.renderPayment(Object.assign(payData, {paymentChannel:res}));
        }).catch(err => {
          SetPayment.renderPayment(Object.assign(payData, {paymentChannel:[]}));
        });
        
      }
      sessionStorage.setItem('o_d', JSON.stringify(triplist));
      // use gold need otp
      // orderSendOtp('goldOtp', paths.orderSendOtp(), model.hasPhone);
      $('#cashbackNo').popover();
    }
    function getHotelInfo(paramData2){
      $.ajax({
        url: paths.getPromotionInfo() + 'type=20&device=1',
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

    function queryDiwaliByOrderId(orderId){
     
      var cha_timestamp = 0;
      $.ajax({
        url: paths.queryDiwaliByOrderId() + '?orderId=' +orderId,
        type: 'GET',
        dataType: 'json',
      }).done(res => {
        if(res.succ && res.data.status){
          var data = res.data;

          $('.returnPre').removeClass('hidden');
          cha_timestamp = (data.expiryDate - data.currentDate)/1000;
          GetRTime();
          
          $('#webShare').attr('href', 'https://web.whatsapp.com/send?text=' + data.message);
          var href = 'https://www.facebook.com/sharer.php?u='+encodeURIComponent(data.url);
          $('.facebook').attr('href', href);
          $('.copyText').text(data.url);
          $('.amount').text(data.amount);
          $('.number').text(data.number);
        }
      });
   
    
      var timeOut = null;
      function GetRTime() {
    
        var sy1_hour = parseInt(cha_timestamp / 3600);
        var sy2_hour = sy1_hour > 9 ? sy1_hour : '0' + sy1_hour;
    
        var sy_min = parseInt((cha_timestamp - sy1_hour * 3600) / 60);
        var sy2_min = sy_min > 9 ? sy_min : '0' + sy_min;
    
        var sy_miao = parseInt(cha_timestamp - sy1_hour * 3600 - sy_min * 60);
        var sy2_miao = sy_miao > 9 ? sy_miao : '0' + sy_miao;
    
        // $('#RemainD1_1').text(sy2_day);
        $('#RemainH1_1').text(sy2_hour);
        $('#RemainM1_1').text(sy2_min);
        $('#RemainS1_1').text(sy2_miao);
        cha_timestamp --;

        if (cha_timestamp <= 0) {
          clearTimeout(timeOut);
          $('.returnPre').addClass('hidden');
          return false;
        }
        timeOut = setTimeout(GetRTime, 1000);
      }
  
    }
  };

  ViewModel.prototype.walletController = function(){
    var viewElement = $('#rightside');
    viewElement.html($('#loadingTpl').html());
    var model = {};
    let count = 0;
    $.ajax({
      url:paths.getSilverUrl(),
      type:'GET',
      dataType:'json'
    }).done(function(data){
      model.silver = data;
      callback();
    });
    $.ajax({
      url:paths.getGoldUrl(),
      type:'GET',
      dataType:'json'
    }).done(function(data){
      model.gold = data;
      callback();
    });
    $.ajax({
      url:paths.getGoldForm(),
      type:'GET',
      dataType:'json'
    }).done(function(data){
      let type = {
        0: 'Top-up Gift',
        1: 'Top-up',
        2: 'Redeem',
        3: 'Transfer',
        4: 'Refund',
        5: 'Exchange',
        6: 'Cashback',
        7: 'Sys Top-up',
      };
      model.goldForm = data.list || [];
      // model.goldType = type;
      callback();
    });
    $.ajax({
      url:paths.getSilverForm(),
      type:'GET',
      dataType:'json'
    }).done(function(data){
      let type = {
        1: 'Reward',
        2: 'Redeem',
        3: 'Expired',
        4: 'Refund',
        5: 'Exchange',
        7: 'Sys Top-up',
        8: 'Referral',
        9: 'Refund',
        10: 'Redeem',
      };
      model.silverForm = data.list || [];
      // model.silverType = type;
      callback();
    });
    
    $.ajax({
      url:paths.getGoldRecord(),
      type:'GET',
      dataType:'json'
    }).done(function(data){
      model.goldRecordForm = data.data.record || [];
      model.goldRecordAmount = data.data.amount;
      callback();
    });
    $.getJSON(accountPath.withdrawConf()).done(res =>{
      model.maxCashAmount = res.data.maxCashAmount;
      callback();
    });
    function callback(){
      count ++ ;
      if(count == 6){
        var viewHtml = $('#walletTpl').html(); 
        renderView(viewElement, viewHtml, {myModel:model});
      }
    }
  };
  ViewModel.prototype.identityController = function(){
    let viewElement = $('#rightside');
    let model = {mobile: cookieUtil.getCookie('phone'), };
    renderView(viewElement, $('#perIdenTpl').html(), {model});
    uploadImg({
      index: 0,
      inputId:'frontInput',
      imgBox: 'frontBox'
    });
    uploadImg({
      index:1,
      inputId: 'backInput',
      imgBox: 'backBox',
    });
    subImg({
      url:accountPath.uploadImg(),
      btnId: 'subImg',
      originUrl: utils.parseQueryStr().res || ''
    });
    getIdenOtp({
      url:accountPath.identityOtp(),
      btnId: 'idenOtp'
    });
    window.removeImg = removeImg;
  };
  
  ViewModel.prototype.profileController = function(model){
    profile();
    
  };
  ViewModel.prototype.loadWithdrawal = function (){
    $.when($.ajax({
      url:accountPath.withdrawConf(),
      dataType: 'json',
      type: 'GET',
    }), $.ajax({
      url:paths.getGoldUrl(),
      type:'GET',
      dataType:'json'
    })).done(function(withdrawInfo, goldData){
      let info;
      if(withdrawInfo[0].success){
        info = withdrawInfo[0].data;
      }else{
        return;
      }
      let phoneUnit = cookieUtil.getCookie('phone');
      let phone = phoneUnit.split(' ')[1];
      let areaCode = phoneUnit.split(' ')[0];
      let model = {
        conf: {
          feePre: info.config.v1,
          minFee: info.config.v3,
          dayAvail: info.config.v4,
          monthAvail:info.config.v5,
          nowAvail: info.maxCashAmount,
          preTrans: info.config.v6,
        },
        goldData: goldData[0],
        phone,
        areaCode,
        phoneUnit,
      };
      renderView($('#rightside'), $('#withdrawalTpl').html(), {model});
      getIdenOtp({
        url:accountPath.withdrawOtp() + '?phone=' + phoneUnit,
        btnId: 'withdrawOtp'
      });
    });
  };

  ViewModel.prototype.loadRecharge = function(){
    let model = {email: cookieUtil.getCookie('email').replace(/\"/g, ''), };
    $.when($.getJSON(paths.getGoldUrl()), $.getJSON(paths.getTopupAmount())).done((res0, res1) => {
      model.balance = res0[0].happyGoldBalance;
      model.maxAmount = res1[0].data.maa;
      renderView($('#rightside'), $('#rechargeTpl').html(), model);
      loadMobCode();
    });
  };
  ViewModel.prototype.myCouponController = function(){
    myCoupon();
  };

  ViewModel.prototype.cancelFlightController = function(){
    history.pushState({page: 'cancel'}, null, location.href);
    cancelController();
    return false;
  };
  ViewModel.prototype.changeFlightController = function(){
    history.pushState({page: 'cancel'}, null, location.href);
    changeFlightController();
    return false;
  };
  function renderView(viewElement, viewHtml, model){
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  w['ViewModel'] = new ViewModel();
}(window, jQuery, underscore));

if (history.pushState) {
  window.addEventListener('popstate', function(){
    ViewModel.init();
  });
}

$(function(){
  $('.primaryNav dd').on('click', function(){
    switch($(this).index()){
      case 1:
      window.history.pushState({page:1}, null, location.pathname + '?src=trips');
      ViewModel.init();
      break;
      case 2:
      window.history.pushState({page:2}, null, location.pathname + '?src=hotels');
      ViewModel.init();
      break;
      case 3:
      window.history.pushState({page:3}, null, location.pathname + '?src=profile');
      ViewModel.init();
      break;
      case 4:
      window.history.pushState({page:4}, null, location.pathname + '?src=wallet');
      ViewModel.init();
      break;
      case 5:
      window.history.pushState({page:5}, null, location.pathname + '?src=myCoupon');
      ViewModel.init();
      break;
      case 6:
      window.history.pushState({page:6}, null, location.pathname + '?src=print');
      ViewModel.init();
      break;
      case 7:
      window.history.pushState({page:7}, null, location.pathname + '?src=cancellation');
      ViewModel.init();
      break;
      case 8:
      window.history.pushState({page:8}, null, location.pathname + '?src=security');
      ViewModel.init();
      break;
      default:
      window.history.pushState({page:1}, null, location.pathname + '?src=trips');
      ViewModel.init();
      break;
    }
  });

});

if(queryObj.orderId && cookieUtil.getCookie('uuid') == null){
  if(queryObj.src == 'hotels'){
    Hotel.hotelDetail(queryObj.orderId, queryObj.phoneNo, queryObj.email);
  }else{
    ViewModel.tripDetailController(queryObj.orderId, queryObj.phoneNo, true);
  }
}

// order detail
$(function(){
   // order list tab
   $('body').on('click', '#tripsTitle ul li', function(){
    var status = $(this).find('span').text();
    sessionStorage.setItem('orderTabRole', status);
    ViewModel.tripsListController();
    
  });

  $('body').on('click', '#tripsLogin ul li', function(){
    var form = $(this).data('form');
    $('.'+form).removeClass('hide').siblings('form').addClass('hide');
    $(this).addClass('active').siblings().removeClass('active');
  });
 


  // get unlogin top 
  $('body').on('click', '.getLoginOTP', function(){
    let style = $(this).data('index');
    let timer = null;
    let that = this;
    const businessType = utils.parseQueryStr().src;
    // this.disabled = true;
    if(style == 1 ){
      var phoneNo = $(this.form).find('[name=phoneNo]').val();
      let areaCode = this.form.areaCode && this.form.areaCode.value;

      let phoneOnOff_4 = true;
      if(areaCode == '91'){
        if(phoneNo.length < 10){
          phoneOnOff_4 = false;
        } else if(phoneNo.length > 10) {
          phoneOnOff_4 = false;
        }
      } else if(areaCode == '86'){
        if(phoneNo.length < 11){
          phoneOnOff_4 = false;
        } else if(phoneNo.length > 11) {
          phoneOnOff_4 = false;
        }
      }
      if(phoneNo == '' || !formReg.mobReg.test(phoneNo) || !phoneOnOff_4 ){
        this.disabled = false;
        alert('Please enter a valid phoneNo');
        return ;
      }
      
      phoneNo =  areaCode +' '+ phoneNo;
      var paramsData = '?emailOrPhone=' + phoneNo + '&type=1';
    } else if(style == 2){
      var emailNo = $(this.form).find('[name=email]').val();
      if(emailNo == '' || !formReg.emailReg.test(emailNo)){
        this.disabled = false;
        alert('Please enter a valid Email');
        return ;
      }
      var paramsData = '?emailOrPhone=' + emailNo + '&type=2';
    }
    this.disabled = true;
    $.ajax({
      url: (businessType == 'hotels' ?  '/api/web/orders/getOtpCode' : accountPath.getOrderOTP()) + paramsData,
      type:'get',
      headers:{'x-Device': 'PC'},
      dataType:'json'
    }).done(function(res){
      if(res.success){
        let times = res.lastSendTime;
        timer = setInterval(function(){
          times --;
          that.value = times + 's resend';
          if(times <= 0){
            that.disabled = false;
            that.value = 'OTP';
            clearInterval(timer);
            times = 60;
          }
        }, 1000);
      }else{
        that.disabled = false;
        alert('The request timed out, please try again11');
      }
    }).fail(function(){
        that.disabled = false;
        alert('The request timed out, please try again');
    });
  });
  $(document).on('click', '#hotelOrderQueryBtn', function(){
    var queryObj = utils.parseQueryStr();

    var id = $(this.form).find('[name=tripid]').val();
    var phoneNo = $(this.form).find('[name=phoneNo]').val();
    if(!phoneNo && !delegate.isLogin){
      alert('Phone No does not exist');
      return;
    }
    if(id == ''){
      alert('Please enter a valid trip ID');
      return;
    }
    let areaCode = this.form.areaCode && this.form.areaCode.value;
    phoneNo =  areaCode +' '+ phoneNo;
    if(queryObj.src == 'hotels'){
      window.location.href = location.pathname +'?src=hotels&orderId=' + id + '&phoneNo=' + phoneNo;
    }else{
      window.location.href = location.pathname +'?orderId=' + id + '&phoneNo=' + phoneNo;
    }
  });
  // unlogin order query
  $(document).on('click', '.orderQueryBtn', function(){
    let type = $(this).data('type');
    var phoneNo = null;
    var queryObj = utils.parseQueryStr();

    var id = $(this.form).find('[name=tripid]').val();
    let areaCode = this.form.areaCode && this.form.areaCode.value;
    var filterObj ={};
    if(id == ''){
      alert('Please enter a valid trip ID');
      return;
    }
    if(type == 1) {
      phoneNo = $(this.form).find('[name=phoneNo]').val();
      if(!phoneNo){
        alert('Phone No does not exist');
        return;
      }
      phoneNo =  areaCode +' '+ phoneNo;
    }else if(type == 2){
      phoneNo = $(this.form).find('[name=email]').val();
      if(!phoneNo){
        alert('Email No does not exist');
        return;
      }
    }
    var paramsData = '?emailOrPhone=' + phoneNo + '&otpCode=' + id +'&type=' + type;
    filterObj = {
      emailOrPhone:phoneNo,
      type:type
    };
    sessionStorage.setItem('emailOrPhone', phoneNo);
    sessionStorage.setItem('type', type);
    $.ajax({
      url:(queryObj.src == 'hotels') ? ('/api/web/orders/getOrderToken' + paramsData) : accountPath.getOrderToken() + paramsData,
      type:'get',
      headers:{'x-Device': 'PC'},
      dataType:'json'
    }).done(function(res){
      if(queryObj.src != 'hotels') {
        if(res.succ){
          var token = res.token;
          window.history.pushState({page:1}, null, location.pathname + '?src=token/' + token);
          //  gerOrderTripsList();
          ViewModel.tripsListController(filterObj);
        } else {
          alert(res.msg);
        }
      }else {
        if(res.code == 200){
          window.history.pushState({page:2}, null, location.pathname + '?src=h_token/' + res.token);
          Hotel.hotelList(res.token);
        } else {
          alert(res.msg);
        }
      }
    }).fail(function(){
      
    });
    // if(queryObj.src == 'hotels'){
    //   window.location.href = location.pathname +'?src=hotels&orderId=' + id + '&phoneNo=' + phoneNo;
    // }
    
  });


  // unlogin order query
  $(document).on('click', '#orderQueryBtn1', function(){

    var id = $(this.form).find('[name=tripid]').val();
    var phoneNo = $(this.form).find('[name=phoneNo]').val();
    if(!phoneNo && !delegate.isLogin){
      alert('Phone No does not exist');
      return;
    }
    if(id == ''){
      alert('Please enter a valid trip ID');
      return;
    }
    // ViewModel.tripDetailController(id);
    if(!delegate.isLogin){
      let areaCode = this.form.areaCode && this.form.areaCode.value;
      phoneNo =  areaCode +' '+ phoneNo;
    }
    window.location.href = location.pathname +'?orderId=' + id + '&phoneNo=' + phoneNo;
  });

  // $(document).on('click', '#rightside .order-item', function(){
  //   let query = this.href.split('?')[1];
  //   let id = query.split('/')[1];
  //   history.pushState({page: 'orderdetail'}, null, location.pathname + '?' + query);
  //   ViewModel.tripDetailController(id);
  //   return false;
  // });


  // cancel 
  $(document).on('click', '#rightside .f-cancel', function(){
    if(!$(this).data('isoperateable')){
      return false;
    }
    // let query = this.href.split('?')[1];
    let id = $(this).attr('index');
    history.pushState({page: 'cancel'}, null, location.href);
    cancelController(id);
    return false;
  });

  $(document).on('click', '#rightside .f-change', function(){
    if(!$(this).data('isoperateable')){
      return false;
    }
    let id = $(this).attr('index');
    // let query = this.href.split('?')[1];
    history.pushState({page: 'change'}, null, location.href);
    changeFlightController(id);
    return false;
  });
 

  // order filter
  $('body').on('click', '#orderFilterBtn', function(){
  
    var filterObj = {
      name: $('input[name="travellers"]', $(this.form)).val(),
      orderId:$('input[name="tripid"]', $(this.form)).val(),
      departure:$('input[name="depart"]', $(this.form)).val(),
      arrival:$('input[name="arrive"]', $(this.form)).val(),
    };
    ViewModel.tripsListController(filterObj);
  });

  $('body').on('click', '#emailTrip', function(){
    var tripid = $(this).attr('tripid');
    $.get(accountPath.emailItinerary(tripid), function(res){
      if(res.success){
        alert('Itinerary sent via email. Kindly check your inbox or spam folder.');
      }else{
        alert(res.msg);
      }
      
    });
  });
  
  $('body').on('click', '#cancelGiveup', function(){
    location.reload();
  });
  $('body').on('click', '.modelGiveUp', function(){
    var id = $(this).data('id');
    $('#'+id).modal('hide');
  });
  $('body').on('click', '#refundCheck', function(){
    if(!$(this).prop('checked')){
      $('#cancelApply').attr('disabled', 'disabled');
      $('#cancelApply').css('cursor', 'not-allowed');
    }else{
      $('#cancelApply').attr('disabled', false);
      $('#cancelApply').css('cursor', 'pointer');
    }
  });
});

// wallet
$(function(){

  function checkIden(callback, source){
    source = encodeURIComponent(source);
    $.getJSON(accountPath.checkIden()).done(res =>{
      if(true){
        callback();
        return false;
      }else{
        history.pushState({page:'identity'}, null, location.pathname + '?src=security/identity&res='+ source);
        ViewModel.identityController();
        return false;
      }
    });
    return false;
  }
  function withdrawCallback(e, res){
    let query = res.split('?')[1];
    e.preventDefault();
    history.pushState({page:'withdraw'}, null, location.pathname+ '?'+ query);
    ViewModel.loadWithdrawal();
  }
  $(document).on('click', '#rightside .Withdraw', function(e){
    let res = this.href;
    var withdrawCallbackDelegate = withdrawCallback.bind(null, e, res);
    return checkIden(withdrawCallbackDelegate, res);
  });
  function rechargeCallback(e, res){
    let query = res.split('?')[1];
    e.preventDefault();
    let model = {email: cookieUtil.getCookie('email').replace(/\"/g, ''), };
    history.pushState({page:'recharge'}, null, location.pathname + '?' + query);
    ViewModel.loadRecharge();
  }
  $(document).on('click', '#rightside .Recharge', function(e){
    let res = this.href;
    rechargeCallback.bind(null, e, res);
    // return checkIden(rechargeCallback, res);
    return  rechargeCallback();
  });

  $(document).on('keyup blur', '#withdrawAmount', function(){
    this.value = this.value.replace(/[^0-9]+/g, '');
    let amount = Number(this.value);
    let avail = Number(this.getAttribute('avail')) || 0;
    // let balance = Number(this.getAttribute('balance')) || 0;
    // let preTrans = Number(this.getAttribute('preTrans'));
    // amount = Math.min.apply(null, [amount, avail]);
    // this.value = amount;
    calWFee(this, amount, avail);
  });

  function calWFee(that, amount, avail){
    let calDoc = $('#calWFee');
    if(amount >= 100 && amount <= avail){
      let feePre = Number(that.getAttribute('feePre')) || 3;
      let minFee = Number(that.getAttribute('minFee')) || 30;

      let fee = Math.ceil(amount * feePre / 100);
      fee = Math.max(fee, minFee);
      let income = amount - fee;
      
      let html = `<p>Convinience Fee: Rs. 
              <span class="fee">${fee.toThree()}</span>
            </p>
            <p>Receiving Amount: Rs. 
              <span class="income">${income.toThree()}</span>
            </p>`;
      
      calDoc.html(html);
      calDoc.removeClass('hidden');
    }else if(amount > avail){
      let html = `<p>Available transferring amount for today:Rs. <span class="">${avail.toThree()}</span>. Check details at Amount limits per day.   
            </p>`;
      calDoc.html(html);
      calDoc.removeClass('hidden');
    } else {
      calDoc.addClass('hidden');
    }
  }
  
  $('#withdrawNote').on('show.bs.modal', function(){
    let calDoc = $('#calWFee');
    let fee = calDoc.find('.fee').text();
    let income = calDoc.find('.income').text();
    $(this).find('.modal-body .fee').text(fee);
    $(this).find('.modal-body .income').text(income);
  });
  $('#withdrawNote').on('hidden.bs.modal', function(){
    history.back();
  });
  $(document).on('click', '#subWithdraw', function(){
    var _this = this;
    if(checkWithdrawal(this.form)){
      $.ajax({
        url:accountPath.subWithdrawal(),
        type:'POST',
        dataType:'json',
        data: $(_this.form).serialize()
      }).done(function(result){
        if(result.success == true){
          $('#withdrawNote').modal('show');
        }else{
          alert(result.msg);
        }
      });
    }
  });

  $(document).on('click', '#subRecharge', function(){
    function checkform(form){
      let flag = true;
      $(form).find('.checkError').addClass('hidden');
      $(form).find('input').removeClass('inputError');

      if(form.amount.value == '' ){
        $(form.amount).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
        flag = false;
      }
      if(form.amount.value > $(form.amount).data('max')){
        $(form.amount).addClass('inputError');
        flag = false;
      }

      if(form.name.value == ''){
        $(form.name).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
        flag = false;
      }

      if(!emailReg.test(form.topUpEmail.value)){
        $(form.topUpEmail).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
        flag = false;
      }
      if(!mobReg.test(form.topUpMob.value)){
        $(form.topUpMob).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
        flag = false;
      }

      return flag;
    }
    if(checkform(this.form)){
      let _this = this;
      // let paramsData = {
      //   name: _this.form.name.value, 
      //   amount: _this.form.amount.value, 
      //   email: _this.form.topUpEmail.value,
      //   phone: _this.form.areaCodeSele_1.value + ' ' + _this.form.topUpMob.value
      // };
      let paramsData = `name=${_this.form.name.value}&amount=${_this.form.amount.value}&email=${_this.form.topUpEmail.value}&phone=${_this.form.areaCodeSele_1.value} ${_this.form.topUpMob.value}`;
      $(this).addClass('progress-dynamic');
      $.ajax({
        url:accountPath.rechargeWallet(),
        dataType: 'json',
        type:'GET',
        data:paramsData,
        headers: {'x-Device': 'PC'}
      }).done(result =>{
        if(result.success == true){
          $.getScript('https://www.cashfree.com/assets/cashfree.sdk.v1.1.js', function(){
            // $(_this).removeClass('progress-dynamic');
            (function(data) {
              var callback = function (event) { 
                var eventName = event.name; 
                switch(eventName) {
                  case 'PAYMENT_REQUEST':
                     console.log(event.message);
                     break;
                  default:
                    console.log(event.message);
                }
              };
              var config = {};
              config.layout = {
              view: 'popup', width: '650'
              };
              config.mode = IS_PROD; //use PROD when you go live
              var response = CashFree.init(config);
              if (response.status == 'OK') {
                CashFree.makePayment(data, callback);
              } else {
                //handle error
                 console.log(response.message);
              } 
            })(result.msg);
          });
        }else if(result.code === 1){
          $(_this.form.name).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
        }else if(result.code === 2){
          $(form.topUpEmail).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
        }else if(result.code === 3){
          $(_this.form.topUpMob).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
        }else if(result.code === 4){
          $(_this.form.amount).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
        }else{
          alert('Payment failed');
        }
        
      });
    }
  });
  $(document).on('blur', '#topupAmount', function(e){
    e.cancelBubble = true;
    e.stopPropagation();
    $('#extraAmount').addClass('hidden');
    $('#receiveAmount').text('Rs.0');
    this.value = this.value.replace(/[^0-9]+/g, '');
    let maxAmount = $(this).data('max');
    let topupAmount = this.value == ''? '' : parseInt(this.value);
    if(topupAmount === '') return false;

    if(topupAmount > maxAmount ){
      // this.value = 500000;
      $('#amountNo').removeClass('hidden').text('The maximum amount to recharge per transaction cannot exceed Rs. ' + maxAmount.toThree());
      this.value = maxAmount;
      getRechargeAmount(maxAmount);
    } else {
      $('#amountNo').addClass('hidden');
      getRechargeAmount(topupAmount);
    }
    // else{
    //   getRechargeAmount(topupAmount, false);
    //   $('#extraAmount').addClass('hidden');
    //   $('#amountNo').removeClass('hidden').text('If you recharge amount reaches Rs. 5000, you will get an extra Rs. 50 bonus. ');
    // }
   
  });
  function getRechargeAmount(value) {
    $.ajax({
      url:accountPath.getRechargeAmount() + '?amount=' + value,
      type:'GET',
      contentType:'application/json',
      dataType:'json'
    }).done(result => {
      if(result.succ){

        var amount = result.data.amount == null ? 0 : result.data.amount;
        $('#extraAmount').removeClass('hidden').text('rewarded extra Rs.' + amount);
        $('#receiveAmount').text('Rs.' + value + ' + ' + amount);
      }
    });
  }
});



// tripDetail
$(()=>{
   // copy code
   $(document).on('click', '#copylink', function() {
    var val = $(this).siblings('.copyText')[0];
    window.getSelection().selectAllChildren(val);
    document.execCommand('Copy');
    const TipsMsg = $(this).parents('ul').siblings('.TipsMsg')[0];
    $ (TipsMsg).fadeIn(500).delay(2000).fadeOut(1000);
  });
});
function loadMobCode() {
  var areaCodeData = JSON.parse(sessionStorage.getItem('areaCode') == 'undefined' ? null : sessionStorage.getItem('areaCode'));
  if (areaCodeData && areaCodeData.length != 0) {
    addAreaCode($('#areaCodeSele_1'), areaCodeData);
  } else {
    queryAreaCode(addAreaCode.bind(null, $('#areaCodeSele_1')));
  }
}

