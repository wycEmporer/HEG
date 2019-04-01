//google tag manage
export function dataLayer(postData) {
  var dataLayer = {
    'transactionId': postData.orderId,
    'transactionAffiliation': '',
    'transactionTotal': postData.fee.disPrice + postData.fee.off + postData.fee.cf,
    'transactionTax': postData.fee.gst,
    'transactionProducts': [],
    'transactionShipping': postData.useGold || 0,
  };
  $.each(postData.itineraryArray, function (key, value) {
    var obj = {
      sku: value.fn + '-' + value.dt,
      name: value.ds,
      category: '',
      price: (value.fee.bfp + value.fee.gst) / postData.flightPsrList.length,
      quantity: postData.flightPsrList.length
    };
    $.each(value.stopByFlightArray, function (i, val) {
      obj.name += ('-' + val.as);
      obj.category += val.fn.slice(0, 2) + '/';
    });
    dataLayer.transactionProducts.push(obj);
  });

  window.dataLayer.push(dataLayer);
  window.uetq = window.uetq || [];
  window.uetq.push ('event', 'click', {
  'event_category': 'Payment', 'event_label': 'CreditPay', 'event_value': ''
  }); 
  window.fb = {totalprice: dataLayer.transactionTotal};

  $('#createorder').click();
}