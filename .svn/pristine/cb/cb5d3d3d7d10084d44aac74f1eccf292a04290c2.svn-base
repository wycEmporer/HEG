require('cp');
const utils = require('utils');
require('./content.less');
const queryObj = utils.parseQueryStr();
const accountPath = utils.accountPath;
import './payment/index';

// if(queryObj.paytype == 3){
//   var url = paths.paymentO();
//   var sendParams = {
//     id: queryObj.id
//   };
// }else{
//   var url = paths.paymentOldUrl();
//   var sendParams = {
//     orderId: queryObj.orderId
//   };
// }
$.getJSON(accountPath.tripDetailUrl('orderId=' + queryObj.orderId + '&phoneNo=' + queryObj.phoneNo))
.done(function(res){
  if(res.code == 0){
    $('#showAmount').text('Amount:INR' + res.data.order.fee.pp.toThree());
  }else{
    $('#showAmount').text('Message:' + res.message);
    $('.cont').addClass('hidden');
  }
}).fail(res => {
  $('#showAmount').text('Message: status ' + res.status);
  $('.cont').addClass('hidden');
});
$('#showOrderId').text(queryObj.orderId).data('innerId', queryObj.orderId);
