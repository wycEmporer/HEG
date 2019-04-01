require('./content.less');
require('cp');
import {cookieUtil, path} from 'utils';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
import {getBannerInfo, MONSOON} from 'pagesDir/_component/getBannerInfo/index';
$(() =>{
  getBannerInfo(MONSOON);
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
 
}); 