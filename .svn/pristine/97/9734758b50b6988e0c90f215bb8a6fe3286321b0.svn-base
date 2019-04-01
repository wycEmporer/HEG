import checkForm, {
  checkBank,
  checkWallet,
  checkUPI,
  checkAgree
} from './checkform.js';
import cashfree from './cashfreeAPI.js';
import hdfc from './hdfcAPI.js';
import goldListen from './goldUse.js';
const utils = require('utils');
const cookieUtil = utils.cookieUtil;
const paths = utils.path;
const IS_PROD = (process.env.NODE_ENV === 'production' && !IS_UAT) ? 'PROD' : 'TEST';

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
let $bankList = $('#bankType .bankList ul');
$.ajax({
  url: paths.getBankAndWallets(),
  type: 'GET',
  dataType: 'JSON',
  cache: true
}).then(res => {
  if (res.success) {
    let $otherList = $('#bankType .otherList select');
    let html = '',
      otherHtml = '<option value="0">Choose your bank</option>',
      hotBank = [{
          bankName: 'hdfc',
          id: 21
        },
        // {
        //   bankName: 'sbi',
        //   id: 31
        // },
        {
          bankName: 'kotak',
          id: 40
        },
        {
          bankName: 'icici',
          id: 22
        },
        {
          bankName: 'axis',
          id: 13
        },
        {
          bankName: 'yes',
          id: 38
        },
      ];
    hotBank.forEach((val, key) => {
      html += `<li class="pull-left marL10">
          <label>
            <input type="radio" name="bankid" value="${val.id}">
            <b class="bankIcon ${val.bankName}"></b>
          </label>
        </li>`;
    });
    res.Banks.forEach((val, key) => {
      otherHtml += `<option value="${val.id}">${val.bankName}</option>`;

    });
    $bankList.html(html);
    $otherList.html(otherHtml);

    let $walletList = $('#walletType .bankList ul');
    let wallethtml = '';
    res.wallets.forEach((val, key) => {
      wallethtml += `<li class="pull-left marL10">
          <label>
            <input type="radio" name="walletid" data-id="${val.id}">
            <b class="bankIcon ${val.walletName}"></b>
          </label>
        </li>`;
    });
    $walletList.html(wallethtml);
  }
});

$('.creditPay').on('click', function () {
  let _this = this;
  let payTransactionMap = {};
  let sendParams = {orderId: $('#showOrderId').data('innerId'), };
  let url;
  url = paths.paymentUrl();
  var payType = $(this).attr('index');
  if (payType == 1) {
    if (!checkForm($(this.form)).flag) {
      return false;
    }
    let formData = checkForm($(this.form)).msg;
    payTransactionMap[3] = Object.assign({}, {paymentChannel: payType}, formData);
  } else if (payType == 2) {
    if (!checkForm($(this.form)).flag) {
      return false;
    }
    let formData = checkForm($(this.form)).msg;
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

  $(this).addClass('progress-dynamic');
  $(this).attr('disabled', 'disabled');

  Object.assign(sendParams, {payTransactionMap});

  $.ajax({
    url: url,
    data: JSON.stringify(sendParams),
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    headers: {'x-Device': 'PC'}
  }).then(function (res) {
    if (res.code === 1) {
      $(_this).removeClass('progress-dynamic');
      $(_this).removeAttr('disabled', 'disabled');
      if (res.payWay === 1) {
        cashfree(payType, res.data);
      } else if (res.payWay === 2) {
        hdfc(res.data);
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
    } else {
      return $.Deferred().reject(res);
    }
  }).fail(function (error) {
    
    console.log(error);
  });
});