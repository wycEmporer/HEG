
var paths = require('utils').path;
require('datepicker/datepicker.js');
require('./style.less');

import {handleForm} from 'cityLayer';

var ACount = parseInt($('#A_passenger').val());
var CCount = parseInt($('#C_passenger').val());
var ICount = parseInt($('#I_passenger').val());
var seatType = $('.s-seatType label').find('input:checked').val();
$('#pCount').text(ACount + CCount + ICount);
$('#pType').text(seatType?seatType:'Economy');
var selectedNum, selectType;
$('.minus-img').click(function(){
  selectedNum = Number($(this).parent().siblings('input').val());
  selectType = $(this).parent().siblings('input').attr('alt');
  selectedNum--;
 
  if(selectedNum < 1){ 
    if(selectType.indexOf('a') != -1){
      selectedNum = 1;
    }else{
      selectedNum = 0;
    }
  }
  if(selectType.indexOf('a') != -1){
    var I_selectedNum = $('#I_passenger').val();
    if(I_selectedNum > selectedNum){
      I_selectedNum--;
      $('#I_passenger').val(I_selectedNum);
    }
  }
  $(this).parent().siblings('input').val(selectedNum);
});
$('.plus-img').click(function(){
  var selectedNumA = Number($('#A_passenger').val());
  var selectedNumC = Number($('#C_passenger').val());
  selectedNum = Number($(this).parent().siblings('input').val());
  selectType = $(this).parent().siblings('input').attr('alt');
  selectedNum++;
  if(selectType.indexOf('a') != -1){
    if(selectedNum +  selectedNumC > 9){
      selectedNum = 9 - selectedNumC;
    }
  }else if(selectType.indexOf('i') != -1){
    if(selectedNum > selectedNumA){
      selectedNum = selectedNumA;
    }
  }else{
    if(selectedNum > (9 - selectedNumA)){
      selectedNum = 9 - selectedNumA;
    }
  }
  $(this).parent().siblings('input').val(selectedNum);
});
$('.passenger').blur(function(){
  var selectedNumA = Number($('#A_passenger').val());
  var selectedNumC = Number($('#C_passenger').val());
  selectedNum = Number($(this).val());
  selectType = $(this).attr('alt');
  if(selectType.indexOf('a') != -1){
    if(selectedNum +  selectedNumC > 9){
      selectedNum = 9 - selectedNumC;
    }
  }else if(selectType.indexOf('i') != -1){
    if(selectedNum > selectedNumA){
      selectedNum = selectedNumA;
    }
  }else{
    if(selectedNum > (9 - selectedNumA)){
      selectedNum = 9 - selectedNumA;
    }
  }
  $(this).val(selectedNum);
});
$('.seat-type').click(function(){
  $(this).parent().siblings().find('input').removeAttr('checked');
  $(this).attr('checked', 'checked');
});
$('#p-popover').click(function(){
  $('.SelectWrap').toggle('fast', function(){
    var ACount = parseInt($('#A_passenger').val());
    var CCount = parseInt($('#C_passenger').val());
    var ICount = parseInt($('#I_passenger').val());
    $('#pCount').text(ACount + CCount + ICount);
    var seatType = $('.s-seatType label').find('input:checked').val();
    $('#pType').text(seatType?seatType:'Economy');
  });
});
$('.SelectWrap .close').click(function(){
  $('#p-popover').trigger('click');
});
$('#confirm').click(function(){
  $('#p-popover').trigger('click');
});
$('#p-popover').on('hide.bs.popover', function(){
  var ACount = parseInt($('#A_passenger').val());
  var CCount = parseInt($('#C_passenger').val());
  var ICount = parseInt($('#I_passenger').val());
  var seatType = $('.s-seatType label').find('input:checked').val();
  $('#pCount').text(ACount + CCount + ICount);
  $('#pType').text(seatType?seatType:'Economy');
});

//oneway and roundway switch 
var tripType = $('.L-tripType ul li label').find('input:checked').val();
if(tripType == 0){
  $('#R_date').val('');
  // $('.section2 .r-date .datepick').off();
}else{
  $('#R_date').removeAttr('disabled');
}
$('.L-tripType .oneway label').on('click', function(){
  $('.section2 .r-date').removeClass('hidden');
  $('#R_date').val('');
  // $('#R_date').attr('disabled', 'disabled');
  // $('#returnDate').attr('disabled', 'disabled');
  // $('.section2 .r-date .datepick').off();
  
});
$('.L-tripType .roundtrip label').on('click', function(){
  $('.section2 .r-date').removeClass('hidden');
  var val = $('#D_date').val();
  var val2 = $('#departDate').val();
  $('#returnDate').removeAttr('disabled');
  $('#R_date').val(val);
  $('#returnDate').val(val2);
});
$('#R_date, .r-date a.icon.datepick').on('click', function(){
  $('.L-tripType .roundtrip label').click();
  $('#R_date').datepicker('show');
});
$('#search_flights').on('click', function(){
  handleForm(this);
});
