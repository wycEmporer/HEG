import renderView from '../renderView';
const utils = require('utils');
const {accountPath} = utils;
export const changeFlightController = function(id){
  var tripDetailArr = JSON.parse(sessionStorage.getItem('o_d'));
  var model = tripDetailArr.map(val => ({
    dc: val.voyageinfo[0].dc,
    ac: val.voyageinfo[val.voyageinfo.length -1].ac,
    travellerinfos: val.travellerinfo,
    tripid: val.id
  }));

  var viewHtml = $('#changeFlightTpl').html();
  renderView($('#rightside'), viewHtml, {model});
  $('#D_date0').datepicker({
    // defaultDate:"+1",
    // currentText:"now",
    // gotoCurrent:true,
    setDate:'',
    altField:'#D_date0+input',
    altFormat:'yy-mm-dd',
    firstDay:1,
    minDate:'0',
    numberOfMonths:2,
    dateFormat:'D, d M, yy',
  });
  $('#D_date0').datepicker('setDate', new Date(new Date().getTime() + 86400000));
  $('#D_date1').datepicker({
    // defaultDate:"+1",
    // currentText:"now",
    // gotoCurrent:true,
    setDate:'',
    altField:'#D_date1+input',
    altFormat:'yy-mm-dd',
    firstDay:1,
    minDate:'0',
    numberOfMonths:2,
    dateFormat:'D, d M, yy',
  });
  $('#D_date1').datepicker('setDate', new Date(new Date().getTime() + 86400000));

  $.getJSON('/heg_api/rebook/needRefundOrRebookTogether.do?tripId='+model[0].tripid).done(res => {
    if(res.succ){
      changeTogether();
      $('#showTogetherNote').removeClass('hidden');
    }
  });

};

function changeTogether(){
  $('.refundList').on('click', function(){
    let key = $(this).attr('key').replace('/', '\\/');
    if(this.checked == true){
      
      $(`input[key=${key}]`).prop('checked', true);
    }else{
      $(`input[key=${key}]`).prop('checked', false);
    }
  });
}

$('body').on('click', '#changeBtn', function(){
  let travellers = [], flights = [];
  $.each($('input[name=flightPsrIds]:checked'), function(key, value){
    travellers.push({pId:value.value});
  });
  $.each($('.travellerList'), function(key, value){
    let tmp = {
      departDate: $(value).find('[name=departDate]').val(),
      tripType: key + 1,
      fno: $(value).find('[name=flightNo]').val(),
    };
    flights.push(tmp);
  });
  // if(flightNo == ''){
  //   alert('Please enter flight number');
  //   return;
  // }
  
  if(JSON.stringify(travellers) == '[]'){
    alert('Please select a passenger to change flight');
    return;
  }
  if(!confirm('Confirm the operation')) return;
  $.ajax({
    // url:accountPath.changeApply(),
    url:'/heg_api/rebook/applyForRebookTogether.do',
    type:'POST',
    data:JSON.stringify({
    travellers, flights
    }),
    contentType:'application/json',
    dataType:'json'
  }).done(result => {
    if(result.succ){
      // location.reload();
      let tripId = JSON.parse(sessionStorage.getItem('o_d'))[0].id;
      window.location.href='/account/?src=trips/'+ tripId +'&token=';
    }else{
      alert(result.msg);
    }
  });
});