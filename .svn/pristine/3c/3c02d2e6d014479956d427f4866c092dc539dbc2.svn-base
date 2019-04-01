// al is needed
import {newQueryStr} from '../flightQuery.js';

const queryObj = newQueryStr();

var flightModel = function(data){
  var tempObj = {};
  var rtempObj = {};
  var discountInfo = data.x.props;
  var minPrice = discountInfo.minPrice;
  var cityMap = data.x.airports;
  var airlinesMap = data.x.airlines;
  // let mergeData = data.departFlightArray.concat(data.returnFlightArray || []);
  data.airlineNames = {};
  data.couponCode = queryObj.c ? queryObj.c : '';
  let filterLine = new RegExp(queryObj.airline, 'i');
  let tripType = queryObj.tripType;
  let pCount = parseInt(queryObj.adults || 1) + parseInt(queryObj.childs || 0) + parseInt(queryObj.baby || 0);
  /* delete 11-13
    // create airlines obj from first flight;
     $.each(mergeData, function(i, val){
      data.airlineNames[val.al] = airlinesMap[val.al].n;
       val.tripType = tripType;
     });
  */
  // for(var i = 0; i < mergeData.length; i++){
  //   data.airlineNames[mergeData[i].al] = mergeData[i].co;
  //   if(!filterLine.test(mergeData[i].al)){
  //     mergeData.splice(i--, 1);
  //   }
  // }
  
  // delete data.airlineNames['2T'];
  for(var i = 0; i < data.departFlightArray.length; i++){
    var val = data.departFlightArray[i];
    // create airlineName obj according to flight val;
    data.airlineNames[val.al] = airlinesMap[val.al].n;
    val.tripType = tripType;
    val.isIntl = data.isIntl || false;
    // delete 2T airline
    // if(val.al == '2T' || !filterLine.test(val.al)) return true;
    var isHideMinPr = false;
    val.aln.split('/').forEach(element => {
      if((data.x.opa).indexOf(element) > -1){
        isHideMinPr = true;
      } 
    });
    val.isHideMinPr = isHideMinPr;
    // val.isHideMinPr = (data.x.opa || ['SG', 'G8', '6E', '9W,', 'UK']).indexOf(val.al) > -1;

    let insureFeeArr = [].concat.apply([], val.fee.fees.map(item => item.exFee || [])) ;

    val.minPriceObj = _.min(val.fee.fees.concat(insureFeeArr), n => n.bfp + n.gst);

    // val.minPriceObj = insurePr && ((minPriceObj.bfp + minPriceObj.gst) > insurePr) ? val.fee.fees[0].exFee[0] : minPriceObj;
    
    val.fee.fees.forEach(function(fee, key){
      if(fee.type === 2){
        val.fee.sdis = fee.sdis;
      }
      if(fee.type === 1){
        val.fee.instantKey = key;
      }
    });
    // add co:airlines fullname; da:derpart airport;... 
    val.co = airlinesMap[val.al].n;
    val.da = cityMap[val.ds].n;
    val.dc = cityMap[val.ds].l;
    val.ac = cityMap[val.as].l;
    val.aa = cityMap[val.as].n;
    for(var j = 0; j < val.stopByFlightArray.length; j++){
      var childVal = val.stopByFlightArray[j];
      childVal.co = airlinesMap[childVal.al].n;
      childVal.da = cityMap[childVal.ds].n;
      childVal.dc = cityMap[childVal.ds].l;
      childVal.ac = cityMap[childVal.as].l;
      childVal.aa = cityMap[childVal.as].n;
      childVal.dcc = cityMap[childVal.ds].c;
      childVal.acc = cityMap[childVal.as].c;
    }
    //airline filter
    if(!filterLine.test(val.al)) {
      data.departFlightArray.splice(i--, 1);
      continue;
    }
    val.fee.airDt = 0;
    val.fee.pCount = pCount;
    let hDt = val.fee.obfp + val.fee.ogst - val.fee.bfp - val.fee.gst;

    let bfDis = val.fee.obfp - val.fee.bfp;
    
    val.fee.hDt = hDt;
    val.fee.bfDis = bfDis;
    val.fee.cbfp = val.fee.obfp  - bfDis - val.fee.airDt;

    if(val.fee.cbfp < minPrice){
      val.fee.hDt = val.fee.hDt - (minPrice - val.fee.cbfp);
      val.fee.cbfp = minPrice;
      if(val.fee.obfp < minPrice){
        val.fee.obfp = minPrice;
        val.fee.hDt = val.fee.airDt = 0;
      }
    }
    val.opr = val.fee.cbfp + val.fee.gst;
    val.viaCouponDis = 0;
    val.goldback = val.fee.hDt + val.fee.airDt;
    
  }

  data.departMsg = {
    length:data.departFlightArray.length,
    from:cityMap[queryObj.from].l,
    to:cityMap[queryObj.to].l,
    dt:$.formatStr(data.departFlightArray[0].dt.replace(/\s.*/, '')),
    at:$.formatStr(data.departFlightArray[0].at.replace(/\s.*/, '')),
  };
  //sort price
  data.departFlightArray = _.sortBy(data.departFlightArray, function(item){
    return item.opr;
  });
  //transform to object {fn:{}}
  $.each(data.departFlightArray, function(i, val){
    var key = val.fn + (val.inId ? ('_' + val.inId) : '');
    tempObj[key] = val;
  });
  data.departFlightArray = tempObj;

  if(data.returnFlightArray != undefined && data.returnFlightArray.length != 0){
    
    for(var i = 0; i < data.returnFlightArray.length; i++){
      var val = data.returnFlightArray[i];
      val.isIntl = data.isIntl || false;
      
      val.isHideMinPr = (data.x.opa || ['SG', 'G8', '6E', '9W', 'UK']).indexOf(val.al) > -1;
      // create airlineName obj according to flight val;
      data.airlineNames[val.al] = airlinesMap[val.al].n;
      val.tripType = tripType;

      let insureFeeArr = [].concat.apply([], val.fee.fees.map(item => item.exFee || [])) ;

      val.minPriceObj = _.min(val.fee.fees.concat(insureFeeArr), n => n.bfp + n.gst);

      //add silver discount
      val.fee.fees.forEach(function(fee, key){
        if(fee.type == 2){
          val.fee.sdis = fee.sdis;
        }
        if(fee.type === 1){
          val.fee.instantKey = key;
        }
      });

      // add airlines fullname
      val.co = airlinesMap[val.al].n;
      val.da = cityMap[val.ds].n;
      val.dc = cityMap[val.ds].l;
      val.ac = cityMap[val.as].l;
      val.aa = cityMap[val.as].n;
      for(var j = 0; j < val.stopByFlightArray.length; j++){
        var childVal = val.stopByFlightArray[j];
        childVal.co = airlinesMap[childVal.al].n;
        childVal.da = cityMap[childVal.ds].n;
        childVal.aa = cityMap[childVal.as].n;
        childVal.dc = cityMap[childVal.ds].l;
        childVal.ac = cityMap[childVal.as].l;
        childVal.dcc = cityMap[childVal.ds].c;
        childVal.acc = cityMap[childVal.as].c;
      }
      if(!filterLine.test(val.al)){
        data.returnFlightArray.splice(i--, 1);
        continue;
      }
      val.fee.airDt = 0;
      val.fee.pCount = pCount;
      let hDt = val.fee.obfp + val.fee.ogst - val.fee.bfp - val.fee.gst;

      val.fee.hDt = hDt;
      
      let bfDis = val.fee.obfp - val.fee.bfp;
      val.fee.bfDis = bfDis;
      val.fee.cbfp = val.fee.obfp  - bfDis - val.fee.airDt;

      if(val.fee.cbfp < minPrice){
        val.fee.hDt = val.fee.hDt - (minPrice - val.fee.cbfp);
        val.fee.cbfp = minPrice;
        if(val.fee.obfp < minPrice){
          val.fee.obfp = minPrice;
          val.fee.hDt = val.fee.airDt = 0;
        }
      }
      val.opr = val.fee.cbfp + val.fee.gst;
      val.viaCouponDis = 0;
      val.goldback = val.fee.hDt + val.fee.airDt;
      // rtempObj[val.fn] = val;
    }
    
    data.returnMsg = {
      length:data.returnFlightArray.length,
      from: cityMap[queryObj.to].l,
      to:cityMap[queryObj.from].l,
      dt:$.formatStr(data.returnFlightArray[0].dt.replace(/\s.*/, '')),
      at:$.formatStr(data.returnFlightArray[0].at.replace(/\s.*/, '')),
    };
    data.returnFlightArray = _.sortBy(data.returnFlightArray, function(item){
      return item.opr;
    });
    $.each(data.returnFlightArray, (i, val)=>{
      var key = val.fn + (val.inId ? ('_' + val.inId) : '');
      rtempObj[key] = val;
    });
  }

  data.returnFlightArray = rtempObj;

  // fiter bar airlines filter
  for(var key in data.airlineNames){
    if(!filterLine.test(key)){
      delete data.airlineNames[key];
    }
  }

  return data;
};

export {flightModel};