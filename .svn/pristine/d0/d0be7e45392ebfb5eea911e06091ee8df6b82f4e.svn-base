require('./content.less');
require('cp');
const utils = require('utils');
const {
 path: paths, cookieUtil 
} = utils;
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;


function renderView(viewElement, viewHtml, model) {
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}

const viewHtml = `
  {{_.each(model, function(val, i){ }}
  <tr>
    <td>{{=val.oldFlightNum}}</td>
    <td>{{=val.newFlightNum}}</td>
    <td>{{=val.frequency}}</td>
    <td>{{=val.sector}}</td>
    <td>{{=val.depTime}}</td>
    <td>{{=val.arrTime}}</td>
    <td>{{=val.DelhiTerminal}}</td>
  </tr>
  {{})}}
`; 
const viewElement = $('#flightTerminal').find('tbody');
renderView(viewElement, viewHtml, {model: flightChangedata});