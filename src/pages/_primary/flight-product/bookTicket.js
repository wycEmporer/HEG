const utils = require('utils');
const paths = utils.path;
export const bookTicket = function(index, type, flightObj, queryObj, token) {

  var mergeData = [flightObj];
  var sendData = {};

  // 0 depart,1 return;
  for (var i = 0; i < mergeData.length; i++) {
    let name = i == 0 ? 'departFlight' : 'returnFlight';
    let flightData = mergeData[i];
    let fee = flightData.fee.fees[index];
    sendData[name] = flightData;
    sendData[name].feee = {
      feeStr: flightData.feee.feeStr,
      feeStrings: [flightData.feee.feeStrings[index]]
    };

    // type 1:common, 2:silver, 3:cashback, 4 special cashback
    if (type === 3 || type === 4) {
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
    } else if (type === 2) {
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
    sendData.type = type;
  }
  sendData.token = token;
  sendData.requestFromClient = queryObj;
  sendData.returnCash = type == 3;
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
        window.location.href = '/booking/' + '?token=' + result.token + coupon + track;
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