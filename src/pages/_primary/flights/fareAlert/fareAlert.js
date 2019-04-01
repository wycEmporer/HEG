require('./fareAlert.less');
const cookieUtil = require('cp').cookieUtil;
import * as formReg from 'formVerify';
const utils = require('utils');
const paths = utils.path;
const messagePath = utils.messagePath;
let flightToken = '';
let  emailVal = '';
var  phoneVal = '';
let isLogin =  cookieUtil.getCookie('uuid') !== null ? true : false;


$('#getFareAlert').on('shown.bs.modal', function () {
  $(this).find('.Trips .fCity').text($($('#city_route li')[0]).find('.city').text());
  $(this).find('.Trips .fData').text($($('#city_route li')[0]).find('.time ').text());
  $(this).find('.Trips .tCity').text($($('#city_route li')[2]).find('.city').text());
  $(this).find('.Trips .tData').text($($('#city_route li')[2]).find('.time').text());
  $(this).find('.Trips .tripIcon').addClass($($('#city_route li')[1]).find('.city-arrow').hasClass('round') ?  'round' : '');
  if(isLogin) {
    $(this).find('.loginHidden').addClass('hidden');
  }
  $('#emailInput').focus();
  flightToken = sessionStorage.getItem('flightToken');
});
$('#getFareAlert').on('hidden.bs.modal', function () {
  $(this).find('.checkError').addClass('hidden');
});

$(document).on('click', '#insCheckBox', function () {
  $('#fareAlertBtn').toggleClass('disabled');
});
$(document).on('click', '#fareAlertBtn', function () {

  if($(this).hasClass('disabled')) return false;
  emailVal = isLogin ? cookieUtil.getCookie('email') : $('#emailInput', $('#loginForm')).val().trim();
  phoneVal = isLogin ? '' : $('#phoneInput', $('#loginForm')).val().trim();
  let areaCode =  $('#loginForm')[0].areaCode.value;
  const  phone = isLogin ? (cookieUtil.getCookie('phone')): (phoneVal !='' ? areaCode + ' ' + phoneVal : '');
  var data = '?token=' + flightToken + '&phone=' + phone + '&email=' + emailVal;
  if(isLogin || checkForm($('#loginForm')[0])){
    $.ajax({
      url: messagePath.saveFlightPriceAlert() + data,
      type: 'GET',
      dataType: 'json',
    }).done(res => {
      if(res.success){
        $('#getFareAlert').modal('hide');
        $('#subSuccModal').modal('show');
        $('#getFareAlert').on('hidden.bs.modal', function (){
          
          $('body').addClass('modal-open');
          $('body').css('padding-right', '17px');
          setTimeout(function() {
            $('#subSuccModal').modal('hide');
          }, 1500);
        });		
      } else {
        $('#getFareAlert').modal('hide');
        alert(res.msg);
      }
    });
  }
});
function checkForm(thisform){ 

  var flag = true;
  let phoneOnOff = true;
  if(phoneVal != '') {
    var phoneLength = phoneVal.length;
    let areaCode = thisform.areaCode.value;
    if(areaCode == '91'){
      if(phoneLength < 10){
        
        phoneOnOff = false;
      } else if(phoneLength > 10) {
      
        phoneOnOff = false;
      }
    } else if(areaCode == '86'){
      if(phoneLength < 11){
        
        phoneOnOff = false;
      } else if(phoneLength > 11) {
        
        phoneOnOff = false;
      }
    }
  }
  $(thisform).parents('.modal-content').find('.checkFailure').addClass('hidden');
   $(thisform).find('.checkError').addClass('hidden');
   $(thisform).find('.form_control').removeClass('errBorder');
  if(phoneVal == '' && emailVal == ''){
    $(thisform).find('.checkError').removeClass('hidden');
    $(thisform).find('.form_control').addClass('errBorder');
    flag = false;
  } else if(emailVal != '' && !formReg.emailReg.test(emailVal)){
    $(thisform).find('.emailBox .checkError').removeClass('hidden');
    $(thisform).find('.emailBox .form_control').addClass('errBorder');
    flag = false;
  } else if(phoneVal != '' && (!formReg.mobReg.test(phoneVal) || !phoneOnOff)){
    $(thisform).find('.phoneBox .checkError').removeClass('hidden');
    $(thisform).find('.telBox .form_control').addClass('errBorder');
    flag = false;
  }
  return flag;
}

loadAreaCode();
function loadAreaCode(){
  $.ajax({
    url: paths.areaCodeQuery(),
    type: 'GET',
    dataType: 'json',
    cache: true,
  }).done(res => {
    if(res.success){
      var $areaCode = $('.registerAreaCode');
      var optionArr = [];
      res.list.forEach(function(val, key){
        if(val.regionCode == 91){
          var option = `<option value="${val.regionCode}" selected>${val.countryName +' (+'+ val.regionCode})</option>`;
        } else {
          var option = `<option value="${val.regionCode}">${val.countryName +' (+'+ val.regionCode}) </option>`;
        }
        optionArr.push(option);
      });
      $areaCode.html(optionArr.join(''));
    }
  });
}


 
