const utils = require('utils');
let queryObj = utils.parseQueryStr();
export default function(coupon, value){
  let off = 0;
  let cbfp = value.fee.cbfp;
  if(coupon){
    coupon.k8 = coupon.k8 || 100000;
    let total = value.tripType == 0 ? cbfp + value.fee.gst + coupon.cf.ocf : value.orderTotal + coupon.cf.rcf;
    if(!((coupon.v8 || coupon.v9) && (!total || total && (total > (coupon.v8 || 10000000) || total < (coupon.v9 || 0))))){

      if((coupon.v3 == 1 && cbfp > coupon.v6) && (coupon.k2 == '*' || coupon.k2.indexOf(value.al) > -1 )){

        if(coupon.k8){
          if(value.tripType == 0 && value.fee.hDt - coupon.k8 > 0){
            value.viaCouponDis = coupon.k8;

          }else if(value.tripType == 1 && value.orderHdt - coupon.k8 > 0){
            value.viaCouponDis = coupon.k8 / 2;
          }
        }

        let pCount = parseInt(queryObj.adults || 1) + parseInt(queryObj.childs || 0) + parseInt(queryObj.baby || 0);
        coupon.k7 = coupon.k7 || -10000000;
        let couponOff = Math.ceil(coupon.v4 == 1 ? - cbfp * coupon.v1Int / 100 + coupon.v2Int * pCount : -cbfp * coupon.v1Int/100 + coupon.v2Int);
        let upOff = coupon.v4 == 1 ? coupon.k7 * pCount : coupon.k7 * 1;
        off = Math.abs(couponOff) <= Math.abs(upOff) ? couponOff : upOff;
      }
    }
  }else{
    value.viaCouponDis = 0;
  }

  value.fee.dirOff = off;
  return off;

}