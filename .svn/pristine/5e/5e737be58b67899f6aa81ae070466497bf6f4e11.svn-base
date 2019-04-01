const cookieUtil = require('cp').cookieUtil;
const utils = require('utils');
const paths = utils.path;
let userName = cookieUtil.getCookie('username') ? cookieUtil.getCookie('username') : '';
$(() => {
  let indexBtn = null;
  let data ={
    cancelReason:null,
    operatorType:2,
    route:1
  };
  function renderView(viewElement, viewHtml, model){
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  $(document).on('click', '.cancel-btn', function (e){
    indexBtn = $(this).data('index');
    data.id = $(this).data('id');
    data.userName = userName;
   $('#cancelOrder').modal('show');
   $.ajax({
    url: paths.getCancelReason(),
    dataType: 'json',
    type: 'GET'
    }).then((res) => {
      if(res.success){
        var data = res.data;
        renderView($('#cancelReason'), $('#cancelReasonTpl').html(), {'myModel': data });
      }
    });
    return false;
  });
  $(document).on('click', '.cancelReason ul li label', function (e){
    if($(this).children('input').prop('checked')){
      data.cancelReason = $(this).data('cause');
      $('#canCelOrderBtn').prop('disabled', false);
      $(this).css('color', '#0B9D78');
    }else{
      $('#canCelOrderBtn').prop('disabled', true);
      $(this).css('color', '#333');
    }

    $(this).parents('.nameItem').siblings().find('label').css('color', '#333');
    $(this).parents('.nameItem').siblings().find('input[type=checkbox]').prop('checked', false);
  });

  $(document).on('click', '#canCelOrderBtn', function (e){
    if($(this).prop('disabled')){
      return false;
    }
    $(this).addClass('progress-dynamic');
    $(this).attr('disabled', 'disabled');
    let _this = this;
    var newDate = new Date();
    var year = newDate.getFullYear(),
        month = (newDate.getMonth()-0 + 1) < 10 ? '0' + (newDate.getMonth()-0 + 1) : newDate.getMonth()-0 + 1,
        day = newDate.getDate();
    data.date = year + '' + month + '' + day;
    $.ajax({
      url: paths.cancelOrderByGuest(),
      dataType: 'json',
      type: 'POST',
      data:JSON.stringify(data),
      headers: {'Content-Type':'application/json'},
      }).then((res) => {
        if(res.success && res.data){
          if(indexBtn == 1){
            window.location.reload();
          }else{
            window.history.go(-1);
          }
        }else {
          alert(res.msg);
        }
        $(_this).removeClass('progress-dynamic');
        $(_this).removeAttr('disabled', 'disabled');
      });
  });
});