const paths = require('utils').path;
function renderView(viewElement, viewHtml, model) {
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}
export function getAirDivisionInfo(cId, node, nodeTpl){
  $.ajax({
    url: paths.getNodeList() + '?cId='+cId,
    type: 'GET',
    dataType: 'json',
  }).done(function (res) {
    if(res.success){
      var model = res.list[0].node;
      renderView(node, nodeTpl.html(), {'myModel': model });
    }
  }).fail(function (err) {
    console.log(err);
  });
}