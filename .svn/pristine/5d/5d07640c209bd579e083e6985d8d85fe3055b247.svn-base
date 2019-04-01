var utils = require('utils');
var paths = utils.path;
var cookieUtil = utils.cookieUtil;
var accountPath = utils.accountPath;
require('../../_component/datetimePicker/bootstrap-datetimepicker.css');
require('../../_component/datetimePicker/bootstrap-datetimepicker.js');
require('../../_component/datetimePicker/bootstrap-datetimepicker.fr.js');
import {checkWithdrawal, profileCheckForm} from './checkForm.js';
import * as formReg from 'formVerify';
function renderView(viewElement, viewHtml, model){
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}
let cellPhone = '';
let Email = '';
let emailphone = '';
let newEmail = '';
let oldOTP  = null;
let userInfo = {
  firstName:'',
  lastName:'',
  sex:'',
  birthDate:''
};
let times = 0;
var userId = cookieUtil.getCookie('uid') ;
function profile() {
  var model = {};
  var url = accountPath.queryUserInfo();
  var viewHtml = $('#profileTpl').html();
  var viewElement = $('#rightside');
  $.ajax({
    url:url,
    type:'get',
    dataType:'json',
  }).done(function(data){
    model = data;
    Email = model.email ? model.email :''; 
    if(model.phoneConfirmed) {
      cellPhone = model.cellphone;
    }
    if(!model.email){
      model.email = 'Link to your email';
      model.btnText = 'Link';
    }else {
      model.btnText = 'Modify';
    }
    if(!model.firstName){
      model.firstName = 'Edit your profile';
    } else {
      userInfo = {
        firstName:model.firstName,
        lastName:model.lastName,
        sex:model.sex,
        birthDate:model.birthDate
      };
    }

    model.date = (model.birthDate || '0').slice(0, 2);
    model.month = (model.birthDate || '0').slice(3, 5);
    model.year = (model.birthDate || '0').slice(6, 10);


    function edit(){
      $(document).on('click', '#phone_OTP', function(){
        $('#editPhone').show();
        $('#SendCheck').click(function(){
          let times = 60;
          let timer = null;
          let editPhone = $('#phoneNum').val().trim();
          let editCode = $('#editAreaCode').val();
          let phoneOnOff_3 = true;
          if(editCode == '91'){
            if(editPhone.length < 10){
              phoneOnOff_3 = false;
            } else if(editPhone.length > 10) {
              phoneOnOff_3 = false;
            }
          } else if(editCode == '86'){
            if(editPhone.length < 11){
              phoneOnOff_3 = false;
            } else if(editPhone.length > 11) {
              phoneOnOff_3 = false;
            }
          }
          let that = this;
          if(!formReg.mobReg.test(editPhone) || !phoneOnOff_3){
            $(this).parents().siblings('.editDiv1').find('.checkError').removeClass('hidden');
            return;
          }
          
          this.disabled = true;
          $.ajax({
            url:paths.msgCodeQuery()+'?phone='+editCode+' '+editPhone,
            type:'get',
          }).done(function(res){
            if(res.success){
              $(that).parents().siblings('.editDiv1').find('.checkError').addClass('hidden');
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
            }else{
              $(that).parents().siblings('.editDiv1').find('.checkError').text(res.msg).removeClass('hidden');
              that.disabled = false;
            }
          });
        });
      });
    }
    
    $('#confirmEdit').click(function(){
      let checkCode = $('#phoneCheck').val();
      let editPhone = $('#phoneNum').val().trim();
      let editCode = $('#editAreaCode').val();
      let that = this;
      if(checkCode == ''){
        $(this).parents().siblings('.editDiv').find('.checkError').removeClass('hidden');
        return;
      }
      // this.disabled = true;
      $.ajax({
        url:paths.editMobileQuery()+'?phone='+editCode+' '+editPhone+'&otpCode='+checkCode,
        type:'get',
      }).done(function(res){
        if(res.succ){
          $(that).parents().siblings('.editDiv').find('.checkError').addClass('hidden');
          setTimeout(()=>{
            alert('Congratulations, your information has been successfully saved.');
            $('#editPhone').hide();
            $('#phoneNum').val('');
            $('#phoneCheck').val('');
            location.reload();
          }, 500);
        }else{
          alert(res.msg);
          $(that).parents().siblings('.editDiv').find('.checkError').text('Please enter correct verify code.').removeClass('hidden');
        }
      });
    });
    $('#CancelEdit').click(function(){
      $('#editPhone').hide();
      $('#phoneNum').val('');
      $('#phoneCheck').val('');
    });
    
    renderView(viewElement, viewHtml, model);
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
    
    $(document).on('change', '.registerAreaCode', function(){
      $(this).siblings('.showSelect').val('+' + this.value);
    });
    $('#editPhoneLabel').click(function(){
      $('#editPhone').hide();
    });
    
    // if(!cellPhone){
    //   $('#phone_OTP').removeClass('disabled');
    //   edit();
    // }else{
    //   $('#phone_OTP').addClass('disabled').attr('href', 'javascript:;');
    // }
    $('#my_setting').css('display', 'block').siblings('div').css('display', 'none').parents('#s_profile').css('display', 'block');
  });
}

