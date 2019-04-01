export default function(data){
  let itineraryArray = [data];
  itineraryArray.forEach(function(val, i){
    val.primaryDDate = $.formatStr(val.dt.replace(/\s.*/, ''));
    val.primaryADate = $.formatStr(val.at.replace(/\s.*/, ''));
    // val.fee.r = val.fee.refundable ? 'Refundable' : 'Non-refundable';
    val.stopByFlightArray.forEach(function(value, key){
      value.dti = value.dti || ' ';
      value.dd = value.dt.replace(/\s.*/, '');
      // used for verify birth
      // flightDates.push(value.dd.replace(/\//g, '-'));
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
  return {itineraryArray};
}