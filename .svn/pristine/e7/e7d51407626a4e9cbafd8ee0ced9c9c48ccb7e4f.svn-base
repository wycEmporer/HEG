const utils = require('utils');
const paths = utils.path;

export class Coupon {
  constructor(type, value, couponCode, viaCouponDis) {
    this.type = type;
    this.value = value; // minus
    this.viaCouponDis = viaCouponDis;
    this.couponMap = {
      tradeType: 1,
      tradeAmount: Math.abs(value),
      config: { k1: couponCode }
    };
  }
  static getCoupon(postData) {
    return new Promise((resolve, reject) => {
      if (postData.couponCode == '' || postData.couponCode == undefined) {
        reject('coupon not found');
      }
      const {
      couponCode, type: productType, travellers: orderNumber 
      } = postData;
      let flightFromRequestList = [];
      postData.itineraryArray.forEach((val, key) => {
        flightFromRequestList.push({
          type: key + 1,
          aircompany: val.al,
          flightNumber: val.flightId,
          startDate: val.dt,
          CabinClass: '',
          bst: val.fee.bfp,
          gst: val.fee.gst
        });
      });
      const queryData = {
        couponCode,
        totalPrice: postData.fee.oopr,
        orderNumber,
        tripType: postData.itineraryArray.length,
        productType,
        deviceType: 1, // 1:pc , 2:msite, 3:android, 4: ios
        countryType: Number(postData.isIntl), //0 domestic, 1 internationnal;
        device: 'PC',
        flightFromRequestList
      };
      $.ajax({
        url: paths.getCouponValue(),
        type: 'POST',
        data: JSON.stringify(queryData),
        headers: { 'x-Device': 'PC' },
        dataType: 'json',
        contentType: 'application/json'
      })
        .done(res => {
          let trackObj = {
            apiMethodName: 'GetCoupon',
            apiRequestParamter: JSON.stringify(queryData),
            apiHttpStatus: '200',
            apiResponseStatus: res.success,
            elementId: 'applyCoupon'
          };
          window.hegTrackCallback(trackObj);
          
          if (!res.success) {
            return reject(res.message);
          }
          let viaCouponDis = res.data.use ? res.data.discountMost : undefined;
          return resolve(new Coupon(1, -res.data.totalPrice, couponCode, viaCouponDis));
        })
        .fail(err => {
          let trackObj = {
            apiMethodName: 'GetCoupon',
            apiRequestParamter: JSON.stringify(queryData),
            apiHttpStatus: err.status,
            apiResponseStatus: null,
            elementId: 'applyCoupon'
          };
          window.hegTrackCallback(trackObj);
          return reject('The request timed out. Please try again.');
        });
    });
  }
  static getCoupon1(postData) {
    return new Promise((resolve, reject) => {
      // let couponCode = $('.coupon-code input').val();
      if (postData.couponCode == '' || postData.couponCode == undefined) {
        reject('coupon not found');
      }
      var isInternational = postData.isIntl ? 2 : 1;
      var productType = postData.type;
      $.ajax({
        url: paths.couponQueryUrl(postData.couponCode.toUpperCase() + '&isInternational=' + isInternational + '&productType=' + productType),
        type: 'GET',
        headers: { 'x-Device': 'PC' },
        dataType: 'json'
      })
        .done(coupon => {
          if (!coupon && !(coupon.v3 == 1)) {
            reject('coupon is invalid');
            return;
          }
          let off = 0;
          let viaCouponDis = 0;
          postData.itineraryArray.forEach((value, key) => {
            let cbfp = postData.fee.bfp;
            let total = postData.fee.disPrice + postData.fee.cf;
            let v8 = coupon.v8 || 10000000;
            let v9 = coupon.v9 || 0;
            coupon.k8 = coupon.k8 || 100000;
            if (total >= coupon.v9 && total <= v8) {
              if (cbfp > (coupon.v6 || 0) && (coupon.k2 == '*' || coupon.k2.indexOf(value.al) > -1)) {
                if (coupon.k8 && postData.fee.discount - coupon.k8 > 0) {
                  viaCouponDis = coupon.k8;
                }

                coupon.k7 = coupon.k7 || -10000000;
                let eachOff = -Math.floor(coupon.v4 == 1 ? (cbfp * coupon.v1Int) / 100 - coupon.v2Int * postData.travellers : (cbfp * coupon.v1Int) / 100 - coupon.v2Int);
                let upOff = coupon.v4 == 1 ? coupon.k7 * postData.travellers : coupon.k7 * 1;
                off += Math.abs(eachOff) <= Math.abs(upOff) ? eachOff : upOff;
              }
            }
          });
          resolve(new Coupon(coupon.k5, off, coupon.k1, viaCouponDis));
        })
        .fail(err => reject(err));
    });
  }
}
