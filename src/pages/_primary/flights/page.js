require('cp');
require('lessDir/base.less');
require('./result-con.less');
require('dataFormat');
require('./priceRange/range.css');
require('./priceRange/range.js');
require('./fareAlert/fareAlert.js');
import { handleForm, loadHistoy, storeForm } from 'componentsDir/cityLayer/minPricityLayer.js';
import './sticky';
import { flightModel, intlModel } from './models/index';
import { airlineDiscount } from './airlineDiscount.js';
import { newQueryStr } from './flightQuery.js';
import promotionBottom from './promoteBottom.js';
import { AddAd } from './advertisement/addFlightsAd.js';
import {Left_side, Search_result1, Search_result2} from '../_GAADS/adGAEvent';
import priceOptional, { randerSelectedFlight, bottomSelectedPrice } from './price/';
import * as popContent from './popContent';

const utils = require('utils');
const paths = utils.path;
const cookieUtil = utils.cookieUtil;
const delegate = {
  count: 0,
  couponObj: null,
  isCoupon: false,
  silverBalance: 0,
  isLogin: false,
  branch: {
    newData: null,
    oldData: null,
    idArr: [],
    type: 1,
    intlArr: null,
    isIntl: false,
    index:0
  },
  popLeft: null,
  onOff: true,
  popOnoff: false,
  visitNumOnoff: true,
  getSilverIsEnough : 0
};

if (cookieUtil.getCookie('uuid') !== null) {
  delegate.isLogin = true;
  // signinCtrl();
  $.ajax({
    url: paths.getSilverUrl(),
    type: 'GET',
    dataType: 'json'
  }).done(function(result) {
    if (!result || !result.success) {
      return;
    }
    var html = `<span style="color:#f65858">Rs. ${result.balance.toThree()}</span>`;
    $('#silverInfo')
      .html(html)
      .data('silver', result);
    delegate.silverBalance = result.balance;
  });
}



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
    if ($(document).scrollTop() > 200) {
      $('#backTop').removeClass('hidden');
    } else {
      $('#backTop').addClass('hidden');
    }
  });
});

