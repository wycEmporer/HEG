require('./style.less');

function getCamCouInfo(list){
  $.when(
    $.ajax({
    url:'/heg_api/advertising/getAdvert.do?id=279', 'x-device': 'pc', dataType: 'json'
  })).done((hotelData, flightData) => {

    if(hotelData.data){
      let data = hotelData.data;
      var $shareModal = $('#couShareModal');
      
      $shareModal.find('.validity span').text(formatDate(new Date(data.startDate), false) +' - '+ formatDate(new Date(data.endDate), false));
      $shareModal.find('.couponBan:first .couponImg').attr('src', data.url);
      $shareModal.find('.couponBan:eq(1) .couponImg').attr('src', data.landingPageUrl);

      if(new Date() - new Date('2019-02-01 00:00:00') >= 0 && new Date() - new Date('2019-03-01 00:00:00') <= 0) { 
        $shareModal.find('.validity span').text(formatDate(new Date(data.startDate), 2) +' - '+ formatDate(new Date(data.endDate), 2)); 
        $shareModal.find('.campaigs-link').attr('href', '/offers/pre-spring-sale').text('Pre-Spring Sale');
        $shareModal.find('.title span').text('Pre-Spring Sale!');
        $shareModal.find('.modal-content').addClass('newPam');
        $shareModal.find('.couponBan:eq(1) .coupon-value span').text('HEGHPS');
        $shareModal.find('.campaigs-link').attr('ga-label', '');
        $shareModal.find('.redeemBtn').text('Click to Redeem');
      } 
      $('#couShareModal').modal('show');
    }
  });
}
function formatDate(data, type){
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let getDate = '';
    let y = data.getFullYear();
    let m = months[data.getMonth()];
    let arr, str;
    arr = String(data.getDate()).split('');
    str = arr[arr.length-1];
    if(str.indexOf('1') > -1) {
      getDate = data.getDate() +'st';
    } else if(str.indexOf('2') > -1) {
      getDate = data.getDate() +'nd';
    } else if(str.indexOf('3') > -1) {
      getDate = data.getDate() + 'rd';
    } else if(str.indexOf('31') > -1) {
      getDate = data.getDate() +'st';
    } else {
      getDate = data.getDate() +'th';
    }
    if(type){
      return m +' '+ getDate;
    }else{
      return getDate+' '+ m +', '+ y;
    }
}
$(document).on('click', '.coupon-value', function() {
  var val = $(this).find('span')[0];
  window.getSelection().selectAllChildren(val);
  document.execCommand('Copy');
  $('.prizeModal .TipsMsg').fadeIn(500).delay(2000).fadeOut(1000);
});
$('.redeemBtn').on('click', function(){
  if($(this).parents('.couponBan').index() == 0){
    $('#couShareModal').modal('hide');
  }else{
    location.href='https://www.happyeasygo.com/hotel';
  }
});

let uid = getCookie('uid');
function getCookie (name){
  var arr, reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)');
  if(arr=document.cookie.match(reg))
  return unescape(arr[2]);
  else
  return null;
}

export {getCamCouInfo };

