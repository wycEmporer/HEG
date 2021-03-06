const utils = require('utils');
const paths = utils.path;
const cookieUtil = utils.cookieUtil;
export class CheckPrice {
  constructor() {}
  static checkFare(postData) {
    let feeO = {
      obfp: postData.departFlight.fee.obfp,
      ogst: postData.departFlight.fee.ogst,
      bfp: postData.departFlight.fee.bfp,
      gst: postData.departFlight.fee.gst,
      policyDiscount: postData.departFlight.fee.policyDiscount || null,
      intervalDiscount: postData.departFlight.fee.intervalDiscount || null,
      airCompanyDiscount: postData.departFlight.fee.airCompanyDiscount || null
    };
    let sendData = {
      rtd: postData.rtd || null,
      departFlight: postData.departFlight,
      'returnCash': postData.returnCash,
      'requestFromClient': postData.requestFromClient,
      'token': postData.token,
    };
    sendData.departFlight.feeO = feeO;
    if (!!postData.returnFlight) {
      let feeO = {
        obfp: postData.returnFlight.fee.obfp,
        ogst: postData.returnFlight.fee.ogst,
        bfp: postData.returnFlight.fee.bfp,
        gst: postData.returnFlight.fee.gst,

        policyDiscount: postData.returnFlight.fee.policyDiscount || null,
        intervalDiscount: postData.returnFlight.fee.intervalDiscount || null,
        airCompanyDiscount: postData.returnFlight.fee.airCompanyDiscount || null
      };

      Object.assign(sendData, {returnFlight: postData.returnFlight});
      sendData.returnFlight.feeO = feeO;
    }
    let verifyTimer = 0;
    return new Promise((resolve, reject) => {
      $.ajax({
        url: paths.bookVerify(),
        type: 'POST',
        data: JSON.stringify(sendData),
        contentType: 'application/json',
        dataType: 'json',
      }).then((res) => {
        if (res.code == 1) {
          postData.taskToken = res.token;
          intervalVerify(res.token, verifyTimer);
        } else {
          let trackObj = {
            apiMethodName: 'checkCountAndPrice',
            apiRequestParamter: JSON.stringify(sendData),
            apiHttpStatus: 200,
            apiResponseStatus: false,
            // flightWay: 2
          };
          window.hegTrackCallback(trackObj);
          return $.Deferred().reject();
        }
      }).fail(err => {
        let model = {
          title: 'Oops!',
          text: 'Fare or Seat(s) not available with the airline. <br />Redirecting to Search Page...',
          btnTex: 'OK',
          href: null,
        };
        model.href = cookieUtil.getCookie('flightsUrl') ? cookieUtil.getCookie('flightsUrl') : '/';
        let $bookExpire = $('#bookExpire');
        let $bookExpireCon = $bookExpire.find('.modal-content');
        renderView($bookExpireCon, $bookExpireCon.html(), {model});
        $bookExpire.modal('show');
        reject();
      });

      function intervalVerify(token, verifyTimer) {
        // verifyTimer = setInterval(function(){
        $.ajax({
          url:paths.intervalVerify() + '?token=' + token,
          type: 'GET',
          cache: false,
          dataType: 'json',
        })
        .then(function(res){
          if(res.code === 0 || res.code === 1){
            let trackObj = {
              apiMethodName: 'getCheckResult',
              apiRequestParamter: token,
              apiHttpStatus: 200,
              apiResponseStatus: true,
              // flightWay: 2
            };
            window.hegTrackCallback(trackObj);
            if(res.code === 1){
              window.dataLayer.push({
                'event': 'verification_subscribe',
                'gtm.category': 'verification',
                'gtm.action': 'up',
              });
            }
            resolve({
              code: res.code,
              token: res.token
            }); 
            
          }else if(res.code === 9){
            if(verifyTimer > 28){
              if(res.proceed) {
                return resolve({code: 0 }); 
              }else{
                return $.Deferred().reject(res);
              }
            }
            setTimeout(function(){
              verifyTimer ++;
              intervalVerify(token, verifyTimer);
              
            }, 2000);
            
          }else{
            return $.Deferred().reject(res);
          }
        }).fail(function(err){
            let trackObj = {
              apiMethodName: 'getCheckResult',
              apiRequestParamter: token,
              apiHttpStatus: err.status || 200,
              apiResponseStatus: false,
              // flightWay: 2
            };
            window.hegTrackCallback(trackObj);
            
            window.dataLayer.push({
              'event': 'verification_subscribe',
              'gtm.category': 'verification',
              'gtm.action': 'failure',
            });
            
          let model = {
            title:'Oops!',
            text: 'Fare or Seat(s) not available with the airline. <br />Redirecting to Search Page...',
            btnTex:'OK',
            href:null,
          };
          if(err.code === 7){
            model = {
              title:'Session Expired!',
              text: 'Your session has expired. Please click Continue to reload.',
              btnTex:'Continue',
              href:null,
            };
          }
          model.href = cookieUtil.getCookie('flightsUrl') ? cookieUtil.getCookie('flightsUrl') : '/';
          if(!!cookieUtil.getCookie('flightsUrl')){
            localStorage.removeItem(model.href.split('flights/')[1]);
          }
          let $bookExpire = $('#bookExpire');
          let $bookExpireCon = $bookExpire.find('.modal-content');
          renderView($bookExpireCon, $bookExpireCon.html(), {model});
          $bookExpire.modal('show');
          reject(false);
        });
      }
    });
  }
}

function renderView(viewElement, viewHtml, model) {
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}