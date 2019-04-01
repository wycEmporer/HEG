require('./content.less');
require('cp');
import {cookieUtil, path} from 'utils';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
$(() =>{
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  getDepartmentJobList();
  getNodeList();
  getDeptCount();
  function getDepartmentJobList() {
    $.ajax({
      url: path.getDepartmentJobList(),
      type: 'GET',
      dataType: 'json',
    }).done(function (res) {
      if(res.succ){
        var model = res.data;
        renderView($('#MTF'), $('#MTFTpl').html(), {'myModel': model });
      }
    }).fail(function (err) {
      console.log(err);
    });
  }
  
  function getNodeList() {
    $.ajax({
      url: path.getNodeList() + '?cId=117',
      type: 'GET',
      dataType: 'json',
    }).done(function (res) {
      if(res.success){
        var model = res.list[0].node;
        renderView($('#TCinfo'), $('#TCinfoTpl').html(), {'myModel': model });
      }
    }).fail(function (err) {
      console.log(err);
    });
  }
  function getDeptCount() {
    $.ajax({
      url: path.getDeptCount(),
      type: 'GET',
      dataType: 'json',
    }).done(function (res) {
      if(res.succ){
        $('.depar_num').text(res.data);
      }
    }).fail(function (err) {
      console.log(err);
    });
  }
    
}); 