var progressWidth = $('#progress_bar').width('50%');
var queryObj = null;
(function(w, $, _) {
  var totlePriceArray = [];

  function ViewController() {
    this.initialize.apply(this, arguments);
  }
  ViewController.prototype.initialize = function() {
    queryObj = newQueryStr();
    // init
    $('#no_result').css('display', 'none');
    $('#f_con_wrap .calendar-wrap').css('display', 'none');
    $('#city_route').html(`<li class="fontSz16" style="line-height:38px;padding-left:76px;">
      Click on cashback and  
      <strong class="colorDan fontSz24 fontB">get money</strong>
      in your Bank account from wallet for the booking
     </li>`);
    $('.sidebar .borC')
      .removeClass('opened')
      .addClass('closed');
    $('#f_content, #f_r_content').css('display', 'none');
    $('#progress_bar').width('50%');
    $('.progress').css('display', 'block');

    // verytime research and set single-slider input, and
    switch (queryObj.tripType) {
      case '0':
        loadFilterWrap(0);
        this.oneController();
        $('#filterBar').stick_in_parent({ parent: '#F_search_result' });
        promotionBottom(queryObj.tripType, delegate.isLogin);
        break;
      case '1':
        loadFilterWrap(1);
        this.roundController();
        $('#selected_wrap .disable').popover();
        break;
    }
  };

  function loadFilterWrap(type) {
    let priceModel = [
      {
        title: 'Onward Price Range',
        id: 'priceRange'
      }
    ];
    let stopsModel = [
      {
        title: 'Onward Stops',
        id: 'stopsFilter'
      }
    ];
    let timeModel = [
      {
        title: 'Departure Time',
        id: 'timeFilter'
      }
    ];
    let airlinesModel = [
      {
        title: 'Onward Airlines',
        id: 'airlinesFilter',
        showAllId: 'showAll'
      }
    ];
    if (type === 1) {
      priceModel.push({
        title: 'Return Price Range',
        id: 'r_priceRange'
      });
      stopsModel.push({
        title: 'Return Stops',
        id: 'r_stopsFilter'
      });
      timeModel.push({
        title: 'Return Time',
        id: 'r_timeFilter'
      });
      airlinesModel.push({
        title: 'Return Airlines',
        showAllId: 'r_showAll',
        id: 'r_airlinesFilter'
      });
    }
    let priceWrapTpl = $('#priceWrapTpl').html();
    let stopsWrapTpl = $('#stopsWrapTpl').html();
    let timeWrapTpl = $('#timeWrapTpl').html();
    let airlinesWrapTpl = $('#airlinesWrapTpl').html();
    renderView($('#priceWrap'), priceWrapTpl, {model: priceModel});
    renderView($('#stopsWrap'), stopsWrapTpl, {model: stopsModel});
    renderView($('#timeWrap'), timeWrapTpl, {model: timeModel});
    renderView($('#airlinesWrap'), airlinesWrapTpl, {model: airlinesModel});

  }

  ViewController.prototype.oneController = function() {
    var that = this;
    // var cacheData = isUsecaCheData();
    
    // if(cacheData != false){
    //   var data = renderOneWayList(cacheData.flightData);
    //   setTimeout(function(){
    //     renderOneWayController(data);
    //   }, 3);
    //   return false;
    // }
   
    $.ajax({
      url: paths.flightDataUrl(),
      type: 'GET',
      dataType: 'json',
      data: queryObj,
      headers: {'x-Device': 'PC'},
      cache: false
    })
    .then(
      function(data) {
    
        return renderOneWayList(data);
      },
      function(err) {
        let trackObj = {
          apiMethodName: 'SearchFlightsNew',
          apiRequestParamter: JSON.stringify(queryObj),
          apiHttpStatus: err.status,
          apiResponseStatus: null,
          elementId: '',
          flightWay: 1
        };
        window.hegTrackCallback(trackObj);
      }
    )
    .done(function(data) {
      cookieUtil.setCookie('flightsUrl', location.href);
      sessionStorage.setItem('token', data.token);
      storeForm(queryObj);
      renderOneWayController(data);
    })
    .fail(function(err) {
      if (delegate.count == 0) {
        delegate.count += 1;
        that.oneController();
      } else {
        $('.progress').css('display', 'none');
        $('#no_result').css('display', 'block');
        $('#no_result .notice').text(err);
        return;
      }
    });

    function renderOneWayList(data) {
      let trackObj = {
        apiMethodName: 'SearchFlightsNew',
        apiRequestParamter: JSON.stringify(queryObj),
        apiHttpStatus: 200,
        apiResponseStatus: data.success,
        elementId: '',
        flightWay: 1
      };
      window.hegTrackCallback(trackObj);
      if (data.success == false || !data) {
        return $.Deferred().reject(data.msg);
      } else if (data.IntlFlightArray && Object.keys(data.IntlFlightArray).length > 0) {
        data = intlModel(data);
        sessionStorage.setItem('flightToken', data.token);
        sessionStorage.setItem('earnTitle', JSON.stringify(data.x.earnTitle));
      } 
      else {
        data = flightModel(data);
        sessionStorage.setItem('flightToken', data.token);
        sessionStorage.setItem('earnTitle', JSON.stringify(data.x.earnTitle));
        if (Object.keys(data.departFlightArray).length === 0) {
          return $.Deferred().reject('after airline filter data is empty');
        }
      }
      return data;
    }
    
    function renderOneWayController(data){
      
      // initialize  filtercon
      filterGather.resetFilterCon();
      // $(document).trigger('delegate.one', data);
      that.flightDetailController = flightDetailController.bind(null, data);
      filterGather.filterFlight = filterGather.filterFlight.bind(filterGather, data);
      that.flightTitleController = flightTitleController.bind(null, data);
      that.bookTicket = bookTicket.bind(null, data);
      delegate.branch.newData = [data.departFlightArray, data.returnFlightArray];
      delegate.branch.oldData = [data.departFlightArray, data.returnFlightArray];
      delegate.branch.x = data.x;
      delegate.branch.isIntl = data.isIntl;
      // sidebarController must after bind data
      sidebarController(data, 0);
      // create calendar
      calendarController();
      $('#progress_bar').width('100%');
      setTimeout(function() {
        $('.progress').css('display', 'none');
        $('#f_content').css('display', 'block');
        // if (data.couponCode != '') {
        //   $('#promotionFilter .apply').click();
        // }
        $('.sidebar .borC')
          .removeClass('closed')
          .addClass('opened');
      }, 500);
    }

  };
  ViewController.prototype.roundController = function() {
    var that = this;
    $('#progress_bar').width('50%');
    $('.progress').css('display', 'block');
    // var cacheData = isUsecaCheData();

    // if(cacheData != false){
    //   var data = renderRoundList(cacheData.flightData);
    //   setTimeout(function(){
    //     renderRoundController(data);
    //   }, 3);
    //   return false;
    // }
    $.ajax({
      url: paths.flightDataUrl(),
      // url: '/mock/flightData.json',
      type: 'GET',
      dataType: 'json',
      data: queryObj,
      headers: {'x-Device': 'PC'},
      cache: false
    })
      .then(function(data) {
        return renderRoundList(data);
      }, function(err) {
        let trackObj = {
          apiMethodName: 'SearchFlightsNew',
          apiRequestParamter: JSON.stringify(queryObj),
          apiHttpStatus: err.status,
          apiResponseStatus: null,
          elementId: '',
          flightWay: 2
        };
        window.hegTrackCallback(trackObj);
      })
      .done(function(data) {
        cookieUtil.setCookie('flightsUrl', location.href);
        sessionStorage.setItem('token', data.token);
        storeForm(queryObj);
        renderRoundController(data);
      })
      .fail(function(err) {
        if (delegate.count == 0) {
          delegate.count += 1;
          that.roundController();
        } else {
          $('.progress').css('display', 'none');
          $('#no_result').css('display', 'block');
         $('#no_result .notice').text(err);
          return;
        }
      });

      function renderRoundList(data) {
        let trackObj = {
          apiMethodName: 'SearchFlightsNew',
          apiRequestParamter: JSON.stringify(queryObj),
          apiHttpStatus: 200,
          apiResponseStatus: data.success,
          elementId: '',
          flightWay: 2
        };
        window.hegTrackCallback(trackObj);

        if (data.success == false || !data) {
          return $.Deferred().reject(data.msg);
        } else if (data.IntlFlightArray && Object.keys(data.IntlFlightArray).length > 0) {
          data = intlModel(data);
        } else {
          data = flightModel(data);
          if (Object.keys(data.departFlightArray).length === 0 || Object.keys(data.returnFlightArray) === 0) {
            return $.Deferred().reject(data.msg);
          }
        }
        return data;
      }
      
      function renderRoundController(data){
        //initialize filtercon
        filterGather.resetFilterCon();

        that.flightTitleController = flightTitleController.bind(null, data);
        that.flightDetailController = flightDetailController.bind(null, data);

        filterGather.filterFlight = filterGather.filterFlight.bind(filterGather, data);

        that.bookTicket = bookTicket.bind(null, data);
        delegate.branch.newData = [data.departFlightArray, data.returnFlightArray];
        delegate.branch.oldData = [data.departFlightArray, data.returnFlightArray];
        delegate.branch.x = data.x;
        delegate.branch.isIntl = data.isIntl;
        if (data.intlType == 1) {
          delegate.branch.intlArr = data.IntlFlightArray;
          $('#priceWrap')
            .children('div')
            .last()
            .remove();
        }
        sidebarController(data, 1);
        $('#progress_bar').width('100%');
        setTimeout(function() {
          if (data.intlType == 1) {
            $('#f_content').css('display', 'block');
          } else {
            $('#f_r_content').css('display', 'block');
          }
          $('.progress').css('display', 'none');
          // if (data.couponCode != '') {
          //   $('#promotionFilter .apply').click();
          // }
          $('.sidebar .borC')
            .removeClass('closed')
            .addClass('opened');
        }, 500);
      }
  };

  function sidebarController(data, tripType) {
    priceController(data, tripType);
    otherController(data, tripType);
    referPro();
  }

  function referPro() {
    let model = {
      isLogin: delegate.isLogin,
      ga: Left_side
    };
    $.ajax({
      url: paths.getPromotionInfo() + 'type=14&device=1',
      type: 'GET',
      dataType: 'json',
      headers: {'x-Device': 'PC'}
    }).done(function(res) {
      model.url = res.list[0].href;
      model.loginImgUrl = res.list[0].url;
      model.unLoginImgUrl = res.list[0].landingPageUrl;
      
      let viewHtml = $('#referProTpl').html();
      renderView($('#referPro'), viewHtml, {model});

      // var fareAlertFalg = sessionStorage.getItem('fareAlert');
      // if(fareAlertFalg == false){
      //   clearTimeout(timeOut);
      // }else if(fareAlertFalg == null ){
      //   var timeOut =  setTimeout(function(){
      //     $('#getFareAlert').modal('show');
      //     sessionStorage.setItem('fareAlert', false);
      //     clearTimeout(timeOut);
      //   }, 5000);
      // }
    });
  }

  function priceController(data, tripType) {
    var modelArray = {priceRange: data.departFlightArray};
    if (tripType === 1 && data.intlType != 1) {
      modelArray.r_priceRange = data.returnFlightArray;
    }

    for (var key in modelArray) {
      if (data.intlType == 1) {
        var minItem = _.min(data.IntlFlightArray, function(value) {
          return value.fee.bfp + value.fee.gst;
        });
        var minP = Math.round((minItem.fee.bfp + minItem.fee.gst) / minItem.fee.pCount);
        var maxItem = _.max(data.IntlFlightArray, function(value) {
          return value.fee.bfp + value.fee.gst;
        });
        var maxP = Math.round((maxItem.fee.bfp + maxItem.fee.gst) / maxItem.fee.pCount);
      } else {
        var minItem = _.min(modelArray[key], function(value) {
          return Number(value.opr);
        });
        var minP = Math.round(minItem.opr / minItem.fee.pCount);
        var maxItem = _.max(modelArray[key], function(value) {
          return Number(value.opr);
        });
        var maxP = Math.round(maxItem.opr / maxItem.fee.pCount);
      }
      //price_range
      let tripType = key;
      $('#' + key + ' .single-slider').val('');
      $('#' + key + ' .single-slider').pRange({
        from: minP,
        to: maxP,
        step: 200,
        format: function(val, type) {
          return '<i class="fa fa-inr"></i>&nbsp;' + val.toThree();
        },
        width: 218,
        showlabels: true,
        // initialization according to set input price ,render flight list;
        onstatechange: function(value) {
          var that = this;
          filterGather.priceFilter(that, value, tripType);
        }
      });
    }
  }

  function otherController(originData, tripType) {
    const timeSwitch = {
      0: 'Before 6am',
      1: '6am-12pm',
      2: '12pm-6pm',
      3: 'After 6pm'
    };
    // coupon
    // $('#couponCode').val(originData.couponCode);

    //stops and depart and airlines
    // var data = $.extend({}, originData.departFlightArray, originData.returnFlightArray);
    let data = [originData.departFlightArray];
    if (tripType === 1) data.push(originData.returnFlightArray);

    var stopsArray = [0, 1, 2];

    let stopIdArr = ['stopsFilter', 'r_stopsFilter'];
    let timeIdArr = ['timeFilter', 'r_timeFilter'];
    let airlinesIdArr = ['airlinesFilter', 'r_airlinesFilter'];
    for (var dataIdx = 0; dataIdx < data.length; dataIdx++) {
      var stopModel = {};
      $.each(stopsArray, function(i, val) {
        if (val <= 1) {
          var items = _.filter(data[dataIdx], function(value) {
            return value.sb == val;
          });
          if (items.length > 0) {
            var min = _.min(items, function(value) {
              return value.opr;
            });
            var minPrice = Math.round(min.opr / min.fee.pCount);
            //stopModel: {0:123,1:123124};
            stopModel[val] = minPrice;
          }
        } else {
          // more than two stops
          var items = _.filter(data[dataIdx], function(value) {
            return value.sb > 1;
          });
          if (items.length > 0) {
            var min = _.min(items, function(value) {
              return value.opr;
            });

            var minPrice = Math.round(min.opr / min.fee.pCount);
            stopModel[val] = minPrice;
          }
        }
      });
      renderView($('#' + stopIdArr[dataIdx]), $('#stopsTpl').html(), {model: stopModel});

      //depart time
      //create dapartTime array like [0 ,1]
      var departModel = {};
      var departArray = [];
      $.each(data[dataIdx], function(index, value) {
        var timeNum = Math.floor(new Date(value.dt).getHours() / 6);
        if (departArray.indexOf(timeNum) < 0) {
          departArray.push(timeNum);
        }
      });

      $.each(
        departArray.sort(function(a, b) {
          return a - b;
        }),
        function(index, value) {
          var items = _.filter(data[dataIdx], function(val) {
            var timeNum = Math.floor(new Date(val.dt).getHours() / 6);
            return timeNum == value;
          });
          var minItem = _.min(items, function(value) {
            return value.opr;
          });
          var minPrice = Math.round(minItem.opr / minItem.fee.pCount);
          departModel[value] = {
            title: timeSwitch[value],
            minPr: minPrice
          };
        }
      );
      renderView($('#' + timeIdArr[dataIdx]), $('#departTimeTpl').html(), {model: departModel});

      // airlines
      var airlinesModel = {};
      var airlineArray = [];
      $.each(originData.airlineNames, function(key, value) {
        var items = _.filter(data[dataIdx], function(val) {
          return val.al == key;
        });
        if (items.length == 0) {
          return true;
        }
        var minItem = _.min(items, function(value) {
          return value.opr;
        });
        var minPrice = Math.round(minItem.opr / minItem.fee.pCount);
        airlinesModel[key] = {
          airlineName: value,
          minPr: minPrice
        };
      });

      renderView($('#' + airlinesIdArr[dataIdx]), $('#airlineTpl').html(), {model: airlinesModel});
    }
  }

  function calendarController() {
  
    var searchDate = new Date(queryObj.departDate.replace(/-/g, '/'));
    var lowPriceArr = [];
    var data = {
      from:queryObj.from,
      to:queryObj.to
    };
    $.ajax({
      url: paths.getLowPriceCalendar(),
      type: 'post',
      data: JSON.stringify(data),
      dataType: 'json',
      headers: {'Content-Type':'application/json'},
    })
    .done(res => {
      if(res.success){
        var data = res.data;
        var minPrice = [];
        for (const key in data) {
          var priObj = {};
          var minDate='';
          var minPri = 999999;
          var priArr = [];
          for (const value in data[key] ) {
            var obj = {};
            var priObj = {};
            obj.low_Date = key + '-' + value +' 00:00:00';
            obj.low_Price = data[key][value];
            lowPriceArr.push(obj);
            minDate =  obj.low_Date;
            if(minPri - data[key][value] > 0){
              priArr = [];
              minPri =  data[key][value];
              priObj[minDate] = minPri;
              priArr.push(priObj);
            } else if(minPri - data[key][value] == 0) {
              minPri =  data[key][value];
              priObj[minDate] = minPri;
              priArr.push(priObj);
            }
          }
          if(priArr.length !=0 ){
            minPrice = minPrice.concat(priArr);
          }
        }
        createCarouselItem(lowPriceArr, searchDate, minPrice);
        $('#f_con_wrap .calendar-wrap').css('display', 'block');
      }
    })
    .fail(err => {
     
    });
  }

  function createCarouselItem(lowdata, searchDate, minPrice) {
    var numRow = 0;
    var arr = [];
    var currYear = new Date().getFullYear();
    var currMonth = new Date().getMonth();
    var currDate = new Date().getDate();
    var $item = $('<div>').addClass('item clearfix');
    // var minPrice = JSON.parse(sessionStorage.getItem('minPrice'));
    
    for (var i = 0; i < 366; i++) {
      var flag = false;
      var currDay = new Date(currYear, currMonth, currDate + i);
      var currDayStr = currDay.getMonth() + 1 + '/' + currDay.getDate() + '/' + currDay.getFullYear();
      var spanDate = '<span class="date font-Light">' + $.formatStr(currDayStr) + '</span>';
      var searchDayStr = currDay.getFullYear() + '-' + (currDay.getMonth() + 101).toString().slice(1) + '-' + (currDay.getDate() + 100).toString().slice(1);
      var $a = $('<a href="javascript:void(0);" class="date-grid" date="' + searchDayStr + '"></a>');
      $a.append(spanDate);
      // carousel show today date
      if (currDay - searchDate == 0) {
        $item.addClass('active');
        $a.addClass('curr');
      }
      if (i == 0) {
        $a.append('<span class="colorWar font-Bold"> Today </span>');
      }
      
      for (var j = 0; j < lowdata.length; j++) {
        var lowDateStr = lowdata[j].low_Date;
        var lowDay = new Date(lowDateStr);
        if (lowDay - currDay == 0) {

          minPrice.forEach(function(val){
            if(val[lowDateStr]){
              flag = true;
            } 
          });

          if(flag){
            var span = '<span class="price minPrice font-Roman"><i class="fa fa-inr"></i> ' + lowdata[j].low_Price + '</span>';
          } else {
            var span = '<span class="price font-Roman"><i class="fa fa-inr"></i> ' + lowdata[j].low_Price + '</span>';
          }
          
          $a.append(span);
        }
      }
      $item.append($a[0]);
      numRow++;
      if (numRow == 7) {
        numRow = 0;
        arr.push($item[0].outerHTML);
        $item.removeClass('active').empty();
      }
    }
    $('#carousel-date .carousel-inner').html(arr.join(' ')); 
  }
  // fligthTitleController use bind method at oneController function
  // last params is needed params
  var flightTitleController = function(originData) {
    var model = {};
    // model.count = Object.keys(data.departFlightArray).length;
    model.dCity = originData.departMsg.from;
    model.fCity = originData.departMsg.to;
    model.dDate = originData.departMsg.dt;
    if (originData.returnMsg != undefined) {
      model.rDate = originData.returnMsg.dt;
      model.tripType = 'round';
    } else {
      model.rDate = '';
      model.tripType = '';
    }
    var viewHtml = $('#journeyTpl').html();
    renderView($('#city_route'), viewHtml, model);
    // $('#city_route').css('display', 'block');
  };
  // 单程航班
  ViewController.prototype.flightItemController = function(odata) {
    // html template has verify data is null,
    const stopSwitch = {
      0: '0 stop',
      1: '1 stop',
      2: '2 stops',
      3: '3 stops',
      4: '4 stops'
    };
    var data = odata.departFlightArray;   
    var myModel = [];
    $.each(data, function(i, flight) {
      flight.oopr = flight.fee.obfp + flight.fee.ogst;
      flight.dtime = flight.dt.replace(/.*\s/, '');
      flight.ftime = flight.at.replace(/.*\s/, '');
      flight.durationTime = $.countTime(flight.dt, flight.at);
      flight.stops = stopSwitch[flight.sb];
      flight.goldback = flight.fee.hDt + flight.fee.airDt;
      var overnight = (Date.parse(flight.at.replace(/\s.*/, '')) - Date.parse(flight.dt.replace(/\s.*/, ''))) / 86400000;
      flight.overnight = overnight == 0 ? '' : '+' + overnight;
      flight.fee.fees[1].isDisabled = delegate.isLogin ?  Math.abs(flight.fee.fees[1].dis) > delegate.silverBalance : Math.abs(flight.fee.fees[1].dis) > Number(odata.x.registerSilver);
      flight.fee.fees[1].amount =  Math.abs(flight.fee.fees[1].dis) - delegate.silverBalance;
      flight.referSilver = odata.x.referSilver;
      flight.dateStr = odata.departMsg.dt.slice(4, -4);
      flight.isLogin = delegate.isLogin;
      var flightOpa = flight.aln.split('/');
      var flightLimiter = odata.x.flightLimiter.split(',');
      var opaFlag = true;
      var nopaFlag = true;
      flight.limiter = 0;
      flightOpa.forEach(element => {
        if(odata.x.opa && odata.x.opa.indexOf(element) > -1){
          opaFlag = false;
        } 
        if(odata.x.nopa && odata.x.nopa.indexOf(element) > -1){
          nopaFlag = false;
        } 
        flightLimiter.forEach(value => {
          if(odata.x.flightLimiter && value.indexOf(element) > -1){
            flight.limiter = value.split(':')[1] - 0;
          } 
        });
      });
      flight.opa = opaFlag;
      flight.nopa = nopaFlag;
      flight.discountTitle =  odata.x.discountTitle;
      delegate.getSilverIsEnough =  Math.abs(flight.fee.fees[1].dis);
      flight.referSilver = odata.x.referSilver;
      flight.earnTitle = odata.x.earnTitle;
    });
    var viewHtml = $('#f_item_tpl').html();
    renderView($('#flights'), viewHtml, {myModel: data});
    popContent.popDiscount();
    popContent.insureTc();
    popContent.popGold();
    popContent.memberPop();

    $('.silverPop').popover();

    AddAd.addFlightsAd().then(res => {
      loadFlightAds(res);
    });
  };
  // 国际往返航班
  ViewController.prototype.flightRoundIntlController = function(data) {
    // html template has verify data is null,
    const stopSwitch = {
      0: '0 stop',
      1: '1 stop',
      2: '2 stops',
      3: '3 stops',
      4: '4 stops'
    };
    
    var referSilver = data.x.referSilver;
    var registerSilver = data.x.registerSilver;
    var flightLimiter = data.x.flightLimiter.split(',');
    var data = data.IntlFlightArray;
    var myModel = [];
    $.each(data, function(i, flight) {
      let minPriceObj = _.min(flight.fee.fees, res => res.bfp + res.gst);
      let insurePr = flight.fee.fees[0].exFee && flight.fee.fees[0].exFee[0].bfp + flight.fee.fees[0].exFee[0].gst;

      flight.minPriceObj = insurePr && ((minPriceObj.bfp + minPriceObj.gst) > insurePr) ? flight.fee.fees[0].exFee[0] : minPriceObj;

      flight.fee.fees[1].isDisabled = delegate.isLogin ?  Math.abs(flight.fee.fees[1].dis) > delegate.silverBalance : Math.abs(flight.fee.fees[1].dis) > Number(registerSilver);
      flight.fee.fees[1].amount =  Math.abs(flight.fee.fees[1].dis) - delegate.silverBalance;
      
      flight.referSilver = referSilver;
      flight.isLogin = delegate.isLogin;
      delegate.getSilverIsEnough =  Math.abs(flight.fee.fees[1].dis);
      $.each(flight.flightGroup, function(key, value) {
        value.dtime = value.dt.replace(/.*\s/, '');
        value.ftime = value.at.replace(/.*\s/, '');
        value.stops = stopSwitch[value.sb];
        var overnight = (Date.parse(value.at.replace(/\s.*/, '')) - Date.parse(value.dt.replace(/\s.*/, ''))) / 86400000;
        value.overnight = overnight == 0 ? '' : '+' + overnight;
      });
      flight.limiter = 0;
      var departFlightOpa = flight.departFlight.aln.split('/');
      var returnFlightOpa = flight.returnFlight.aln.split('/');
      departFlightOpa.forEach(element => {
        flightLimiter.forEach(value => {
          if(flightLimiter && value.indexOf(element) > -1){
            flight.limiter = flight.limiter == 0 ?  value.split(':')[1] - 0 : Math.min(flight.limiter, value.split(':')[1]);
          } 
        });
      });
      returnFlightOpa.forEach(element => {
        flightLimiter.forEach(value => {
          if(flightLimiter && value.indexOf(element) > -1){
            flight.limiter = flight.limiter == 0 ?  value.split(':')[1] - 0 : Math.min(flight.limiter, value.split(':')[1]);
          } 
        });
      });
    });
    var viewHtml = $('#f_Intl_Tpl').html();
    renderView($('#flights'), viewHtml, {myModel: data});
    popContent.popGold();
    popContent.memberPop();
    popContent.insureTc();
    $('.silverPop').popover();
    AddAd.addFlightsAd().then(res => {
      loadFlightAds(res);
    });
  };

  // 获取图片
  function loadFlightAds(res) {
    let model = res.list[0];
    let ad = `<div class="adv marT10">
      <a href="${model.href}"><img src="${model.url}" ga="${Search_result1}" class="GAAD" width="806"></a>
    </div>`;
    $('#flights').prepend(ad);

    if(res.list.length > 1) {
      for(var i = 1; i < res.list.length;i++){
        let model = res.list[i];
        if (model) {
          let ad2 = `<div class="adv adv2 marT10">
          <a href="${model.href}"><img src="${model.url}" ga="${'Search_result' + (i+1)}" class="GAAD" width="806"></a>
        </div>`;
          $($('#flights').children('.f-item'))
            .eq(3*(i-1)+2)
            .after(ad2);
        }
      }
    }
  }
  //flightDetail
  // params: data has binded data at up ajaxcallback
  var flightDetailController = function(data, id) {
    // var mergeData = $.extend({}, data.departFlightArray, data.returnFlightArray);
    var mergeData = Object.assign({}, data.departFlightArray, data.returnFlightArray);
    return mergeData[id];
  };

  function roundDataConvert(data, dataID, flightLimiter) {
    // var newData = $.extend(true, {}, data);
    var limiter = flightLimiter.split(',');
    let limitFlag = true;
    $.each(data, function(i, flight) {
      var overnight = (Date.parse(flight.at.replace(/\s.*/, '')) - Date.parse(flight.dt.replace(/\s.*/, ''))) / 86400000;
      flight.overnight = overnight == 0 ? '' : '+' + overnight;
      flight.co = flight.co || '';
      flight.oopr = flight.fee.obfp + flight.fee.ogst;
      flight.dTime = flight.dt.replace(/.*\s/, '');
      flight.fTime = flight.at.replace(/.*\s/, '');
      flight.goldback = flight.fee.hDt + flight.fee.airDt;
      flight.activeClass = '';
      flight.limiter = 0;
      var flightOpa = flight.aln.split('/');
      flightOpa.forEach(element => {
        limiter.forEach(value => {
          if(limiter && value.indexOf(element) > -1){
            flight.limiter = flight.limiter == 0 ?  value.split(':')[1] - 0 : Math.min(flight.limiter, value.split(':')[1]);
          } 
        });
      });
      if( (!flight.limiter || flight.limiter && (flight.limiter > flight.fee.pCount)) && limitFlag){
        flight.activeClass = 'active';
        delegate.branch.idArr[dataID] = flight.fn;
        limitFlag = false;
      }
    });
    return data;
  }
  // param data : {fn: {},...}
  ViewController.prototype.leaveFligthController = function(data) {
    var departFlightArray = _.sortBy(data['departFlightArray'], function(value) {
      return Number(value.pr);
    });
    //Convert :add ooper ; minest add active
    var newData = roundDataConvert(departFlightArray, 0, data.x.flightLimiter);
    var model = {
      newData: newData,
      dataSum: data.departMsg,
      flag: 'Leave',
      cycle: 0
    };
    var viewHtml = $('#roundFlightTpl').html();
    renderView($('#departColumn'), viewHtml, {myData: model});
    
  };
  ViewController.prototype.returnFlightController = function(data) {
    var returnFlightArray = _.sortBy(data['returnFlightArray'], function(value) {
      return Number(value.pr);
    });
    var newData = roundDataConvert(returnFlightArray, 1, data.x.flightLimiter);

    var model = {
      newData: newData,
      dataSum: data.returnMsg,
      flag: 'Return',
      cycle: 1,
    };
    var viewHtml = $('#roundFlightTpl').html();
    renderView($('#returnColumn'), viewHtml, {myData: model});
    // delegate.branch.idArr[1] = dataID;
  };
  /* 
   *idArray : [departid,returnid] [{id: G8123, index:1}, {id:AI123, index:1}]
   *id means flightnumber/fn
   */

  var bookTicket = function(originData, idArray) {
    var verifyTimer = 0;
    var mergeData = delegate.branch.newData;
    var sendData = {};
    var priceType = delegate.branch.type;
    if (idArray.length > 1) {
      sendData.rtd = airlineDiscount(delegate.branch.oldData[0][idArray[0].id], delegate.branch.oldData[1][idArray[1].id], delegate.branch.x.rtd).ord;
    }
    // intl round trip
    if (delegate.branch.intlArr) {
      let id = idArray[0].id;
      let roundFlight = _.find(delegate.branch.intlArr, val => val.id == id);
      idArray = [
        {
          id: roundFlight.departFlight.fn + '_' + roundFlight.id,
          index: idArray[0].index
        },
        {
          id: roundFlight.returnFlight.fn + '_' + roundFlight.id,
          index: idArray[0].index
        }
      ];
    }
    // 0 depart,1 return;
    for (var i = 0; i < idArray.length; i++) {
      let name = i == 0 ? 'departFlight' : 'returnFlight';
      let flightData = mergeData[i][idArray[i].id];
      let index = idArray[i].index;
      let fee = flightData.fee.fees[index];
      sendData[name] = flightData;
      sendData[name].feee = {
        feeStr: flightData.feee.feeStr,
        feeStrings: [flightData.feee.feeStrings[index]]
      };

      // type 1:common, 2:silver, 3:cashback, 4 special cashback
      if (priceType === 3 || priceType === 4) {
        // var verifyPri = fee.gst + fee.bfp;
        sendData[name].sid = fee.sid;
        var feeO = {
          obfp: fee.bfp,
          ogst: fee.gst,
          bfp: fee.bfp - fee.cba,
          gst: fee.gst,

          policyDiscount: flightData.fee.dType ? null : -flightData.fee.hDt,
          intervalDiscount: flightData.fee.dType ? -flightData.fee.hDt : null,
          airCompanyDiscount: -flightData.fee.airDt || null
        };
      } else if (priceType === 2) {
        var feeO = {
          obfp: flightData.fee.obfp,
          ogst: flightData.fee.ogst,
          bfp: flightData.fee.bfp - flightData.fee.airDt + fee.sdis,
          gst: flightData.fee.gst,

          policyDiscount: flightData.fee.dType ? null : -flightData.fee.hDt,
          intervalDiscount: flightData.fee.dType ? -flightData.fee.hDt : null,
          airCompanyDiscount: -flightData.fee.airDt || null
        };
      } else {
        var feeO = {
          obfp: flightData.fee.obfp,
          ogst: flightData.fee.ogst,
          bfp: flightData.fee.bfp - flightData.fee.airDt,
          gst: flightData.fee.gst,

          policyDiscount: flightData.fee.dType ? null : -flightData.fee.hDt,
          intervalDiscount: flightData.fee.dType ? -flightData.fee.hDt : null,
          airCompanyDiscount: -flightData.fee.airDt || null
        };
      }

      Object.assign(sendData[name], {
        flightNo: flightData.fn,
        policyId: flightData.policyId,
        feeO: feeO
      });
      sendData.type = priceType;
    }
    sendData.token = originData.token;
    sendData.requestFromClient = queryObj;
    sendData.returnCash = priceType == 3;
    $.ajax({
      url: paths.bookVerify0(),
      type: 'POST',
      data: JSON.stringify(sendData),
      contentType: 'application/json',
      dataType: 'json'
    })
      .then(function(result) {
        if (result.code === 0) {
          var flag = true;
          var arr = sendData.departFlight.aln.split('/');
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] != 'SG') {
              flag = false;
              break;
            }
          }
          if (flag && sendData.returnFlight) {
            var arr = sendData.returnFlight.aln.split('/');
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] != 'SG') {
                flag = false;
                break;
              }
            }
          }
          var coupon = flag && !sendData.returnCash ? '&src' : '';
          let track = '';
          for (let i in queryObj){
            if(queryObj[i]){
              track += `&${i}=${queryObj[i]}`;
            }
          }
          w.location.href = '/booking/' + '?token=' + result.token + coupon + track;
        } else if (result.code === 2) {
          $('#flightExpire')
            .find('.modal-body p')
            .text('International flights will be coming soon.');
          $('#flightExpire').modal('show');
        } else {
          return $.Deferred().reject(result);
        }
      })
      .fail(function() {
        $('#flightExpire')
          .find('.modal-body p')
          .text('Fare changed. Please search again.');
        $('#flightExpire').modal('show');
      });
  };

  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
    // _rendered = true;
  }
  w['ViewController'] = new ViewController();
})(window, jQuery, underscore);

