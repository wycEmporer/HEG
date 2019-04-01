var utils = require('utils');

var accountPath = utils.accountPath;
var offerPath = utils.offerPath;

function renderView(viewElement, viewHtml, model){
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}
function myCoupon(){
  var userId = utils.cookieUtil.getCookie('uid') ;
  $.ajax({
    url: offerPath.getUserAllCoupon(),
    dataType: 'json',
    type: 'POST',
    contentType:'application/json',
    data:JSON.stringify({userId:userId}),
    }).then((res) => {
      var model = res.data;
      model.heg == [] ? [] : validList(model.heg);
      model.hegExpired == [] ? [] : validList(model.hegExpired);
      model.bd == [] ? [] : validList(model.bd);
      model.bdExpired == [] ? [] : validList(model.bdExpired);

      function validList (list) {
        list.forEach(function(val){
          function timeTransform(data){
            var Data = new Date(data);
            var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', '  ', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const Y = Data.getFullYear();
            const M = Data.getMonth();
            const D = Data.getDate() > 9 ? Data.getDate() : '0' + Data.getDate();
            const timeTill = month[M] + ' ' + D + ',' + Y;
            return timeTill;      
          }

          val.isHotelCoupon = val.couponType == 1 ? false : true;
          const startTill = timeTransform(val.validityFrom);
          const endTill = timeTransform(val.validityTo);
          val.validTill = startTill + ' - ' + endTill;
        });
      }
      renderView($('#rightside'), $('#myCouponTpl').html(), {'myModel': model });
    });
}


// myCoupon

$(document).on('click', '.flightCoupon .copyText_1, .copyText', function(e) {
  e.stopPropagation();
  var val = $(this)[0];
  window.getSelection().selectAllChildren(val);
  document.execCommand('Copy');
  const TipsMsg = $(this)
    .siblings('.TipsMsg')[0];
    $ (TipsMsg).fadeIn(500).delay(2000).fadeOut(1000);
});

 
 $(document).on('click', '.panel-heading a', function () {
  $(this).children('i').toggleClass('onOffactive');
});

export { myCoupon };