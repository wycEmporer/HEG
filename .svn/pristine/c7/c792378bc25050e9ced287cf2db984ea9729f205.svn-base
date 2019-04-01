require('./content.less');
require('cp');
require('cityLayer');
require('datepicker/datepicker.js');
var utils = require('utils');
var paths = utils.path;
import {getBannerInfo} from '../_getAds/getBannerAds.js';
$(() =>{
  getBannerInfo();
});
$('#D_date').datepicker({
  // defaultDate:"+1",
  // currentText:"now",
  // gotoCurrent:true,
  setDate:'',
  altField:'#departDate',
  altFormat:'yy-mm-dd',
  firstDay:1,
  minDate:'0',
  numberOfMonths:2,
  dateFormat:'D, d M, yy',
  onClose:function(selectedDate){
    selectedDate = (selectedDate == '') ? 0 : selectedDate;
    $('#R_date').datepicker('option', 'minDate', selectedDate);
  },
});
$('#R_date').datepicker({
  altField:'#returnDate',
  altFormat:'yy-mm-dd',
  firstDay:1,
  minDate:'0',
  numberOfMonths:2,
  dateFormat:'D, d M, yy',
});
$('#D_date').datepicker('setDate', new Date(new Date().getTime() + 86400000));
$('#R_date').datepicker('setDate', new Date(new Date().getTime() + 86400000));
$('.L-tripType .oneway label').on('click', function(){
  $('.section2 .r-date').addClass('hidden');
  $('#returnDate').attr('disabled', 'disabled');
});
$('.L-tripType .roundtrip label').on('click', function(){
  $('.section2 .r-date').removeClass('hidden');
  $('#returnDate').removeAttr('disabled');
});

$('#search_flights').on('click', function(){
    $('.checkError').addClass('hidden');
    $('.LS-trip input').removeClass('inputError');
    var check = function(form){
      var flag = true;
      if(form.from.value ==''){
        $('#D_city').addClass('inputError');
        $('.d-city .checkError').removeClass('hidden').text('You missed this');
        flag = false;
      }
      if($(form.from).data('country') != 'IN'){
        $('#D_city').addClass('inputError');
        $('.d-city .checkError').removeClass('hidden').text('International flights will be coming soon.');
        flag = false;
      }
      if($(form.to).data('country') != 'IN'){
        $('#A_city').addClass('inputError');
        $('.a-city .checkError').removeClass('hidden').text('International flights will be coming soon.');
        flag = false;
      }
      if(form.to.value ==''){
        $('#A_city').addClass('inputError');
        $('.a-city .checkError').removeClass('hidden').text('You missed this');
        flag = false;
      }
      if(form.departDate.value ==''){
        $('#D_date').addClass('inputError');
        $('.d-date .checkError').removeClass('hidden');
        // departFlag = false;
        flag = false;
      }
      if(!$('#returnDate').prop('disabled') && form.returnDate.value ==''){
        $('#R_date').addClass('inputError');
        $('.r-date .checkError').removeClass('hidden');
        flag = false;
      }
      return flag;
    };
    if(check(this.form)){
      window.location.href = paths.flightUrl($('#searchForm').serialize());
    }
  });
$('#A_passenger').on('change', function(){
    $('#C_passenger,#I_passenger').empty();
    var selectedNum = Number($(this).val());
    // console.log(selectedNum)
    for(var i = 0;i < 10 - selectedNum; i++ ){
      $('#C_passenger').append('<option value='+i+'>'+i+'</option>');
    }
    for(var i = 0;i < selectedNum + 1; i++){
      $('#I_passenger').append('<option value='+i+'>'+i+'</option>');
    }
});