// filter, use the delegate
var filterGather = {
  filterCon: {
    price: '',
    stops: [],
    depart: [],
    airlines: []
  },
  rFilterCon: {
    price: '',
    stops: [],
    depart: [],
    airlines: []
  },
  resetFilterCon: function() {
    this.filterCon = {
      price: '',
      stops: [],
      depart: [],
      airlines: []
    };
    this.rFilterCon = {
      price: '',
      stops: [],
      depart: [],
      airlines: []
    };
  },
  couponFilter: function() {
    this.filterCon.silver = '';
    this.rFilterCon.silver = '';
    var coupon = delegate.couponObj;
    if (coupon == '') {
      return;
    }
    this.filterCon.coupon = coupon;
    this.rFilterCon.coupon = coupon;

    var filterData = this.filterFlight(this.filterCon, this.rFilterCon);
    this.filterLoad(filterData, queryObj.tripType);
  },
  init: function() {
    var _this = this;

    function DFilterUtil(event) {
      if ($(this).hasClass('active')) {
        _this.removeByValue(
          _this.filterCon[
            $(this)
              .parent()
              .data('filter')
          ],
          $(this).data('code')
        );
      } else {
        _this.filterCon[
          $(this)
            .parent()
            .data('filter')
        ].push($(this).data('code'));
      }
      $(this).toggleClass('active');
      if (event.target.className === 'show-only') {
        _this.filterCon.airlines.splice(0, _this.filterCon.airlines.length, $(this).data('code'));
        $(this)
          .addClass('active')
          .siblings('li')
          .removeClass('active');
      }
      // fliterData has filter data
      // when click it  already has data
      var filterData = _this.filterFlight(_this.filterCon, _this.rFilterCon);
      _this.filterLoad(filterData, queryObj.tripType);
    }
    // var lazyLayout1 = _.debounce(DFilterUtil, 500);
    $(document).on('click', '#stopsFilter li, #timeFilter li, #airlinesFilter li', _.debounce(DFilterUtil, 300));

    function RFilterUtil(event) {
      if ($(this).hasClass('active')) {
        _this.removeByValue(
          _this.rFilterCon[
            $(this)
              .parent()
              .data('filter')
          ],
          $(this).data('code')
        );
      } else {
        _this.rFilterCon[
          $(this)
            .parent()
            .data('filter')
        ].push($(this).data('code'));
      }
      $(this).toggleClass('active');
      if (event.target.className === 'show-only') {
        _this.rFilterCon.airlines.splice(0, _this.rFilterCon.airlines.length, $(this).data('code'));
        $(this)
          .addClass('active')
          .siblings('li')
          .removeClass('active');
      }
      // fliterData has filter data
      // when click it  already has data
      var filterData = _this.filterFlight(_this.filterCon, _this.rFilterCon);
      _this.filterLoad(filterData, queryObj.tripType);
    }
    var lazyLayout2 = _.debounce(RFilterUtil, 500);
    $(document).on('click', '#r_stopsFilter li, #r_timeFilter li, #r_airlinesFilter li', lazyLayout2);

    //promotion filter
    $('#promotionFilter .p-radio').on('click', function() {
      $(this)
        .parent()
        .addClass('active')
        .siblings()
        .removeClass('active');
      if ($('#promotionFilter .coupon').hasClass('active')) {
        _this.couponFilter();
      }
    });
    // arilines clear
    function SFilterUtil(event) {
      //  clear filterConObj of airlines array
      _this.filterCon.airlines.splice(0, _this.filterCon.airlines.length);
      // all add active
      // $('#airlinesFilter .chkbox').each(function(i, val){
      //   $(val).addClass('active');
      //   _this.filterCon.airlines.push($(val).data('code'));
      // });

      // remove active
      $('#airlinesFilter .chkbox').each(function(i, val) {
        $(val).removeClass('active');
      });
      var filterData = _this.filterFlight(_this.filterCon, _this.rFilterCon);
      _this.filterLoad(filterData, queryObj.tripType);
    }
    var lazyLayout3 = _.debounce(SFilterUtil, 500);
    $(document).on('click', '#showAll', lazyLayout3);

    function R_SFilterUtil(event) {
      //  clear filterConObj of airlines array
      _this.rFilterCon.airlines.splice(0, _this.rFilterCon.airlines.length);
      // all add active
      // $('#airlinesFilter .chkbox').each(function(i, val){
      //   $(val).addClass('active');
      //   _this.filterCon.airlines.push($(val).data('code'));
      // });

      // remove active
      $('#r_airlinesFilter .chkbox').each(function(i, val) {
        $(val).removeClass('active');
      });
      var filterData = _this.filterFlight(_this.filterCon, _this.rFilterCon);
      _this.filterLoad(filterData, queryObj.tripType);
    }
    var lazyLayout4 = _.debounce(R_SFilterUtil, 500);
    $(document).on('click', '#r_showAll', lazyLayout4);

    // var lazyLayout5 = _.debounce(_this.reset, 500);
    $('#resetAll').on('click', _.debounce(_this.reset, 500));
    $('body').on('click', '.f_reset', _.debounce(_this.reset, 500));
  },

  reset: function() {
    // price-range style reset
    $('#priceRange .rangeHandle.high').css('left', 209);
    $('#priceRange .selection').css('width', 218);
    var highLabel = $('#priceRange .pointer-label').last();
    highLabel.html('<i class="fa fa-inr"></i>&nbsp;' + highLabel.data('price').toThree());
    $('#stopFilter, #timeFilter, #airlinesFilter')
      .find('li')
      .removeClass('active');

    try {
      $('#r_priceRange .rangeHandle.high').css('left', 209);
      $('#r_priceRange .selection').css('width', 218);
      var highLabel2 = $('#r_priceRange .pointer-label').last();
      highLabel2.html('<i class="fa fa-inr"></i>&nbsp;' + highLabel2.data('price').toThree());
      $('#r_stopFilter, #r_timeFilter, #r_airlinesFilter')
        .find('li')
        .removeClass('active');
    } catch (e) {}

    this.filterCon = {
      price: '',
      stops: [],
      depart: [],
      airlines: []
    };
    this.rRilterCon = {
      price: '',
      stops: [],
      depart: [],
      airlines: []
    };
    var filterData = this.filterFlight(this.filterCon, this.rFilterCon);
    this.filterLoad(filterData, queryObj.tripType);
  },
  priceFilter: function(that, value, tripType) {
    if (tripType === 'priceRange') {
      this.filterCon.price = value;
    } else {
      this.rFilterCon.price = value;
    }

    var filterData = this.filterFlight(this.filterCon, this.rFilterCon);
    this.filterLoad(filterData, queryObj.tripType);
  },

  removeByValue: function(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  },

  // filterFlight;  bind data at pre ajax , return filter data;
  filterFlight: function(data, filterCon, rFilterCon) {
    // var pCount = parseInt(queryObj.adults) + parseInt(queryObj.childs) + parseInt(queryObj.baby);
    //filterObj return {fn: data} ;
    var IntlFlightArray;
    if (data.intlType == 1) {
      IntlFlightArray = _.filter(data.IntlFlightArray, function(val, key) {
        return filterIntl(val, val.departFlight, filterCon) && filterIntl(val, val.returnFlight, rFilterCon);
      });
    } else {
      var newDepartData = _.filterObj(data.departFlightArray, function(val, key) {
        return filterResult(val, filterCon);
      });
      var newReturnData = _.filterObj(data.returnFlightArray, function(val, key) {
        return filterResult(val, rFilterCon);
      });
    }

    function filterIntl(parentValue, value, filterCon) {
      //price filter
      if (filterCon.price !== '') {
        if (parseInt(filterCon.price) < Math.round((parentValue.fee.bfp + parentValue.fee.gst) / parentValue.fee.pCount)) {
          return false;
        }
      }
      //departTime filter
      if (filterCon.depart.length !== 0) {
        var departCode = Math.floor(new Date(value.dt.replace('T', ' ').replace(/-/g, '/')).getHours() / 6);
        if ($.inArray(departCode, filterCon.depart) < 0) {
          return false;
        }
      }
      // stops filter;
      if (filterCon.stops.length !== 0) {
        var stopCode = value.sb < 2 ? value.sb : 2;
        if ($.inArray(stopCode, filterCon.stops) < 0) {
          return false;
        }
      }
      // airlines
      if (filterCon.airlines.length !== 0) {
        if ($.inArray(value.al, filterCon.airlines) < 0) {
          return false;
        }
      }
      return true;
    }
    // filterResult return true or false
    function filterResult(value, filterCon) {
      let coupon = filterCon.coupon;
      let silver = filterCon.silver;
      // let dirOff = Coupon(coupon, value) || 0;
      value.pr = value.opr;

      //price filter
      if (filterCon.price !== '') {
        if (parseInt(filterCon.price) < Math.round(value.pr / value.fee.pCount)) {
          return false;
        }
      }
      //departTime filter
      if (filterCon.depart.length !== 0) {
        var departCode = Math.floor(new Date(value.dt.replace('T', ' ').replace(/-/g, '/')).getHours() / 6);
        if ($.inArray(departCode, filterCon.depart) < 0) {
          return false;
        }
      }
      // stops filter;
      if (filterCon.stops.length !== 0) {
        var stopCode = value.sb < 2 ? value.sb : 2;
        if ($.inArray(stopCode, filterCon.stops) < 0) {
          return false;
        }
      }
      // airlines
      if (filterCon.airlines.length !== 0) {
        if ($.inArray(value.al, filterCon.airlines) < 0) {
          return false;
        }
      }
      return true;
    }
    // regroup data;
    var newFlightData = $.extend(true, {}, data);
    newFlightData.departFlightArray = newDepartData;
    newFlightData.returnFlightArray = newReturnData;
    newFlightData.IntlFlightArray = IntlFlightArray;
    return newFlightData;
  },
  filterLoad: function(filterdata, tripType) {
    switch (parseInt(tripType)) {
      case 0:
        ViewController.flightTitleController(filterdata);
        ViewController.flightItemController(filterdata);
        break;
      case 1:
        if (filterdata.intlType == 1) {
          ViewController.flightTitleController(filterdata);
          ViewController.flightRoundIntlController(filterdata);
          return;
        }
        delete delegate.returnFlightArray;
        delete delegate.departFlightArray;
        ViewController.flightTitleController(filterdata);
        ViewController.leaveFligthController(filterdata);
        ViewController.returnFlightController(filterdata);
        //show flight optional
        priceOptional(delegate.branch, []);
        randerSelectedFlight(delegate.branch);
        break;
    }
  }
};
filterGather.init();