$('#datetimepicker').datetimepicker({
  format: 'dd-mm-yyyy', 
   weekStart: 0,
   autoclose:true,
   minView : 2,
   bootcssVer: 3,
   endDate:new Date() 
});

$(document).on('click', '#editProfile', function(){
  $('#profile_info').modal('show');
});

$(document).on('click', '#setUserInfo1', function(){
  if(profileCheckForm(this)){
    let modifyInfo = profileCheckForm(this) + '&cellphone=' + cellPhone;
    $.ajax({
      url: accountPath.modifyUserInfo(),
      type: 'POST',
      data: modifyInfo,
    }).done(function(result){
      if(result.success){
        alert('Modify successfully');
        $('#profile_info').modal('hide');
        location.reload();
      } else {
        alert(result.msg);
      }
    });
  }
});
$(document).on('click', '#linkEmail', function(){
  linkEmailModal(1);
});

function linkEmailModal (index){
  $('#link_Email').modal('show');
  if(!Email) {
    $('#infoForm2').addClass('hidden');
    $('#infoForm3').removeClass('hidden');
    $('.modal_title').text('Link Your Email');
    setUserInfo3();
    return false;
  }
  let option = '';
  $('#emailAdr_1').empty();
  if(cellPhone){
    option = `<option value="0">${Email}</option>
    <option value="1">${cellPhone}</option>`;
  } else {
    option = `<option value="0">${Email}</option>`;
  }
  $('#emailAdr_1').append(option);
  $('#link_Email').find('#setUserInfo2').attr('index', index);
}

$('#inputKeyup').on('keypress', function(event){     
  event.stopPropagation();
  if(event.keyCode == 13){  
    $('#setUserInfo2').click();
    return false;
  } 
  
});

$('#SendCheck_1,#SendCheck_2').click(function(){
  const type = $(this).data('type');
  let url = '';
  let times = 60;
  let timer = null;
  let that = this;
  this.disabled = true;
  if(type == 1) {
    const emailindex = $('#emailAdr_1').val();
    const emailtext = $('#emailAdr_1 option:selected').text();
    if(emailindex == 1) {
      emailphone = '?cellphone=' + emailtext;
      url = accountPath.updateEmailSendOldOtp() + emailphone;
      
    }else  if( emailindex == 0){
      emailphone = '?email=' + emailtext;
      url = accountPath.updateEmailSendOldOtp() + emailphone;
      
    }
    
  } else if(type==2){
    newEmail = $('.Email_Add').val();
    if(newEmail == ''){
      alert('Please enter a vaild Email');
      this.disabled = false;
      return false;
    }
    url = accountPath.updateEmailSendNewOtp()+'?email=' + newEmail;
  }
  $.ajax({
    url:url,
    type:'get',
  }).done(function(res){
    if(res.succ){
      // $(that).parents().siblings('.editDiv1').find('.checkError').addClass('hidden');
      let times = res.data;
      timer = setInterval(function(){
        times --;
        that.value = times + 's';
        if(times <= 0){
          that.disabled = false;
          that.value = 'Send OTP';
          clearInterval(timer);
          times = 60;
        }        
      }, 1000);
    }else{
      // $(that).parents().siblings('.editDiv1').find('.checkError').text(res.msg).removeClass('hidden');
      alert(res.msg);
      that.disabled = false;
      // location.reload();
    }
  });
});

