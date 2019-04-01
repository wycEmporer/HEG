require('./content.less');
require('cp');
require('datepicker/datepicker.js');
require('../../_component/flightAndhotel/index');
var utils = require('utils');
var paths = utils.path;
$('.share .fb').click(function(){
  FB.ui({
    method:'share',
    display:'popup',
    href:'https://www.happyeasygo.com/offer/index.html'
  }, function(response){});
});

function renderView(viewElement, viewHtml, model) {
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}
$(() =>{
  $.getJSON(paths.getAllPromotionInfo() + 'type=13&device=1').done((res) => {
    let flightModel = [];
    let hotelModel = [];
    let model = [];
    if(res.success && Array.isArray(res.list)){
      model = res.list;  
      model = _.sortBy(model, 'sort');
      for(let i = 0; i < model.length; i++){
        let val = model[i];
        if(!val.use){
          model.splice(i--, 1);
          continue;
        }
        let monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        try{
          let dateStrObj = new Date(val.startDate.replace(/-/g, '/'));
          let dateEndObj = new Date(val.endDate.replace(/-/g, '/'));
          if(new Date() - dateStrObj < 604800000) {
            val.isNew = true;
          } else {
            val.isNew = false;
          }
          val.period = (dateEndObj.getDate() + 100).toString().slice(1, 3) + ',' + monthArr[dateEndObj.getMonth()]+ ' '+ dateEndObj.getFullYear();
        }catch(e){
          val.period = '';
        }
        if(val.businessType == 1){
          flightModel.push(val);
        } else if(val.businessType == 2) {
          hotelModel.push(val);
        }
      } 
    } 
    renderView($('#All'), $('#offerListTpl').html(), {model});
    renderView($('#Flights'), $('#offerListTpl').html(), { model: flightModel});
    renderView($('#Hotels'), $('#offerListTpl').html(), { model : hotelModel});
  });
});