//research
//set time and city
$(() => {
  // click modify search
  function callback(url) {
    $('#modify_search_modal').modal('hide');
    // window.history.pushState(null, null, url);
    location.href = url;
    // ViewController.initialize();
    delegate.count = 0;
  }
  $('#modify_search_modal').on('show.bs.modal', function() {
    loadHistoy('searchForm');
    if ($('#Roundtrip').prop('checked')) {
      $('.section2 .r-date').removeClass('hidden');
      $('#returnDate').removeAttr('disabled');
    } else {
      $('.section2 .r-date').addClass('hidden');
      $('#returnDate').attr('disabled', 'disabled');
    }
  });
  $('#search_flights_btn').on('click', function() {
    handleForm(this, callback);
  });
  // $('#researchBtn').on('click', function(){
  //   window.history.pushState(null, null, paths.flightUrl($("#researchForm").serialize()));
  //   ViewController.initialize();
  // });
  $('body').on('click', '#carousel-date .date-grid', function() {
    $(this)
      .addClass('curr')
      .siblings()
      .removeClass('curr');
    var dateStr = $(this).attr('date');
    var href = location.href.replace(/\d{4}-\d{1,2}-\d{1,2}/, dateStr);
    location.href = href;
    // window.history.pushState(null, null, href);
    // ViewController.initialize();
    // delegate.count = 0;
  });
});