$(document).on('click', '#setUserInfo2', function(){
  const emailindex = $('#emailAdr_1').val();
  const emailtext = $('#emailAdr_1 option:selected').text();
  const index = $(this).attr('index');
  if(emailindex == 1) {
    emailphone = '?cellphone=' + emailtext;
    
  }else  if( emailindex == 0){
    emailphone = '?email=' + emailtext;
  }

  const _this = this;
  oldOTP = $('.verficCode').val().trim();
  if(oldOTP == ''){
    $(this).parents('.form-horizontal').find('.checkError').removeClass('hidden');
    return false;
  }

  $(this).parents('.form-horizontal').find('.checkError').addClass('hidden');
  $(this).addClass('progress-dynamic');

    $.ajax({
      url:accountPath.updateEmailVerifyOTP() + emailphone +'&otp=' + oldOTP,
      type:'GET',
      // data:data,
      headers:{'x-Device':'PC'},
      dataType: 'json'
    }).done(function(result){
      if(result.succ){
        if(index == 0) {
          $('#infoForm2').addClass('hidden');
          $('#infoForm5').removeClass('hidden');
          $('.modal_title').text('Modify Your Mobile Number');
        } else if(index == 1) {
          $('#infoForm2').addClass('hidden');
          $('#infoForm3').removeClass('hidden');
          $('.modal_title').text('Link Your Email');
          setUserInfo3();
        }
      }else {
        alert(result.msg);
        $(_this).removeClass('progress-dynamic');
      }
     
    }).fail(function(error){
      $(_this).removeClass('progress-dynamic');
    });
}); 


function setUserInfo3 () {
  $('#setUserInfo3').on('click', function(){
    const _this = this;
    const otpCode = $('.verficCode2').val().trim();
    newEmail = $('.Email_Add').val();
    if(newEmail == ''){
      $(this).parents('.form-horizontal').find('.emailError').removeClass('hidden');
      return false;
    }
    if(otpCode == ''){
      $(this).parents('.form-horizontal').find('.otpError').removeClass('hidden');
      return false;
    }
    $(this).parents('.form-horizontal').find('.checkError').addClass('hidden');
    $(this).addClass('progress-dynamic');
    var data = '';
    if(!Email) {
      data =  '?otpCode=' + otpCode +'&newEmail=' +newEmail;
    }else {
      data =  emailphone + '&oldOtp=' + oldOTP +'&otpCode=' + otpCode +'&newEmail=' +newEmail;
    }
    $.ajax({
      url:accountPath.updateEmail() + data,
      type:'GET',
      // data:data,
      headers:{'x-Device':'PC'},
      dataType: 'json'
    }).done(function(res){
      if(res.succ){
        location.reload();
      }else {
        alert(res.msg);
        $(_this).removeClass('progress-dynamic');
        // location.reload();
      }
      
    }).fail(function(error){
      $(_this).removeClass('progress-dynamic');
    });
  }); 
}
$(document).on('click', '#setUserInfo4', function(){
  // var data = 'action=register&email='+this.form.email.value+'&password='+this.form.password.value+'&cellphone='+this.
  // form.registerAreaCode.value +' ' + this.form.mobileNo.value.trim()+'&sendmsg='+this.form.sendmsg.checked+'&otp=' + this.form.verC.value.trim();
  if(checkForm(this.form)){
    $(this).addClass('progress-dynamic');
    $.ajax({
      url: accountPath.modifyUserPwd(),
      type:'POST',
      data: $(this.form).serialize()
    }).done((result) =>{
      if(result.success){
        alert('Modify successfully');
        location.reload();
      }else{
        alert(result.msg);
        $(this).removeClass('progress-dynamic');
      }
    });
  }
  function checkForm(thisform){
    var flag = true;
    $(thisform).find('.checkError').addClass('hidden');
    // var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    let $pwd = $(thisform).find('[name=password]');
    let $conPass = $(thisform).find('.conPass');
    let $newPwd = $(thisform).find('[name=newPassword]');

    if(!formReg.pwdReg.test($pwd.val())){
      $(thisform).find('.curPass_box .checkError').removeClass('hidden');
      flag = false;
    }
    if(!formReg.pwdReg.test($newPwd.val())){
      $(thisform).find('.newPass_box .checkError').removeClass('hidden');
      flag = false;
    }
    if($conPass.val().trim() == ''){
      $(thisform).find('.conPass_box .checkError').removeClass('hidden').text('Please re-enter the new password');
      flag = false;
    }else if($newPwd.val() != $conPass.val()){
      $(thisform).find('.conPass_box .checkError').removeClass('hidden').text('Two passwords must be same');
      flag = false;
    }
    return flag;
  }
}); 

