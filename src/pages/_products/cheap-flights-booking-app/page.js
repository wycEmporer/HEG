const cookieUtil = require('cp').cookieUtil;
require('lessDir/base.less');
require('./content.less');
require('dataFormat');
import * as formReg from 'formVerify';
const store = require('store');
const utils = require('utils');
const paths = utils.path;

const accountPaths = utils.accountPath;
const queryObj = utils.parseQueryStr();
const IS_PROD = (process.env.NODE_ENV === 'production' && !IS_UAT) ? 'PROD' : 'TEST';
// 获取地区手机码
$(() =>{
  loadAreaCode();
  function loadAreaCode(){
    $.ajax({
      url: paths.areaCodeQuery(),
      type: 'GET',
      dataType: 'json',
      cache: true,
    }).done(res => {
      if(res.success){
        var $areaCode = $('#appLoadCodeSele');
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
    $(document).on('change', '.registerAreaCode', function(){
      $(this.form).find('.showSelect').val('+' + this.value);
    });
  }
});

// 发送短信
$(() => {
  $(document).on('click', '#sendMsgBtn', function(){
    function checkform(form){
      let flag = true;
      $(form).find('.checkError').addClass('hidden');
      if(form.mobileNo.value== '' || !formReg.mobReg.test(form.mobileNo.value)){
        $(form.mobileNo).siblings('.checkError').removeClass('hidden');
        flag = false;
      }
      return flag;
    }
    if(checkform(this.form)){
      let _this = this;
      let paramsData = `phone=${_this.form.appLoadCodeSele.value} ${_this.form.mobileNo.value}`;
      $.ajax({
        url: paths.getSendMsg(),
        type: 'GET',
        dataType: 'json',
        data:paramsData,
        headers: {'x-Device': 'PC'},
      }).done(res => {
        console.log(res);
        if(res.succ){
          alert('SMS Sent');        
        }
        if(!res.succ){
          alert('SMS Failed');
        }
      });
    }
    
  });
}); 