// Sort  flight
$(() => {
  // depart sort one way
  var flagD = 0,
    flagA = 0,
    flagDur = 0,
    flagPr = 0,
    flagCb = 0;
  $('#f_title .fore:eq(1) div:eq(0)').on('click', function() {
    var $fItem = $('#flights .f-item');
    if (flagD == 0) {
      flagD = 1;
      var fIs = _.sortBy($fItem, function(fitem) {
        return Date.parse($(fitem).data('dt'));
      });
    } else {
      flagD = 0;
      var fIs = _.sortBy($fItem, function(fitem) {
        return -Date.parse($(fitem).data('dt'));
      });
    }
    $(fIs)
      .detach()
      .appendTo('#flights');

    $('.adv2').detach();
    getFlightsAd2();
  });

  $('#f_title .fore:eq(1) div:eq(1)').on('click', function() {
    var $fItem = $('#flights .f-item');
    if (flagA == 0) {
      flagA = 1;
      var fIs = _.sortBy($fItem, function(fitem) {
        return Date.parse($(fitem).data('at'));
      });
    } else {
      flagA = 0;
      var fIs = _.sortBy($fItem, function(fitem) {
        return -Date.parse($(fitem).data('at'));
      });
    }
    $(fIs)
      .detach()
      .appendTo('#flights');

    $('.adv2').detach();
    getFlightsAd2();
  });
  $('#f_title .fore:eq(1) div:eq(2)').on('click', function() {
    var $fItem = $('#flights .f-item');
    if (flagDur === 0) {
      flagDur = 1;
      var fIs = _.sortBy($fItem, function(fitem) {
        return Date.parse($(fitem).data('at')) - Date.parse($(fitem).data('dt'));
      });
    } else {
      flagDur = 0;
      var fIs = _.sortBy($fItem, function(fitem) {
        return Date.parse($(fitem).data('dt')) - Date.parse($(fitem).data('at'));
      });
    }
    $(fIs)
      .detach()
      .appendTo('#flights');

    $('.adv2').detach();
    getFlightsAd2();
  });
  // oneway sort by price
  $('#f_title .fore:eq(2) div:eq(0)').on('click', function() {
    var $fItem = $('#flights .f-item');
    if (delegate.branch.intlArr) {
      if (flagPr == 0) {
        flagPr = 1;
        var fIs = _.sortBy($fItem, function(fitem) {
          return Number($(fitem).data('price'));
        });
      } else {
        flagPr = 0;
        var fIs = _.sortBy($fItem, function(fitem) {
          return -Number($(fitem).data('price'));
        });
      }
    } else {
      if (flagPr == 0) {
        flagPr = 1;
        var fIs = _.sortBy($fItem, function(fitem) {
          return Number(
            $(fitem)
              .find('.fore:eq(2) .f-price')
              .data('price')
              .toString()
              .replace(/,/g, '')
          );
        });
      } else {
        flagPr = 0;
        var fIs = _.sortBy($fItem, function(fitem) {
          return -Number(
            $(fitem)
              .find('.fore:eq(2) .f-price')
              .data('price')
              .toString()
              .replace(/,/g, '')
          );
        });
      }
    }

    $(fIs)
      .detach()
      .appendTo('#flights');

    $('.adv2').detach();
    getFlightsAd2();
  });

  $('#f_title .fore:eq(2) div:eq(1)').on('click', function() {
    var $fItem = $('#flights .f-item');
    if (flagCb == 0) {
      flagCb = 1;
      var fIs = _.sortBy($fItem, function(fitem) {
        return Number(
          $(fitem)
            .find('.brief  .cashback')
            .text()
            .replace(/,/g, '')
        );
      });
    } else {
      flagCb = 0;
      var fIs = _.sortBy($fItem, function(fitem) {
        return -Number(
          $(fitem)
            .find('.brief .cashback')
            .text()
            .replace(/,/g, '')
        );
      });
    }
    $(fIs)
      .detach()
      .appendTo('#flights');

    $('.adv2').detach();
    getFlightsAd2();
  });
  // return depart time sort
  var sortDepartFlag = {
    flagD: 0,
    flagA: 0,
    flagDur: 0,
    flagPr: 0
  };
  var sortreturnflag = {
    flagD: 0,
    flagA: 0,
    flagDur: 0,
    flagPr: 0
  };
  $('#departColumn').on('click', '.f-til .fore1', function() {
    var $fItem = $('#departColumn .f-item');
    var fIs = sortDepartTime(sortDepartFlag, $fItem);
    $(fIs)
      .detach()
      .appendTo('#departColumn .flight-body');
  });
  $('#returnColumn').on('click', '.f-til .fore1', function() {
    var $fItem = $('#returnColumn .f-item');
    var fIs = sortDepartTime(sortreturnflag, $fItem);
    $(fIs)
      .detach()
      .appendTo('#returnColumn .flight-body');
  });
  // return time sort
  $('#departColumn').on('click', '.f-til .fore2', function() {
    var $fItem = $('#departColumn .f-item');
    var fIs = sortReturnTime(sortDepartFlag, $fItem);
    $(fIs)
      .detach()
      .appendTo('#departColumn .flight-body');
  });
  $('#returnColumn').on('click', '.f-til .fore2', function() {
    var $fItem = $('#returnColumn .f-item');
    var fIs = sortReturnTime(sortreturnflag, $fItem);
    $(fIs)
      .detach()
      .appendTo('#returnColumn .flight-body');
  });
  // sort duration
  $('#departColumn').on('click', '.f-til .fore3', function() {
    var $fItem = $('#departColumn .f-item');
    var fIs = sortDur(sortDepartFlag, $fItem);
    $(fIs)
      .detach()
      .appendTo('#departColumn .flight-body');
  });

  $('#returnColumn').on('click', '.f-til .fore3', function() {
    var $fItem = $('#returnColumn .f-item');
    var fIs = sortDur(sortreturnflag, $fItem);
    $(fIs)
      .detach()
      .appendTo('#returnColumn .flight-body');
  });

  function sortDepartTime(sortflag, $fItem) {
    if (sortflag.flagD == 0) {
      sortflag.flagD = 1;
      return _.sortBy($fItem, function(fitem) {
        return Date.parse($(fitem).data('dt'));
      });
    } else {
      sortflag.flagD = 0;
      return _.sortBy($fItem, function(fitem) {
        return -Date.parse($(fitem).data('dt'));
      });
    }
  }

  function sortReturnTime(sortflag, $fItem) {
    if (sortflag.flagA == 0) {
      sortflag.flagA = 1;
      return _.sortBy($fItem, function(fitem) {
        return Date.parse($(fitem).data('at'));
      });
    } else {
      sortflag.flagA = 0;
      return _.sortBy($fItem, function(fitem) {
        return -Date.parse($(fitem).data('at'));
      });
    }
  }

  function sortDur(sortflag, $fItem) {
    if (sortflag.flagDur === 0) {
      sortflag.flagDur = 1;
      return _.sortBy($fItem, function(fitem) {
        return Date.parse($(fitem).data('at')) - Date.parse($(fitem).data('dt'));
      });
    } else {
      sortflag.flagDur = 0;
      return _.sortBy($fItem, function(fitem) {
        return Date.parse($(fitem).data('dt')) - Date.parse($(fitem).data('at'));
      });
    }
  }
  //return sort by price
  $('#departColumn').on('click', '.f-til .fore4', function() {
    var $fItem = $('#departColumn .f-item');
    var fIs = sortprice(sortDepartFlag, $fItem);
    $(fIs)
      .detach()
      .appendTo('#departColumn .flight-body');
  });
  $('#returnColumn').on('click', '.f-til .fore4', function() {
    var $fItem = $('#returnColumn .f-item');
    var fIs = sortprice(sortreturnflag, $fItem);
    $(fIs)
      .detach()
      .appendTo('#returnColumn .flight-body');
  });
  var sortprice = function(sortflag, $fItem) {
    if (sortflag.flagPr == 0) {
      sortflag.flagPr = 1;
      return _.sortBy($fItem, function(fitem) {
        return Number(
          $(fitem)
            .find('.fore4 .price strong')
            .text()
            .toString()
            .replace(/,/g, '')
        );
      });
    } else {
      sortflag.flagPr = 0;
      return _.sortBy($fItem, function(fitem) {
        return -Number(
          $(fitem)
            .find('.fore4 .price strong')
            .text()
            .toString()
            .replace(/,/g, '')
        );
      });
    }
  };

  // 获取图片
  function getFlightsAd2() {
    AddAd.addFlightsAd().then(res => {
      if(res.list.length > 1) {
        for(var i = 1; i < res.list.length;i++){
          let model = res.list[i];
          if (model) {
            let ad2 = `<div class="adv adv2 marT10">
            <a href="${model.href}"><img src="${model.url}" ga="${'Search_result' + (i+1)}" class="GAAD" width="806"></a>
          </div>`;
            $($('#flights').children('.f-item'))
              .eq(3*(i-1)+2)
              .after(ad2);
          }
        }
      }

    });
  }
});
/* end sort  */

