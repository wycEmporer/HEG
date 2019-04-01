require('./style.less');
var paths = require('utils').path;
require('datepicker/datepicker.js');
import {handleForm} from 'cityLayer';
/*
$('#D_date').datepicker({
  // defaultDate:"+1",
  // currentText:"now",
  // gotoCurrent:true,
  setDate:"",
  altField:"#departDate",
  altFormat:"yy-mm-dd",
  firstDay:1,
  minDate:"0",
  maxDate:'+1Y',
  numberOfMonths:1,
  dateFormat:"D, d M",
  onClose:function(selectedDate){
    selectedDate = (selectedDate == "") ? 0 : selectedDate;
    $("#R_date").datepicker("option", "minDate", selectedDate);
  },
});
$("#R_date").datepicker({
  altField:"#returnDate",
  altFormat:"yy-mm-dd",
  firstDay:1,
  minDate:"0",
  maxDate:'+1Y',
  numberOfMonths:1,
  dateFormat:"D, d M",
});

$('#D_date').datepicker('setDate', new Date());
// new Date().getTime() + 86400000
$('#R_date').datepicker('setDate', new Date());
*/
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
$('.oneway label').on('click', function(){
  $('#R_date').addClass('active');
  $('#returnDate').attr('disabled', 'disabled');
});
$('.roundtrip label').on('click', function(){
  $('#R_date').addClass('active');
  $('#returnDate').removeAttr('disabled');
});

$('#R_date, .r-date a.icon.datepick').on('click', function(){
  $('.roundtrip input[name=tripType]').prop('checked', true);
  $('#returnDate').removeAttr('disabled');
  $(this).addClass('active');
});


$('#search_flights').on('click', function(){
  handleForm(this);
});