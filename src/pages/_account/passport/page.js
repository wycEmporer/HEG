const cookieUtil = require('cp').cookieUtil;
require('lessDir/base.less');
require('./content.less');
import {pwdReg, emailReg} from 'formVerify';

var utils = require('utils'); 
var queryObj = utils.parseQueryStr();
let isLogin = cookieUtil.getCookie('uuid') ? true : false;

$(() =>{
  if(queryObj.pay == 1){
    if(isLogin){
      let email = cookieUtil.getCookie('email').replace(/\"/g, '');
      $.getJSON(utils.path.applyNewPwd() + '?userName=' + email).done(function(res){
        if(res.success == true){
          let option = [];
          let usracc = res.data;
          for(var i =0; i < usracc.length; i ++){
            let str = '<option value=\''+ usracc[i] +'\'>'+ usracc[i] + '</option>';
            option.push(str);
          }
          $('#emailAdr').append(option.join(' '));
        }
      });
    }else{
      $('#login_modal').modal('show').find('.modal-content').load('/static/tpl/loginTpl.html');
      return;
    }
    
  }else{
    let usracc = JSON.parse(sessionStorage.getItem('usracc'));
    // if login 
    if(!usracc){
      location.href = '/';
      return;
    }
    let option = [];
    for(var i =0; i < usracc.length; i ++){
      let str = '<option value=\''+ usracc[i] +'\'>'+ usracc[i] + '</option>';
      option.push(str);
    }
    $('#emailAdr').append(option.join(' '));
  }

  $('#sendEmailBnt').on('click', function(){
    let times = 60;
    let timer = null;
    let email = $('#emailAdr').val();
    let that = this;
    let sendData, url;
    if(email.indexOf('@') > -1){
      sendData = '?email=' + email;
    }else{
      sendData = '?cellphone=' + email;
    }
    
    if(queryObj.pay == 1){
      url = utils.path.getPayPwdOtp();
    }else{
      url = utils.path.getLogPwdOtp();
    }
    $.ajax({
      url:url + sendData,
      type:'GET',
    }).done(function(res){
      if(res.success){
        that.disabled = true;
        let times = res.lastSendTime;
        timer = setInterval(function(){
          times --;
          that.value = times + 's resend';
          if(times <= 0){
            that.disabled = false;
            that.value = 'Send OTP';
            clearInterval(timer);
            times = 60;
          }
        }, 1000);
      }else if(res.code ===2){
        $('#emailAdr').parents('.form-group').addClass('has-error').find('.checkError').text(res.msg).removeClass('hidden');
      }else{
        alert(res.msg);
        return;
      }
    });
  });
  function checkForm(form){
    let flag = true;
    $(form).find('.form-group').removeClass('has-error');
    $(form).find('.checkError').addClass('hidden');
    if(!pwdReg.test($('#newPwd').val())){
      flag = false;
      $('#newPwd').parents('.form-group').addClass('has-error').find('.checkError').removeClass('hidden');
    }
    if($('#conPwd').val() !== $('#newPwd').val()){
      flag = false;
      $('#conPwd').parents('.form-group').addClass('has-error').find('.checkError').removeClass('hidden');
    }
    if(form.verifyCode.value.trim() == ''){
      $(form.verifyCode).parents('.form-group').addClass('has-error').find('.checkError').removeClass('hidden');
      flag = false;
    }
    return flag;
  }

  $('#setPwd').on('click', function(){
    let that = this;
    if(checkForm(this.form)){
      let sendData, url;
      let email = $('#emailAdr').val();
      if(queryObj.pay == 1){
        sendData = {
          payPassword: this.form.newPassword.value,
          otp: this.form.verifyCode.value.trim()
        };
        url = utils.path.setPayPwd();
      }else{
        sendData = {
          password:this.form.newPassword.value,
          otp:this.form.verifyCode.value.trim()
        };
        url = utils.path.resetPwd();
      }
      if(email.indexOf('@') > -1){
        sendData.email = email;
      }else{
        sendData.cellphone = email;
      }
      $.ajax({
        url:url,
        type:'POST',
        data: sendData,
        dataType:'json'
      }).done(function(result){
        if(result.success){
          alert('Set successfully');
          location.replace('/');
        }else{
          $(that.form.verifyCode).parents('.form-group').addClass('has-error').find('.checkError').removeClass('hidden');
        }
      });
    }
  });

  
});