// gold cash back and roundway select
$(() => {
  //round way select flight
  $('#f_r_content').on('click', '#departColumn .f-item .brief', function() {
    
    let $this = $(this).parents('.f-item');
    let instantKey = $this.data('instantkey');
    let id = $this.data('fn');
    if (!$this.hasClass('active')) {
      delegate.branch.type = 1;
      delegate.branch.index = 0;
      priceOptional(delegate.branch, [id, delegate.branch.idArr[1]]);
      randerSelectedFlight(delegate.branch);

      $this
        .addClass('active')
        .siblings('.f-item')
        .removeClass('active');
    }
  });

  $('#f_r_content').on('click', '#returnColumn .f-item .brief', function() {
    let $this = $(this).parents('.f-item');
    let instantKey = $this.data('instantkey');
    let id = $this.data('fn');

    if (!$this.hasClass('active')) {
      delegate.branch.type = 1;
      delegate.branch.index = 0;
      priceOptional(delegate.branch, [delegate.branch.idArr[0], id]);
      randerSelectedFlight(delegate.branch);

      $this
        .addClass('active')
        .siblings('.f-item')
        .removeClass('active');
    }
  });

  $('#f_r_content').on('click', 'input.isCashback', function(e) {
    e.cancelBubble = true;
    e.stopPropagation();
    let index = $(this).data('index');
    let type = $(this).data('type');

    delegate.branch.type = type;
    delegate.branch.index = index;
    $(this)
      .parents('.flightColumn')
      .siblings()
      .find('.f-item.active')
      .find('input.isCashback')[index].checked = true;

    bottomSelectedPrice(delegate.branch.idArr, delegate.branch.newData, index, delegate.silverBalance, delegate.isLogin);
  });
});

