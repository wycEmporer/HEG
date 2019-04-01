require('./content.less');
require('cp');
import {cookieUtil, path} from 'utils';
import {getBannerInfo, SPRINGTRAVEL} from 'pagesDir/_component/getBannerInfo/index';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
require('../../_component/searchBar/content.js');
// require('../../_component/flightSearch/index');
$(() =>{
  getBannerInfo(SPRINGTRAVEL);
  
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }

});