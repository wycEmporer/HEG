//google tag manage
export function dataLayer(postData){
  var dataLayer = {
    'transactionId': postData.orderId,
   'transactionAffiliation': '',
   'transactionTotal': postData.fee['Grand Total'],
   'transactionTax': postData.fee['Taxes & Fees'],
   'transactionProducts': [],
   'transactionShipping': Math.abs(postData.payD.HappyGold || 0),
  };
  $.each(postData.triplist, function(key, value){
    var obj = {
      sku:value.voyageinfo[0].fn + '-' + value.voyageinfo[0].dOrigin,
      name:value.voyageinfo[0].ds,
      category:'',
      price:(value.fare['Base Fare'] + value.fare['Taxes and Fees']) / value.travellerinfo.length,
      quantity:value.travellerinfo.length
    };
    $.each(value.voyageinfo, function(i, val){
      obj.name += ('-' + val.as);
      obj.category += val.fn.slice(0, 2) + '/';
    });
    dataLayer.transactionProducts.push(obj);
  });

  window.dataLayer.push(dataLayer);
}