$(document).on('shown.bs.popover', '.insTc', function(event) {
  let button = $(event.target);
  let id = button.data('id');
  let cycle = button.data('cycle') || 0;
  let token = sessionStorage.getItem('token');
  if (delegate.branch.intlArr) {
    var model = _.find(delegate.branch.intlArr, function(val, key) {
      return val.id == id;
    });
  } else {
    var model = delegate.branch.newData[cycle][id];
  }
  let insureTcStr = model.fee.fees[0].exFee[0].tc;
  insureTcStr = insureTcStr.split('<br>').map(v => '<p class="fontSz12 marB8 font-Roman">'+v+'</p>').join('');
  $('.popover .insureTc').append(insureTcStr);

});
// popDiscount
$(document).on('shown.bs.popover', '.popDiscount', function(event) {
  let button = $(event.target);
  let id = button.data('id');
  let index = button.data('index');
  let token = sessionStorage.getItem('token');
  // cycle D =0 R =1  oneway or round
  let cycle = button.data('cycle') || 0;
  if (delegate.branch.intlArr) {
    var model = _.find(delegate.branch.intlArr, function(val, key) {
      return val.id == id;
    });
  } else {
    var model = delegate.branch.newData[cycle][id];
  }

  var feeObj = null;
  if(index == 'min'){
    feeObj = model.minPriceObj;
  }else{
    feeObj = model.fee.fees[index].exFee ? model.fee.fees[index].exFee[0] : model.fee.fees[index];
  }

  $('.popover .viewOpr').text(Math.round(model.oopr / model.fee.pCount).toThree());
  $('.popover .viewSell').text(Math.round((feeObj.bfp + feeObj.gst) / model.fee.pCount).toThree());
  $('.popover .viewDis').text(Math.round(feeObj.dis / model.fee.pCount).toThree());
});

