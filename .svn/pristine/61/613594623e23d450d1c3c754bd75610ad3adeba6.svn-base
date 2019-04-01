var utils = require('utils');
var cookieUtil = utils.cookieUtil;
var accountPath = utils.accountPath;

require('datepicker/datepicker.js');
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
export function hotelList(token){
  $.ajax({
    url: isLogin ? accountPath.getHotelList() : accountPath.getHotelListUnlogin() +'?tokens=' + token, 
    type:'GET',
    dataType:'json',
  }).then((res) => {
      let data = res;
      if(data.length != 0 && Array.isArray(data)){
        // var monthArray = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        const keyToStatus = {
          1: 'Pay',
          2: 'Pending',
          3: 'Confirmed',
          4: 'Completed',
          5: 'Canceled',
          6: 'Canceled',
          7: 'Canceled',
          8: 'Canceled',
          9: 'Pay',
          10: 'Pending',
          11: 'Pending',
          12: 'Pending',
          13: 'Pending',
          14: 'Pending',
          15: 'Pending',
          16: 'Canceled',
          17: 'Pending'
        };
        const btnColor = {
          1: 'Tobepaid',
          2: '',
          3: '',
          4: 'Completed',
          5: 'Timeout',
          6: 'Completed',
          7: 'Completed',
          8: 'Completed',
          16: 'graybg',
        };
        var weekArray = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; 
        data.stateArr =[];
        data = data.sort(function(a, b){
          return b.orderTime - a.orderTime;
        });
        $.each(data, function(i, val){
          val.btnColor = btnColor[val.status];

          val.status = keyToStatus[val.status];
          if(data.stateArr.indexOf(val.status) < 0){
            data.stateArr.push(val.status);
          }
          val.price = Math.ceil(val.price).toThree(); 
          var date = new Date(val.orderTimeStr.replace(/-/g, '/'));
          val.year = date.getFullYear();
          val.month = (date.getMonth() + 101).toString().slice(1);
          val.date = (date.getDate()+100).toString().slice(1);
          val.week = weekArray[date.getDay()];
          // val.checkInDate = val.year + '-'+ val.month + '-' + val.date;
        });
      
      renderView(viewElement, viewHtml, {model:data});
      loadDatepicker();
      listenSearch();
      listenReset();
  
      } else if(data.length == 0 && Array.isArray(data)) {
        data = [];
        renderView(viewElement, viewHtml, {model:data});
      } else {
        alert(data.code);
        window.history.go(-1);
      }
  }).fail(err => {
    console.log(err);
  });
  var viewElement = $('#rightside');
  viewElement.html($('#loadingTpl').html());
  var viewHtml = $('#hotelsListTpl').html();
}
function renderView(viewElement, viewHtml, model){
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}
function loadDatepicker(){
  $('#checkDate1').datepicker({
    // defaultDate:"+1",
    // currentText:"now",
    // gotoCurrent:true,
    setDate:'',
    altField:'#checkInDate1',
    altFormat:'yy-mm-dd',
    firstDay:1,
    minDate:'-1Y',
    maxDate:'+1Y',
    numberOfMonths:1,
    dateFormat:'d M, yy',
    onClose:function(selectedDate){
      selectedDate = (selectedDate == '') ? 0 : selectedDate;
      $('#checkDate2').datepicker('option', 'minDate', selectedDate);
    },
    beforeShow(){
      $(this).datepicker('option', 'maxDate', '+1Y');
    }
  });
  $('#checkDate2').datepicker({
    altField:'#checkInDate2',
    altFormat:'yy-mm-dd',
    firstDay:1,
    minDate:'-1Y',
    maxDate:'+1Y',
    numberOfMonths:1,
    dateFormat:'d M, yy',
    onClose:function(selectedDate){
      selectedDate = (selectedDate == '') ? 0 : selectedDate;
      $('#checkDate1').datepicker('option', 'maxDate', selectedDate);
    },
  });
}
function listenSearch(){
  $('#hotelSearch').on('click', function(){
    // $(this.form).serialize();
    let filterObj = {
      hotelName: this.form.hotelName.value,
      state: this.form.state.value,
      checkInDate1: this.form.checkInDate1.value || '2017-12-01',
      checkInDate2: this.form.checkInDate2.value || '2030-12-01'
    };
    $.each($('.orders a.order-item'), function(i, val){
      let hotelName = $(val).attr('hotelName');
      let checkInDate = $(val).attr('checkInDate');
      let state =  $(val).attr('state');
      let checkIn = Date.parse(filterObj.checkInDate1) <= Date.parse(checkInDate) && Date.parse(filterObj.checkInDate2) >= Date.parse(checkInDate);
      let flag = hotelName.indexOf(filterObj.hotelName) > -1
      && checkIn && state.indexOf(filterObj.state) > -1;
      if(flag){
        $(val).removeClass('hidden');
      }else{
        $(val).addClass('hidden');
      }
    });
    $('#rightside .hotelQueryReset').removeClass('hidden');
  });
}
function listenReset(){
  $('#rightside .hotelQueryReset').on('click', function(){
    let form = $(this).parents('form')[0];
    form.hotelName.value = '';
    form.state.value = '';
    form.checkInDate1 = '';
    form.checkInDate2 = '';
    $('#checkDate2').datepicker('option', 'minDate', '-1Y');
    document.getElementById('checkDate1').value = '';
    document.getElementById('checkDate2').value = '';
    $.each($('.orders a.order-item'), function(i, val){
      $(val).removeClass('hidden');
    });
    $(this).addClass('hidden');
  });
}
