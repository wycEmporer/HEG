require('cp');
const utils = require('utils');
require('./content.less');
const queryObj = utils.parseQueryStr();
const accountPath = utils.accountPath;
import { Gold, created } from 'pagesDir/_component/payment/index';

const goldInstance = new Gold();

function  getOrderDetial(goldInstance){
  $.post('/heg_api/paymentForDGetAmount.do?id='+ queryObj.id)
  .done(function(res){
    if(res.success){
      $('#showAmount').text('Amount:INR' + res.data.toThree());
      goldInstance.getGoldAndPayAmount(res.data);
    }else{
      $('#showAmount').text('Message:' + res.meg);
      $('.cont').addClass('hidden');
    }
  });
}

created(getOrderDetial, goldInstance);

$('#showOrderId').text(queryObj.orderId).data('innerId', queryObj.id);
