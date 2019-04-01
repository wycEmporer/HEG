import {flightModel} from './flightmodel.js';
import {newQueryStr} from '../flightQuery.js';

// const utils = require('utils');
// let queryObj = utils.parseQueryStr();
// Object.assign(queryObj, staticPath());
// if(queryObj.returnDate){
//   queryObj.tripType = 1;
// }

export function intlModel(data) {
  const queryObj = newQueryStr();
  
  if(queryObj.tripType == 0){
    let departFlightArray = [];
    data.IntlFlightArray.forEach(function(val, key){
      departFlightArray.push(val.departFlight);
    });
    let oneModel = {
      departFlightArray,
      x: data.x,
      token:data.token,
      isIntl:data.isIntl,
    };
    return flightModel(oneModel);
  }else if(queryObj.tripType == 1) {
    let departFlightArray = [];
    let returnFlightArray = [];
    data.IntlFlightArray.forEach(function(val, key){
      var departFlight = val.departFlight;
      departFlight.inId = val.id;
      departFlightArray.push(departFlight);
      var returnFlight = val.returnFlight;
      returnFlight.inId = val.id;
      returnFlightArray.push(returnFlight);
      val.flightGroup = [departFlight, returnFlight];
    });

    return flightModel({
      departFlightArray,
      returnFlightArray,
      x: data.x,
      token: data.token,
      intlType: 1,
      IntlFlightArray: _.sortBy(data.IntlFlightArray, function(val){return val.fee.bfp + val.fee.gst;}),
      isIntl:data.isIntl,
    });
  }

}