$(document).on('shown.bs.popover', '.memberPop', function(event) {
  let button = $(event.target);
  let id = button.data('id');
  let cycle = button.data('cycle') || 0;
  let index = button.data('index');
  var token = sessionStorage.getItem('token');
  if (delegate.branch.intlArr) {
    var model = _.find(delegate.branch.intlArr, function(val, key) {
      return val.id == id;
    });
  } else {
    var model = delegate.branch.newData[cycle][id];
  }
  var fee =  model.fee.fees[index].exFee ? model.fee.fees[index].exFee[0] : model.fee.fees[index];
  var payPrice = Math.round((fee.bfp + fee.gst) / model.fee.pCount);
  var dis = Math.round(fee.dis / model.fee.pCount);

  $('.popover .silverDis').text(dis.toThree());
  $('.popover .silverPr').text(payPrice.toThree());
  
  if (delegate.isLogin) {
    let silverBalance = delegate.silverBalance;
    $('.popover .silverSlot').html('3. You still have <i class="rs colorDan">Rs.</i> <span class="originPr colorDan">' + silverBalance.toThree() + '</span> Happy Silver in your Happy Wallet account.');
  }
  if(fee.show){
    let insureTcStr = fee.tc;
    insureTcStr = insureTcStr.split('<br>').map(v => '<p class="fontSz12 marB8 font-Roman">'+v+'</p>').join('');
    $('.popover .memberPopTc').append(`<div class="dashBorder">${insureTcStr}</div>`);
  }
});
// gold backdetail
$(document).on('shown.bs.popover', '.goldbackPop', function(event) {
  let button = $(event.target);
  let id = button.data('id');
  let type = button.data('type');
  let index = button.data('index');
  let cycle = button.data('cycle') || 0;
  var token = sessionStorage.getItem('token');
  
  if (delegate.branch.intlArr) {
    var model = _.find(delegate.branch.intlArr, function(val, key) {
      return val.id == id;
    });
  } else {
    var model = delegate.branch.newData[cycle][id];
  }
  var fee = model.fee.fees[index].exFee ? model.fee.fees[index].exFee[0] : model.fee.fees[index];
  var cba = Math.round(fee.cba / model.fee.pCount);
  var payPrice = Math.round((fee.bfp + fee.gst) / model.fee.pCount);

  $('.popover .originPr').text(payPrice.toThree());
  if (type == 4) {
    $('.popover .noFee').html('4. FREE MODIFICATION - You are allowed to make changes in your flight once.');
  }
  if(fee.show){
    let insureTcStr = fee.tc;
    insureTcStr = insureTcStr.split('<br>').map(v => '<p class="fontSz12 marB8 font-Roman">'+v+'</p>').join('');
    $('.popover .popGoldTc').append(`<div class="dashBorder">${insureTcStr}</div>`);
  }

  $('.popover .cashbackPr').text(cba.toThree());
  // $(".popover .leftPr").text(model.pr.toThree());
});

// flight detail show
$(() => {
  $('#f_detail_modal').on('show.bs.modal', function(event) {
    var modal = $(this);
    let passenger = {
      adult: parseInt(queryObj.adults || 1),
      children: parseInt(queryObj.childs || 0),
      infant: parseInt(queryObj.baby || 0)
    };
    let pCount = passenger.adult + passenger.children + passenger.infant;

    modal.find('.modalBody').html('<div class="detail-loading">\
          <img src="/static/images/loading.jpg" alt="">\
        </div>');
    modal
      .find('.detail-tab')
      .find('li')
      .eq(0)
      .addClass('active')
      .siblings('li')
      .removeClass('active');

    var button = $(event.relatedTarget);
    var dataID = button.data('id');
    // Leave: depart , Return: return
    var cycle = button.data('cycle') || 0;
    
    if (delegate.branch.intlArr) {
      var detailData = _.find(delegate.branch.intlArr, function(val, key) {
        return val.id == dataID;
      });
      detailData.opr = detailData.fee.gst + detailData.fee.bfp;
      detailData.fn = detailData.departFlight.fn + '/' + detailData.returnFlight.fn;
      detailData.ddts = '34';
      detailData.dc = detailData.departFlight.dc;
      detailData.ac = detailData.departFlight.ac;
    } else {
      var detailData = $.extend(true, {}, delegate.branch.newData[cycle][dataID]);
      detailData.flightGroup = [detailData];
      detailData.dDateT = $.formatStr(detailData.dt.replace(/\s.*/, ''));
    }
    // data from id

    detailData.passenger = passenger;
    detailData.type = delegate.branch.type;
    detailData.feeDel = detailData.fee.fees[detailData.type - 1];
    $.each(detailData.stopsArray, function(key, value) {
      $.each(value.stopByFlightArray, function(i, val) {
        val.ati = val.ati || '';
        val.dti = val.dti || '';
        val.aFullT = $.formatStr(val.at.replace(/\s.*/, '')) + ',' + val.at.replace(/.*\s/, ' ');
        val.dFullT = $.formatStr(val.dt.replace(/\s.*/, '')) + ',' + val.dt.replace(/.*\s/, ' ');
      });
    });

    detailData.totalOff = -(detailData.fee.obfp + detailData.fee.ogst - detailData.pr);

    var renderTemp = _.template($('#detail_con_tpl').html());
    var queryData = {
      flightNo: detailData.fn,
      departDateTime: detailData.ddts,
      // discountPrice:detailData.opr
      discountPrice: Math.floor(detailData.opr / pCount),
      refundable: detailData.fee.refundable,
      isIntl: delegate.branch.isIntl
    };
    $.ajax({
      url: paths.fareBaggageQueryUrl(),
      type: 'GET',
      data: queryData,
      // data:JSON.stringify(queryData),
      // contentType:'application/json',
      dataType: 'json',
      cache: true
    }).done(function(result) {
      let model = $.extend({}, detailData, result);
      modal.find('.modalBody').html(
        renderTemp({model: model})
      );
    });
  });
});


// flight  book
$(() => {
  //flight slideDown book
  function preBook(flightId){
    let departFlight = delegate.branch.newData[0][flightId];
    let flights = {
        requestFromClient: queryObj, 
        departFlight,
        token: sessionStorage.getItem('token'),
      };
    let params = {
      token: sessionStorage.getItem('token'),
      flights: JSON.stringify(flights)
    };

    $.ajax({
      url:'/heg_api/order/saveCheckFlight.do',
      method:'POST',
      contentType:'application/json',
      data:JSON.stringify(params),
      dataType: 'json'
    }).done(res => {
      sessionStorage.setItem('registerSilver', delegate.branch.x.registerSilver);
      window.location.href='/flight-product?token='+res.data;
    });
    // window.location.href='/flight-product';
  }
  $('#f_content').on('click', '.optionalBook', function(event) {
    
    if(!delegate.branch.isIntl && queryObj.tripType == 0) {
      var flightId = $(this).parents('.f-item').attr('id');
      preBook(flightId);
      return false;
    }
    event.stopPropagation();
    if (!$(this).hasClass('curr')) {
      $(this)
        .addClass('curr')
        .parents('.f-item')
        .children('.f-optional')
        .slideDown();
      delegate.visitNumOnoff = false;
    } else {
      $(this)
        .removeClass('curr')  
        .parents('.f-item')
        .children('.f-optional').slideUp();
    }
  });

  $('#f_content').on('mouseenter', '.flightItemA', function() {
    var pops = $(this).children('.popoverInfo');
    $('.popoverInfo').addClass('hide');
    pops.removeClass('hide');

  });
  $('#f_content').on('mouseleave', '.flightItemA', function() {
    var pops = $(this).children('.popoverInfo');
    pops.addClass('hide');
  });

  $('#f_content').on('mouseenter', '.bookWrap .btn_type2', function() {
    if(!$(this).hasClass('disable')) return false; 
    var pops = $(this).siblings('.sliverNoEnough');
    $('.sliverNoEnough').addClass('hide');
    pops.removeClass('hide');
  });
  $('#f_content').on('mouseleave', '.bookWrap', function() {
    var pops = $(this).children('.sliverNoEnough');
    pops.addClass('hide');
  });

  $(document).on('click', function(e) {
    e.stopPropagation();
    $('.flightItemA .popoverInfo').addClass('hide');
  });

  $('#f_content').on('click', '.f-book', function() {
    let type = $(this).data('type');
    let id = $(this).data('id');
    let index = $(this).data('index');
    if($(this).hasClass('disable')){
      return false;
    }

    delegate.branch.type = type;
    $(this).addClass('progress-dynamic');
    ViewController.bookTicket([
      {
        id,
        index
      }
    ]);
  });

  // round way booking
  $('#bookTicket').on('click', function() {
    $(this).addClass('progress-dynamic');
    ViewController.bookTicket([
      {
        id: delegate.branch.idArr[0],
        index: delegate.branch.index
      },
      {
        id: delegate.branch.idArr[1],
        index: delegate.branch.index
      }
    ]);
  });
});

$(document).on('click', function(e) {
  e.stopPropagation();
  $('.flightItemA .popoverInfo').addClass('hide');
});
  




