import { SetPayment, getPaymentChannel } from '../payment/index';

const { accountPath } = require('utils');
export function hotelDetail(id, phoneNo, email) {
  let url = phoneNo ? `${accountPath.getHotelDetailUnlogin()}?bookingNo=${id}&contactNumber=${phoneNo}&email=${email}` : `${accountPath.getHotelDetail()}?bookingNo=${id}`;
  $.ajax({
    url: url, 
    type: 'GET',
    dataType: 'json'
  }).then(data => {
      const status = {
        1: 'Pay',
        2: 'Pending',
        3: 'Confirmed',
        4: 'Completed',
        5: 'Canceled',
        6: 'Canceled',
        7: 'Canceled',
        8: 'Canceled',
        9: 'Pay',
        10: 'Pending',
        11: 'Pending',
        12: 'Pending',
        13: 'Pending',
        14: 'Pending',
        15: 'Pending',
        16: 'Canceled',
        17: 'Pending'
      };
      const btnColor = {
        1: 'warnbg',
        2: '',
        3: '',
        4: 'graybg',
        5: 'graybg',
        6: 'graybg',
        7: 'graybg',
        8: 'graybg',
        16: 'graybg',
      };
      const  payWay = {
        1: 'Credit card',
        2: 'Debit card',
        3: 'Net banking',
        4: 'Mobile Wallet',
        5: 'EMI',
        6: 'UPI',
        7: 'Paypal',
      };
      const weekArray = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'];
      const d = new Date(Number(data.orderTime));
      var offset = d.getTimezoneOffset() * 60000;
      var IndiaTime = d.getTime() + offset + 3600000 * 5.5;
      const date = new Date(IndiaTime);

      data.orderYear = date.getFullYear();
      data.orderMonth = (date.getMonth() + 101).toString().slice(1);
      data.orderDate = (date.getDate() + 100).toString().slice(1);
      data.orderWeek = weekArray[date.getDay()];
      data.priceObj = JSON.parse(data.prviceDate);
      data.cancelInfo = JSON.parse(data.cancel);
      data.stayin = JSON.parse(data.stayin);
      data.statusStr = status[data.status];
      data.statusClass = btnColor[data.status];
      data.payWayStr = payWay[data.payWay] || '';
      data.checkIn = $.formatStr(data.checkInDate.slice(0, 10).replace(/-/g, '/'));
      data.checkOut = $.formatStr(data.checkOutDate.slice(0, 10).replace(/-/g, '/'));
      data.countDays = $.countDays(data.checkOutDate, data.checkInDate);
      data.guestArr = data.contactInfo.contacts;
      data.contact = data.contactInfo.call + ' ' + data.contactInfo.firstName + ' ' + data.contactInfo.lastName;
      data.breakfastStr = data.withBreakFase == 'true' ? '(Free breakfast)' : '';
      renderView(viewElement, viewHtml, { model: data }, loadPayment);

  });
  var viewElement = $('#rightside');
  viewElement.html($('#loadingTpl').html());
  var viewHtml = $('#h_detail_template').html();
}
function renderView(viewElement, viewHtml, model, callback) {
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
  callback(model.model);
}

function loadPayment(model){
  if(model.status == 1){
    var d = new Date(Number(model.orderTime) + 3600000);
    var offset = d.getTimezoneOffset() * 60000;
    var IndiaTime = d.getTime() + offset + 3600000 * 5.5;
    var exTime = new Date(IndiaTime).toString().replace(/(GMT|UTC).*/, '');

    var payData = {
      fee:{
        cf: 0,
        totalDis: 0,
        totalPrice: model.price,
      },
      hasUseGold: 0,
      exTime: exTime,
      happyGoldBalance: 0,
      isLogin: false,
      orderId: model.bookingNo,
      isUseGold: false,
      goldInfo: {},
      useGold: null,
      useHappyGold: 0,
      isNewPay: true,
      hotelPayApi: '/api/web/pay',
      UnCFView: true,
      dataKey: model.cancelInfo.dataKey
    };
    getPaymentChannel().then(res => {
      SetPayment.renderPayment(Object.assign(payData, {paymentChannel:res}));
    }).catch(err => {
      SetPayment.renderPayment(Object.assign(payData, {paymentChannel:[]}));
    });
  }
}
