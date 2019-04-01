import fetchAndMerge from './fetchAndMergeData.js';
import bottomSelectedPrice, {randerSelectedFlight} from './bottomSelected.js';
import {airlineDiscount} from '../airlineDiscount.js'; 
import * as popContent from '../popContent';
function renderView(viewElement, viewHtml, model){
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}

function renderOptionalPrice(idArr, model){
  const model1 = model[0][idArr[0]];
  model1.cycle = 0;
  const model2 = model[1][idArr[1]];
  model2.cycle = 1;
  const $viewE1 = $('#departColumn #'+idArr[0].replace(/\//g, '\\/') +' .f-optional');
  const $viewE2 = $('#returnColumn #'+idArr[1].replace(/\//g, '\\/') +' .f-optional');
  const html = $('#f-optionalTpl').html();
  renderView($viewE1, html, {model: model1});
  renderView($viewE2, html, {model: model2});
  let minPriceObj1 = _.min(model1.fee.fees, (n) => {
    return n.bfp + n.gst;
  });
  let insurePr1 = model1.fee.fees[0].exFee && model1.fee.fees[0].exFee[0].bfp + model1.fee.fees[0].exFee[0].gst;

  let minPriceObj11 = insurePr1 && ((minPriceObj1.bfp + minPriceObj1.gst) > insurePr1) ? model1.fee.fees[0].exFee[0] : minPriceObj1;

  let insurePr2 = model2.fee.fees[0].exFee && model2.fee.fees[0].exFee[0].bfp + model2.fee.fees[0].exFee[0].gst;

  let minPriceObj2 = _.min(model2.fee.fees, (n) => {
    return n.bfp + n.gst;
  });
  let minPriceObj22 = insurePr2 && ((minPriceObj2.bfp + minPriceObj2.gst) > insurePr2) ? model2.fee.fees[0].exFee[0] : minPriceObj2;

  $('#departColumn #'+idArr[0].replace(/\//g, '\\/') + ' .brief .memberP').text(Math.round((minPriceObj11.gst + minPriceObj11.bfp)/model1.fee.pCount).toThree());
  $('#returnColumn #'+idArr[1].replace(/\//g, '\\/') + ' .brief .memberP').text(Math.round((minPriceObj22.gst + minPriceObj22.bfp)/model2.fee.pCount).toThree());
}
/*
  data: delegate 
  sendData: origin flight Data 
 */
export default function priceOptional(branchData, idArr){
  if(_.isEqual(branchData.idArr, idArr)){
    return ;
  }else{
    branchData.idArr = idArr.length > 1 ? idArr : branchData.idArr;
  }
  let departId = branchData.idArr[0];
  let returnId = branchData.idArr[1];
  var sendData = {
    'departFlight': {
      fee:branchData.oldData[0][departId].fee,
      fn: branchData.oldData[0][departId].fn,
      feee: branchData.oldData[0][departId].feee,
    },
    'returnFlight':{
      fee: branchData.oldData[1][returnId].fee,
      fn: branchData.oldData[1][returnId].fn,
      feee: branchData.oldData[1][returnId].feee,
    },
    'rtd':airlineDiscount(branchData.oldData[0][departId], branchData.oldData[1][returnId], branchData.x.rtd).ord,
  };
  fetchAndMerge(branchData.newData, sendData).then(newData =>{
    renderOptionalPrice(branchData.idArr, newData);
    bottomSelectedPrice(branchData.idArr, newData, 0);

    popContent.popGold();
    popContent.memberPop();
    popContent.insureTc();
  });
}

export { randerSelectedFlight, bottomSelectedPrice };