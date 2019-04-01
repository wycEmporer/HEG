const paths = require('utils').path;
export function getBannerInfo(addr){
  $.ajax({
    url: paths.getPromotionInfo() + 'type=13&device=1'+ '&addr=' + addr,
    type: 'GET',
    dataType: 'json',
  }).then(res => {
    if(res.success){
      loadInfo(res.list[0]);
    }
    
  });
}
function loadInfo(res){
  let monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  try{
    let dateStrObj = new Date(res.startDate.replace(/-/g, '/'));
    let dateEndObj = new Date(res.endDate.replace(/-/g, '/'));
    var startTime = (dateStrObj.getDate() + 100).toString().slice(1, 3) + ' ' + monthArr[dateStrObj.getMonth()] + ' '+ dateStrObj.getFullYear(); 
    var endTime = (dateEndObj.getDate() + 100).toString().slice(1, 3) + ' ' + monthArr[dateEndObj.getMonth()] + ' '+ dateEndObj.getFullYear();
  }catch(e){
    
  }
  
  $('#banner').html(`<img src="${res.landingPageUrl == null?'':res.landingPageUrl}" alt="${res.landingPageAlt == null?'':res.landingPageAlt}" title="${res.landingPageTitle == null?'':res.landingPageTitle}" class="banImg">`);
  $('#startTime').text(startTime);
  $('#endTime').text(endTime);
}