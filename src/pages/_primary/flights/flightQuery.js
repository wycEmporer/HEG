import staticPath from './getPathParameter.js';
const queryStr = require('utils').parseQueryStr();

export  function newQueryStr(){
  Object.assign(queryStr, staticPath());
  let type = staticPath().returnDate ? '1' : '0';
  return {
      tripType: queryStr.tripType || type,
      adults: queryStr.adults || '1',
      childs: queryStr.childs || '0',
      baby: queryStr.baby || '0',
      cabinClass: queryStr.cabinClass || 'Economy',
      airline: queryStr.airline || '',
      carrier: queryStr.carrier || '',
      departDate:queryStr.departDate || '',
      returnDate:queryStr.returnDate || '',
      from: queryStr.from || '',
      to: queryStr.to || ''
  };
}

