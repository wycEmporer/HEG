require('./content.less');
require('cp');
import {cookieUtil, path} from 'utils';
$(() => {

  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  getNodeList();
  function getNodeList() {
    $.ajax({
      url: path.getNodeList() + '?cId=112',
      type: 'GET',
      dataType: 'json',
    }).done(function (res) {
      if(res.success){
        var model1 = res.list[0].node[0].content;
        res.list[0].node.shift();
        var model3 = res.list[0].node;
        renderView($('#view'), $('#viewTpl').html(), {'myModel': model1 });
        renderView($('#aboutUs'), $('#aboutUsTpl').html(), {'myModel': model3 });
      }
    }).fail(function (err) {
      console.log(err);
    });
  }
});