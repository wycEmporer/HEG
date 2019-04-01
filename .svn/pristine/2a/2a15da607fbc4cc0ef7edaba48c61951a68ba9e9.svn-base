const store = require('store');
const paths = require('utils').path;
function loadHistoy(formId, storeName){
  storeName = storeName || 'F_H';
  store.remove('FH');
  const F_H = store.get(storeName);
  if(F_H && F_H.length > 0){
    let formObj = F_H[F_H.length - 1];
    let formDom = document.getElementById(formId);
    if(!formDom) return;
    if(formObj.tripType === '1'){
      formDom.Roundtrip.checked = true;
    }else{
      formDom.oneway.checked = true;
    }
    formDom.D_city.value = formObj.fromCity.city;
    formDom.from.value = formObj.fromCity.iata;
    formDom.from['data-country'] = formObj.fromCity.cc;

    formDom.A_city.value = formObj.toCity.city;
    formDom.to.value = formObj.toCity.iata;
    formDom.to['data-country'] = formObj.toCity.cc;
    let dDate = new Date(formObj.departDate.replace(/-/g, '/'));
    let rDate = new Date((formObj.returnDate || formObj.departDate).replace(/-/g, '/'));
    let dDateCur = dDate - new Date() < 0 ? new Date() : dDate;
    let rDateCur = rDate - new Date() < 0 ? new Date() : rDate;
    $('#D_date').datepicker('setDate', dDateCur);
    $('#R_date').datepicker('setDate', rDateCur);

    let selectedNum = Number(formObj.adults);
    $('#C_passenger,#I_passenger').empty();
    for(var i = 0;i < 10 - selectedNum; i++ ){
      $('#C_passenger').append('<option value='+i+'>'+i+'</option>');
    }
    for(var i = 0;i < selectedNum + 1; i++){
      $('#I_passenger').append('<option value='+i+'>'+i+'</option>');
    }
    formDom.adults.value = formObj.adults || 1;
    formDom.childs.value = formObj.childs || 0;
    formDom.baby.value = formObj.baby || 0;
    formDom.cabinClass.value = formObj.cabinClass || 'Economy';
  }
}

function storeForm(obj){
  const F_H = store.get('F_H') || [];
  if(F_H.length > 20){
    F_H.shift();
  }
  let formObj = $.extend(true, {}, obj);
  try{
    let cityArr = JSON.parse(sessionStorage.getItem('citydata1'));
    if(!cityArr){
      throw 'undefined';
    }
    storeCityObj(cityArr, formObj, F_H);
  } catch(e){
    $.getJSON(paths.cityListUrl()).done((res) =>{
      sessionStorage.setItem('citydata1', JSON.stringify(res.data));
      storeCityObj(res.data, formObj, F_H);
    });
  }
}
// call this
function storeCityObj(cityArr, formObj, F_H){
  for(var i = 0; i < cityArr.length; i++){
    if(cityArr[i].iata === formObj.from.toUpperCase()){
      formObj.fromCity = cityArr[i];
      break;
    }
  }

  for(var i = 0; i < cityArr.length; i++){
    if(cityArr[i].iata === formObj.to.toUpperCase()){
      formObj.toCity = cityArr[i];
      break;
    }
  }

  if(formObj.fromCity && formObj.toCity){
    F_H.push(formObj);
    store.set('F_H', F_H);
  }
  
}

export {
  loadHistoy, storeForm
};
// module.exports = {
//   loadHistoy, formStore
// };