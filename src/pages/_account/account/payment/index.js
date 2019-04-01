import checkForm, {
  checkBank,
  checkWallet,
  checkEMI,
  checkUPI,
  checkAgree
} from './checkform.js';
import cashfree from './cashfreeAPI.js';
import hdfc from './hdfcAPI.js';
import goldListen from './goldUse.js';
import razorpay from './razorpay';
import './payment.less';

export {getPaymentChannel} from './paymentChannel';
require('./jquery.base64');

const utils = require('utils');
const cookieUtil = utils.cookieUtil;
const paths = utils.path;
const IS_PROD = (process.env.NODE_ENV === 'production' && !IS_UAT) ? 'PROD' : 'TEST';
export const SetPayment = {
  _renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  },
  renderPeople(postData) {
    let travellerModel = {
      psrList: postData.flightPsrList,
      contactInfo: postData.contact,
    };
    this._renderView($('#travellerInfo'), $('#travellerInfoTpl').html(), {model: travellerModel});
  },

  renderPayment(postData) {
      let bankList =  (_.find(postData.paymentChannel.channel, val => val.id == 3) || {}).bankList || [];
      let hotBank = bankList.filter(val => !!val.bankpic);
      let walletList = (_.find(postData.paymentChannel.channel, val => val.id == 4) || {}).walletList || [];
      let paymentModel = {
      fee: {
        // "Base fare": postData.fee.obfp,
        // "Taxes & fees": postData.fee.ogst,
        'Customer Prom.': postData.fee.totalDis,
        'Convenience fee': postData.fee.cf,
      },
      hasUseGold: postData.hasUseGold,
      exTime: postData.exTime,
      payPrice: postData.fee.totalPrice + postData.fee.cf,
      isLogin: postData.isLogin,
      goldBalance: postData.happyGoldBalance,
      returnCash: postData.returnCash,
      useHappyGold: postData.useHappyGold,
      isNewPay: postData.isNewPay,
      paymentChannel: postData.paymentChannel.channel,
      paymentNote: postData.paymentChannel.content,
      bankList,
      hotBank,
      walletList,
      UnCFView: postData.UnCFView,
      orderId :postData.orderId
      // hasVerifiedOtp: postData.hasVerifiedOtp,
      // hasPhone: postData.hasPhone,
      // otpMob: cookieUtil.getCookie('phone'),
    };
    this._renderView($('#paymentInfo'), $('#paymentInfoTpl').html(), {model: paymentModel});
    this._listenBtns(postData);

    $('#CreditType,#DebitType').on('keyup', '.c_num', function() {
      var $this = $(this);
      var v = $this.val();
      $this.val(v.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, '$1 '));
    });

    $('#CreditType,#DebitType').on('keyup blur', '.c_cvv', function(e) {
      this.value = this.value.replace(/[^0-9]+/g, '');
    });
  },
  _listenBtns(postData) {
    let thisPayment = this;
    // gold listen
    if (postData.isLogin) {
      goldListen(postData);
    }

    // payment btn
    $('#creditPay').on('click', function () {
      let _this = this;
      let payTransactionMap = {};
      let sendParams = {
        orderId: postData.orderId,
        dataKey:postData.dataKey || null
      };
      let url;
      let bookExpireObj = {
        title: 'Oops!',
        text: 'Fare or Seat(s) not available with the airline. <br />Redirecting to Search Page...',
        btnTex: 'OK',
        href: null,
      };
      if (postData.isNewPay) {
        url = paths.paymentHUrl();
        if(!$('#payTypes').hasClass('hidden')){
          var payType = $(this).attr('index'); 
          if (payType == 1) {
            if (!checkForm($('#CreditType').find('form')).flag) {
              return false;
            }
            let formData = checkForm($('#CreditType').find('form')).msg;
            payTransactionMap[3] = Object.assign({}, {paymentChannel: payType}, formData);
          } else if (payType == 2) {
            if (!checkForm($('#DebitType').find('form')).flag) {
              return false;
            }
            let formData = checkForm($('#DebitType').find('form')).msg;
            payTransactionMap[3] = Object.assign({}, {paymentChannel: payType}, formData);
          } else if (payType == 3) {
            if (!checkBank().flag) {
              return false;
            }

            payTransactionMap[3] = Object.assign({}, {paymentChannel: payType}, {paymentBank: checkBank().msg});
          } else if (payType == 4) {
            if (!checkWallet().flag) {
              return false;
            }
            payTransactionMap[3] = Object.assign({}, {paymentChannel: payType}, {paymentWallet: checkWallet().msg});
          } else if (payType == 5) {
            if (!checkAgree()) return false;
            payTransactionMap[3] = Object.assign({}, {paymentChannel: payType});
          } else if (payType == 6) {
            if (!checkUPI().flag) {
              return false;
            }
            payTransactionMap[3] = Object.assign({}, {paymentChannel: payType}, {upi_vpa: checkUPI().msg});
          } else if (payType == 7) {
            if (!checkAgree()) return false;
            payTransactionMap[3] = Object.assign({}, {paymentChannel: payType});
          }
          $('body').append('<div class="payMask" style="width: 100%;height: 100%;top: 0px;position: absolute;background-color: rgb(0, 0, 0);opacity: 0.5;z-index:1000">');
        }
      } else {
        if (!checkAgree()) return false;
        url = paths.paymentOldUrl();
      }

      $(this).addClass('progress-dynamic');
      $(this).attr('disabled', 'disabled');

      if (postData.isUseGold) {
        payTransactionMap[4] = postData.goldInfo;
      }
      if (postData.isNewPay && !postData.hotelPayApi) {
        sendParams.payTransactionMapEncode = $.base64.encode(JSON.stringify(payTransactionMap));
        sendParams.orderId = $.base64.encode(sendParams.orderId);
      }else {
         Object.assign(sendParams, {payTransactionMap});
      }
      // Object.assign(sendParams, {payTransactionMap});
      $.ajax({
        url: postData.hotelPayApi || url,
        data: JSON.stringify(sendParams),
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        headers: {'x-Device': 'PC'}
      }).then(function (res) {
        try{
          let trackObj = {
            apiMethodName: 'payment',
            apiRequestParamter: JSON.stringify(sendParams),
            apiHttpStatus: '200',
            apiResponseStatus: res.success,
            elementId: ''
          };
          window.hegTrackCallback(trackObj);
        }catch(e){}
        if (res.code === 1) {
          $(_this).removeClass('progress-dynamic');
          $(_this).removeAttr('disabled', 'disabled');
          if (postData.isNewPay) {
            if(res.payWay === 4){
              razorpay(res);
            }else{
              hdfc(res.data, res.submiturl);
            }
          } else {
            (function (data) {
              var callback = function (event) {
                var eventName = event.name;
                switch (eventName) {
                  case 'PAYMENT_REQUEST':
                    console.log(event.message);
                    break;
                  default:
                  console.log(event.message);
                }
              };
              var config = {};
              config.layout = {
                view: 'popup',
                width: '650'
              };
              config.mode = IS_PROD; //use PROD when you go live
              var response = CashFree.init(config);
              if (response.status == 'OK') {
                CashFree.makePayment(data, callback);
              } else {
                //handle error
                console.log(response.message);
              }
            })(res.msg);
          }
        } else if (res.code === 0) {
          // $(_this).removeClass('progress-dynamic');
          location.href = paths.returnUrl(postData.orderId);
        } else if (res.code === 2) {
          $(_this).removeClass('progress-dynamic');
          $(_this).removeAttr('disabled', 'disabled');
          let passInput = $('#paymentInfo input[name=password]');
          // passInput.addClass('inputError');
          passInput.next().removeClass('hidden').text('Password is not correct ');
        } else if (res.code === 6) {
          $('#paymentInfo input[name=otp]').next().text(res.msg).removeClass('hidden');
          $(_this).removeClass('progress-dynamic');
          $(_this).removeAttr('disabled', 'disabled');
          return;
        } else if (res.code === 10) {
          $(_this).removeClass('progress-dynamic');
          $(_this).removeAttr('disabled', 'disabled');
          $('.payMask').addClass('hide');
          let passInput = $('.checkError10');
          passInput
            .removeClass('hidden')
            .text(res.msg);
        }else if (res.code === 7) {
          alert(res.msg);
          return;
        } else {
          return $.Deferred().reject(res);
        }
      }).fail(function (error) {
        try{
          let trackObj = {
            apiMethodName: 'payment',
            apiRequestParamter: JSON.stringify(sendParams),
            apiHttpStatus: error.status || '200',
            apiResponseStatus: false,
            elementId: 'creditPay'
          };
          window.hegTrackCallback(trackObj);
        }catch(e){}
        let model = Object.assign({}, bookExpireObj);
        model.href = cookieUtil.getCookie('flightsUrl') ? cookieUtil.getCookie('flightsUrl') : '/';
        let $bookExpire = $('#bookExpire');
        let $bookExpireCon = $('#bookExpire').find('.modal-content');
        thisPayment._renderView($bookExpireCon, $('#bookExpireTpl').html(), {model});
        $bookExpire.modal('show');
      });
    });
    
    $('#paymentInfo a[data-toggle="tab"]').on('show.bs.tab', function(e) { 
      let index = $(e.target).attr('index');
      $('#creditPay').attr('index', index);
    });
    
    $(document).on('change', '#bankType .otherList select', function () {
      var id = this.value;
      var $radio = $('#bankType .bankList input[value=' + id + ']');
      if ($radio.length == 0) {
        $('#bankType .bankList input').prop('checked', false);
      } else {
        $radio.prop('checked', true);
      }
    });
    $(document).on('click', '#bankType .bankList input[type=radio]', function () {
      var id = this.value;
      $('#bankType .otherList select option[value=' + id + ']').prop('selected', true);
    });

    $(document).on('click', 'input[name=bankid], input[name=walletid], .otherList select', function(){
      let content = $(this).data('content') || '';
      $(this).parents('.bankWrap').next('.pay-way-channel_notice').text(content);
    });
  }

};