$('.profile_info,.linkEmail,.changePass,.savePhone').on('hidden.bs.modal', function () {
  $('.checkError').addClass('hidden');
  $('.btn').removeClass('progress-dynamic');
  $('input').not('.btn,.showSelect,.inputin').val('');
  
  $('#infoForm2').removeClass('hidden');
  $('#infoForm3').addClass('hidden');
  $('#infoForm5').addClass('hidden');
  $('#submitOtp').addClass('disabled');
  $('.modal_title').text('Verify your identity');
  // setUserInfo3();
});
$('.profile_info').on('shown.bs.modal', function () {
  $(this).find('form').find('[name=firstName]').val(userInfo.firstName);
  $(this).find('form').find('[name=lastName]').val(userInfo.lastName);
  $(this).find('form').find('[name=birthday]').val(userInfo.birthDate);
  $(this).find('form').find('[name=sex]').val(userInfo.sex);
});

/**
 * // 未激活手机号验证
 */
$(document).on('click', '#phone-OTP', function(){
  ConfirmeFlag = false;
  sendPhoneOtp(ConfirmeFlag);
});


$(document).on('click', '.resend_otp', function(){
  sendPhoneOtp(ConfirmeFlag);
});

$(document).on('click', '#submitOtp', function(){
  let editCode = $(this).parents('.content_1').find('label').text().slice(2, 4);
  let editPhone = $(this).parents('.content_1').find('label').text().slice(5);
  let emailtext = editCode + ' ' + editPhone;
  let phoneOtp = $(this).parents('.content_1').find('.mobileOtp').val();
  $.ajax({
    url:accountPath.updateNewPhone(),
    type:'POST',
    // data:data,
    // headers:{'x-Device':'PC'},
    contentType:'application/json',
    dataType: 'json',
    data:JSON.stringify({
      'userId' :userId,
      'newPhone' : emailtext,
      'otp' : phoneOtp
    })

  }).done(function(result){
    if(result.code == 200){
      $('.savePhone .content_1').addClass('hidden').siblings('.content_2').removeClass('hidden');
    }else {
      $('.savePhone .content_1 .form-horizontal').find('.checkError').removeClass('hidden').text(result.msg);
    }
   
  }).fail(function(error){
    
  });
  
});

$('#save_phone').on('shown.bs.modal', function () {
  // dountDown();
  $('.mobileOtp').keyup(function(){
    let val = $(this).val();
    if(val.trim().length == 4) {
      $('#save_phone').find('.btn').removeClass('disabled');
    } else {
      $('#save_phone').find('.btn').addClass('disabled');
    }
  });
}); 

// 获取手机验证otp
function sendPhoneOtp (flag){
  let editCode = '';
  let editPhone = '';
  if(!flag) {
    editCode = $('.profile-wrap .registerAreaCode').val().trim();
    editPhone = $('.profile-wrap .user_phone').val().trim();
    if(editPhone.length == 0) {
      $('.profile-wrap .info-box .info.pull-left .checkError').removeClass('hidden');
      return false;
    }
    if(editCode == '91'){
      if(editPhone.length != 10){
        $('.profile-wrap .info-box .info.pull-left .checkError').removeClass('hidden');
        return false;
      } 
    } else if(editCode == '86'){
      if(editPhone.length != 11){
        $('.profile-wrap .info-box .info.pull-left .checkError').removeClass('hidden');
        return false;
      } 
    }
  } else {
    editCode = $('#save_phone').find('.content_1').find('label').text().slice(2, 4);
    editPhone = $('#save_phone').find('.content_1').find('label').text().slice(5);
  }

  verifyPhone(editCode, editPhone, ConfirmeFlag);
}

