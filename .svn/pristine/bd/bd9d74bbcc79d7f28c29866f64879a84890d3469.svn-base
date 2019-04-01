export default function(postData){
  let pers = {
    adults: postData.requestFromClient.adults || 0,
    childs: postData.requestFromClient.childs || 0,
    baby: postData.requestFromClient.baby || 0,
  };
  let travellers = pers.adults + pers.childs + pers.baby;
  let itineraryArray = [postData.departFlight];
  if(postData.returnFlight){
    itineraryArray.push(postData.returnFlight);
  }
  let flightDates = [];
  // let totalGst = 0, totalObfp = 0, goldback = 0;
  const fee = {
    gst: 0,
    obfp: 0,
    bfp: 0,
    opr: 0,
    cf:0,
    off:0,
    ogst: 0,
    fees:[],
    insurePr: postData.fee.insurePr || 0,
    viaCouponDis: undefined,
    withInsureDiscount: postData.fee.withInsureDiscount || 0,  // minus
    tdis: postData.fee.tdis || 0,  // minus
    get verifyPr(){
      return this.bfp + this.gst;
    },
    get disPrice(){
      return postData.returnCash ? this.obfp + this.ogst : (this.viaCouponDis != undefined ?  this.obfp + this.ogst - this.viaCouponDis : this.bfp + this.gst);
    },
    get goldback(){
      return this.obfp + this.ogst - this.bfp - this.gst;
    },
    get oopr(){
      return this.ogst + this.obfp;
    },
    // with coupon or silver discount off
    get totalDis(){
      return this.disPrice - this.oopr + this.off + this.withInsureDiscount; // minus
    },
    get discount(){
      return this.oopr - this.disPrice - this.withInsureDiscount; //positive 
    },
    get outCouDis(){
      return this.disPrice - this.oopr; // minus
    },
    // with coupon or silver discount off and withInsureDiscount;
    get totalPrice(){
      return this.disPrice + this.off + this.insurePr + this.tdis;
    }
  };
  //opr old price include cbfp + gst
  itineraryArray.forEach(function(val, i){
    fee.gst += val.fee.gst;
    fee.bfp += val.fee.bfp;
    fee.obfp += val.fee.obfp;
    fee.opr += val.opr;
    fee.cf += val.fee.cf;
    fee.ogst += val.fee.ogst;
    fee.fees = val.fee.fees;
    val.primaryDDate = $.formatStr(val.dt.replace(/\s.*/, ''));
    val.primaryADate = $.formatStr(val.at.replace(/\s.*/, ''));
    // val.fee.r = val.fee.refundable ? 'Refundable' : 'Non-refundable';
    val.stopByFlightArray.forEach(function(value, key){
      value.dti = value.dti || ' ';
      value.dd = value.dt.replace(/\s.*/, '');
      // used for verify birth
      flightDates.push(value.dd.replace(/\//g, '-'));
      value.ad = value.at.replace(/\s.*/, '');
      value.ddate = $.formatStr(value.dd);
      value.adate = $.formatStr(value.ad);
      value.dtime = value.dt.replace(/.*\s/, '');
      value.atime = value.at.replace(/.*\s/, '');
      value.dyear = value.dt.slice(0, 4);
      value.ayear = value.at.slice(0, 4);
      value.durTime = $.countTime(value.dt, value.at);
    });
  });
  let totalPrice = fee.totalPrice;
  let disPrice = fee.disPrice;
  Object.assign(postData, {
pers, travellers, flightDates, itineraryArray, fee, totalPrice, disPrice
}, {payTransactionMap: {}});
  return postData;
}