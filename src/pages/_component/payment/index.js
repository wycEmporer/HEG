import checkForm, { checkBank, checkWallet, checkUPI, checkAgree } from './checkform.js';
import razorpay from './razorApi';
import hdfc from './hdfcAPI.js';
import goldListen from './goldUse.js';
import { Base64 } from 'js-base64';
export {Gold} from './goldUse';
import {Check} from './checkform';

const utils = require('utils');
const cookieUtil = utils.cookieUtil;
const paths = utils.path;
const IS_PROD = (process.env.NODE_ENV === 'production' && !IS_UAT) ? 'PROD' : 'TEST';

class Payment{
  constructor(goldInstance){
    this.payTransactionMap = {};
    this.init();
    this.goldInstance = goldInstance;
  }
  formValidation(payType, $form){
    let channelObj = null;
    if (payType == 1) {
      if (Check.checkForm($form).flag) {
        let formData = Check.checkForm($form).msg;
        channelObj = Object.assign({}, {paymentChannel: payType}, formData);
      }
      
    } else if (payType == 2) {
      if (Check.checkForm($form).flag) {
        let formData = Check.checkForm($form).msg;
        channelObj = Object.assign({}, {paymentChannel: payType}, formData);
      }
      
    } else if (payType == 3) {
      if (Check.checkBank().flag) {
        channelObj = Object.assign({}, {paymentChannel: payType}, {paymentBank: Check.checkBank().msg});
      }
      
    } else if (payType == 4) {
      if (Check.checkWallet().flag) {
        channelObj = Object.assign({}, {paymentChannel: payType}, {paymentWallet: Check.checkWallet().msg});
      }
    } else if (payType == 5) {
      if (Check.checkAgree()) {
        channelObj = Object.assign({}, {paymentChannel: payType});
      }
  
    } else if (payType == 6) {
      if (Check.checkUPI().flag) {
        channelObj = Object.assign({}, {paymentChannel: payType}, {upi_vpa: Check.checkUPI().msg});
      }
      
    } else if (payType == 7) {
      if (Check.checkAgree()) {
        channelObj = Object.assign({}, {paymentChannel: payType});
      }
    }

    this.payTransactionMap[3] = channelObj;
  }
  toPay(){
    let sendParams = {orderId: Base64.encode($('#showOrderId').data('innerId'))};
    if(!this.payTransactionMap[3]) return;
    if(this.goldInstance.isUseGold && this.goldInstance.useGold != 0){
      this.payTransactionMap[4] = {
        tradeType: 4,
        tradeAmount: parseInt(this.goldInstance.useGold)
      };
    }
    sendParams.payTransactionMapEncode = Base64.encode(JSON.stringify(this.payTransactionMap));
    $('#loading').show();
    $.ajax({
      url:'/heg_api/paymentForD.do',
      data: JSON.stringify(sendParams),
      type: 'POST',
      dataType:'json',
      headers:{
        'Content-Type': 'application/json',
        'x-Device': 'pc'
      }
    }).done(res => {
      if(!res.success){
        alert(res.msg);
        location.reload();
        return;
      }
      if(res.code == 1){
        if(res.payWay === 4){
          razorpay(res);
        }else{
          hdfc(res.data, res.submiturl);
        }
      }else if(res.code === 0){
        location.href = res.data.returnUrl;
      }
    }).fail(err => {

    });

  }
  init(){
    let _this = this;
    $('.creditPay').on('click', function(){
      let payType = $(this).attr('index');
      let $form = $(this.form);
      _this.formValidation(payType, $form);
      _this.toPay();
    });
  }
}

function getPaymentChannel(){
  $.ajax({
    url:'/heg_api/queryPaymentChannel.do',
    type: 'GET',
    dataType: 'json',
    headers: {'x-Device': 'PC'}
  })
  .done(res => {
    if(res.success){
      res.channel.forEach((v, i) => {
        switch (v.id) {
          case 1:
            showChannelObj.credit();
            break;
          case 2:
            showChannelObj.debit();
            break;
          case 3:
            showChannelObj.netBank(v.bankList);
            break;
          case 4:
            showChannelObj.wallet(v.walletList);
            break;
          case 5:
           showChannelObj.emi();
            break;
          case 6:
            showChannelObj.upi();
            break;
          case 7:
            showChannelObj.paypal();
            break;
        }
      });
    }else{
      alert(res.msg);
    }
  }).fail(err => {
    alert('status '+err.status);
  }); 
}
const showChannelObj = {
  credit(){
    $('#accordion .panel').eq(0).removeClass('hidden');
  },
  debit(){
    $('#accordion .panel').eq(1).removeClass('hidden');
  },
  netBank(bankList){
    $('#accordion .panel').eq(2).removeClass('hidden');
    let hotHtmlArr =bankList.filter(val => {
      return !!val.bankpic;
      // <b class="bankIcon ${val.bankName}"></b>
    }).map(val => `<li class="pull-left marL10">
    <label>
        <input type="radio" name="bankid" value="${val.id}">
        <img src="${val.bankpic}">
      </label>
    </li>`);
    $('#bankType .bankList ul').html(hotHtmlArr.join(' '));

    let htmlArr = bankList.map(val => `<option value="${val.id}">${val.bankName}</option>`);
    
    $('#bankType .otherList select').html(htmlArr.join(' '));
  },
  wallet(walletList){
    $('#accordion .panel').eq(3).removeClass('hidden');
    let htmlArr = walletList.map(val => (`<li class="pull-left marL10">
    <label>
      <input type="radio" name="walletid" data-id="${val.id}">
      <img src="${val.bankpic}">
    </label>
    </li>`));
    $('#walletType .bankList ul').html(htmlArr.join(' '));
  },
  emi(emiList){
    $('#accordion .panel').eq(4).removeClass('hidden');
  },
  upi(){
    $('#accordion .panel').eq(5).removeClass('hidden');
  },
  paypal(){
    $('#accordion .panel').eq(6).removeClass('hidden');
  }
};

export async function created(getOrderDetial, goldInstance){
  // let uuid = await nativeMods.getNativeUuid();
  // CookieUtil.removeItem('uuid');
  // CookieUtil.setItem('uuid', uuid);
  getOrderDetial(goldInstance);
  const payment = new Payment(goldInstance);
  getPaymentChannel();
}

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