// 验证手机号是否有效 flag：
// true: 激活状态修改手机号，新手机号发送的otp ;
//  false : 未激活状态修改手机号发送的otp
function verifyPhone (editCode, editPhone, flag){
  $.ajax({
    url:accountPath.verifyPhone(),
    type:'POST',
    data:JSON.stringify({
        'userId':userId, //用户id，转成字符串
        'userModify':editCode + ' ' + editPhone//手机号码
        }),
    contentType:'application/json',
  }).done(function(res){
    if(res.code == 200){
      if(flag) {
        send_newPhone_OTP(editCode, editPhone);
      } else {
        send_Phone_OTP(editCode, editPhone);
      }
      
    }else{
      if(!flag) {
        $('.profile-wrap .info-box .info.pull-left .checkError').removeClass('hidden').text(res.msg);
      } else {
        $('.linkEmail').find('#infoForm5 .otpError').removeClass('hidden').text(res.msg);
      }
    }
  });
}

let phoneOtptimer = null;
function send_Phone_OTP (editCode, editPhone){
  let emailtext = editCode + ' ' + editPhone;
  $.ajax({
    url:accountPath.sendOTP(),
    type:'POST',
    contentType:'application/json',
    data:JSON.stringify({
        'userId':userId, //用户id，转成字符串
        'userModify':emailtext//手机号码
        })
  }).done(function(res){
    if(res.code == 200){
      times = res.data;
      otpCountdown(times, editCode, editPhone);
    }else{
      // $(that).parents().siblings('.editDiv1').find('.checkError').text(res.msg).removeClass('hidden');
      alert(res.msg);
      // location.reload();
    }
  });
}
function send_newPhone_OTP (editCode, editPhone){
  let emailtext = editCode + ' ' + editPhone;
  $.ajax({
    url:accountPath.sendSecondOTP() + '?phone=' + emailtext,
    type:'GET',
  }).done(function(res){
    if(res.code == 200){
      times = res.data;

      otpCountdown(times, editCode, editPhone);
    }else{
      // $(that).parents().siblings('.editDiv1').find('.checkError').text(res.msg).removeClass('hidden');
      alert(res.msg);
      // location.reload();
    }
  });
}

function otpCountdown (times, editCode, editPhone){
  $('#link_Email').modal('hide');
  var $save_phone = $('#save_phone');
  $save_phone.find('.modal-body .form-group label').text('+ ' + editCode + ' ' +  editPhone ); 
  $('#save_phone').modal('show');
  $('body').addClass('modal-open');
  $('body').css('padding-right', '17px');
  // 倒计时
  
  $('#save_phone .resendOtp').removeClass('resend_otp');
  phoneOtptimer = setInterval(function(){
    times --;
    $('#save_phone .time').text(times);
    if(times <= 0){
      $('#save_phone .resendOtp').addClass('resend_otp');
      clearInterval(phoneOtptimer);
      times = 0;
    }        
  }, 1000);
}

$('.save_phone').on('hidden.bs.modal', function () {
  clearInterval(phoneOtptimer);
});


/**
 * // 激活手机号修改
 */
 
 let ConfirmeFlag = false;

$(document).on('click', '#phone_OTP', function(){
  linkEmailModal(0);
});
$(document).on('click', '#sendPhoneOtp', function(){
  let editCode = $(this).parents('#infoForm5').find('.registerAreaCode').val().trim();
  let editPhone = $(this).parents('#infoForm5').find('.newPhone').val().trim();
  if(editPhone.length == 0) {
    $(this).parents('#infoForm5').find('.otpError').removeClass('hidden');
    return false;
  }
  if(editCode == '91'){
    if(editPhone.length != 10){
      $(this).parents('#infoForm5').find('.otpError').removeClass('hidden');
      return false;
    } 
  } else if(editCode == '86'){
    if(editPhone.length != 11){
      $(this).parents('#infoForm5').find('.otpError').removeClass('hidden');
      return false;
    } 
  }
  ConfirmeFlag = true;
  verifyPhone(editCode, editPhone, true);
});
export { profile };