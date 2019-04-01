require('!!bootstrap-webpack!bootstrapConfig');
// require('metisMenu/metisMenu.min.css');
require('iconfontDir/font-awesome.css');
require('lessDir/base.less');
require('metisMenu/metisMenu.min');
import {getCamCouInfo} from '../../pages/_component/couponModal/index';
const utils = require('utils');
const paths = utils.path;
const accountPath = utils.accountPath;
var queryObj = utils.parseQueryStr();
import * as formReg from 'formVerify';
let phoneOnOff = true;
const cookieUtil = {
  setCookie: function (name, value){
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + '='+ escape (value) + ';expires=' + exp.toGMTString()+';path=/';
  },
  getCookie: function (name){
    var arr, reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)');
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
  },
  delCookie: function (name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=this.getCookie(name);
    if(cval!=null)
    document.cookie= name + '='+cval+';expires='+exp.toGMTString()+';path=/';
  }
};
/************* config global **********/
Number.prototype.toThree = function(){
  return this.toString().replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
};
String.prototype.toThree = function(){
  return this.toString().replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
};

_.templateSettings = {
  evaluate    : /\{\{([\s\S]+?)\}\}/g, 
  interpolate : /\{\{=(.+?)\}\}/g,  // replace value
  escape      : /\{\{-([\s\S]+?)\}\}/g,
};
_.mixin({filterObj:function(obj, predicate, context){
    var results = {};
    // predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results[index] = value;
    });
    return results;
  }});

/*************** end config ***************/
// 导航栏切换样式
$(function(){
  
  var src = window.location.pathname.split('/');
  if(src[1] ==''|| src[1] == 'home'){
    sessionStorage.setItem('itemRole', 'home');
    // window.location.href='/home'; 
  }
  const itemRole = src[1] || sessionStorage.getItem('itemRole');
  // const itemRole1 = itemRole == (null || '') ? 'flight' : itemRole;
  $('#header .item-wrap li .' + itemRole +'').parent('li').addClass('itemActive');
  $('#newheader .item-wrap li .' + itemRole +'').parent('li').addClass('itemActive');
  $('#newheader .item-wrap li').hover(
    function(){
    $(this).siblings('li').removeClass('itemActive');
    },
    function(){
      $('#newheader .item-wrap li .' + itemRole +'').parent('li').addClass('itemActive');
    }
  );

});

 // 底部热门城市切换
 $('.cheapBox a').hover(function(){
  // $(this).parents('.cheapTrip').find('li').removeClass('active');
  $(this).parents('.cheapTrip').siblings('.cheapTrip-r').find('li').removeClass('active');
  $(this).parents('.cheapTrip').siblings('.cheapTrip').find('li').removeClass('active');
  $(this).parents('li').addClass('active');
}, function(){
  $(this).parents('li').removeClass('active');
});

$('.linkBox ul li a').hover(function(){

  $(this).parents('ul').find('li').removeClass('active');
  $(this).parents('div').siblings('div').find('li').removeClass('active');
  // $(this).parents('div').siblings('div').find('li').removeClass('active');
  $(this).parents('li').addClass('active');
}, function(){
  $(this).parents('li').removeClass('active');
});


$(document).on('click', '#header .item-wrap li a', function(){
  const itemRole = $(this).data('role');
  sessionStorage.setItem('itemRole', itemRole);
});

$(document).on('click', '#newheader .item-wrap li a', function(){
  const itemRole = $(this).data('role');
  sessionStorage.setItem('itemRole', itemRole);
});

const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;

$(document).ajaxError(function(e, jqxhr, settings, exception){
  if(jqxhr.status == 'undefined'){
    return;
  }
  if(jqxhr.status == 401){
    $('#login_modal').modal({
remote: '/static/tpl/loginTpl.html', show: true
});
  }
});
//   add cookie refUrl if previous page not happyeasyg page
if(document.referrer != '' && document.referrer.indexOf('happyeasygo.com') < 0){
  cookieUtil.setCookie('refurl', document.referrer);
}

$(() =>{

  // change website  phone
  $.getJSON(paths.getSiteInfo()).then((res) =>{
    if(res.code === 0){
      var phoneArr = res.webSiteInfo.websitePhone.split('/');
      var html = '';
      phoneArr.forEach(function(value, index){
        html = html + `<a href="tel:${value}" class="" style=''>${value}</a>`;  
      });
      $('#header .phoneNo').html(html);
    }
    // tel:18003135699
  });

  // get ann ad
  $.ajax({
    url: paths.getPromotionInfo() + 'type=28&device=1',
    dataType: 'json',
    type: 'GET'
  }).then((res) => {
    if(res.success && Object.prototype.toString.call(res.list) == '[object Array]' ){
      var timestamp_ad = new Date(Date.parse(res.list[0].endDate.replace(/-/g, '/'))) - new Date();
      if(timestamp_ad > 0) {
        $('.firstAnn a').attr('href', res.list[0].href);
        $('.firstAnn a img').attr('src', res.list[0].url);
      }
    }
  });
});
// ga ************* google analytics *****************

$(() => {
  function createFunctionWithTimeout(callback, opt_timeout) {
    var called = false;
    function fn() {
      if (!called) {
        called = true;
        callback();
      }
    }
    setTimeout(fn, opt_timeout || 1000);
    return fn;
  }

  $('a[href="#hotelTab"]').on('click', function(){
    if(window.ga){
      window.ga('HotelTracker.send', 'event', 'flightPage', 'click', 'hotelsTab');
    }
   
  });
  
  $('a.item.hotel').on('click', function(e){
    e.preventDefault();
    let _this = this;
    if(window.ga){
      window.ga('HotelTracker.send', 'event', 'flightPage', 'click', 'hotelLink', {hitCallback: createFunctionWithTimeout(function(){
        window.location.href = _this.href;
      })});
    }else{
      window.location.href = _this.href;
    }
  });
});

// ga ************* google analytics *****************
function signinCtrl(){
  $('#header .logIn, #newheader .logIn').addClass('menu-text');
  $('#header .logIn, #newheader .logIn').text(cookieUtil.getCookie('username').replace(/\"/g, ''));
  $('.sing-box').css('border', 'none');
  $('#header .register, #newheader .register').addClass('hidden');
  $('#header .Segmentation, #newheader .Segmentation').addClass('hidden');
  // $('#header .menu-text').text(cookieUtil.getCookie('username').replace(/\"/g, ''));
  $('#header .anchorCancel,#newheader .anchorCancel').removeClass('hidden');
  $('.primaryNav .anchorCancel').removeClass('hidden');
}
if(cookieUtil.getCookie('uuid') !== null){
  signinCtrl();
  var loginFlag = JSON.parse(localStorage.getItem('loginFlag'));

  if(loginFlag && new Date() - new Date('2019-03-01 00:00:00') >= 0) {
    getCamCouInfo(); 
  }
  localStorage.setItem('loginFlag', JSON.stringify(false));
}
// sign out
$('body').on('click', '#signOut', function(){
  $.get('https://hotel.happyeasygo.com/api/web/logout', function(){
    console.log('success');
  });
  $.get(paths.logout(), function(){
    cookieUtil.delCookie('uuid');
    location.reload();
    // $('#header .logIn').html('<a href="/static/tpl/loginTpl.html" data-toggle="modal" data-target="#login_modal">Sign in</a>');
    // $('#header .menu-text').text('Your trip');
    $('#header .login').removeClass('menu-text');
  });
});



$('#login_modal,#register_modal,#f_detail_modal').on('hidden.bs.modal', function(){
  $(this).removeData('bs.modal');
  PicVerificonOff = true;
});
$('#register_modal').on('shown.bs.modal', function(){
  loadAreaCode();
});

$('#login_modal').on('loaded.bs.modal', function(){
  loadAreaCode();
  $('body').addClass('modal-open');
  $('body').css('padding-right', '17px');
  $('.password').val('');
  const phone = cookieUtil.getCookie('phone') == null ? '' : cookieUtil.getCookie('phone').replace(/\"/g, '');
  const username = cookieUtil.getCookie('username') == null ? '' : cookieUtil.getCookie('username').replace(/\"/g, '');
  if(phone == ''){
    $('#user_phone').val('');
    return false;
  }
  const phoneNo = phone.split(' ')[1];
  $('#user_phone').val(phoneNo);
  $('#user_email').val(username);
  
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $('.password').val('');
  });
});

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

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
  
  $('.icon-refer').tooltip('show');
  $('.item-wrap_2 li i.icon').not('.icon-refer').hover(function(){
    $('.icon-refer').tooltip('hide');
  });
});

// 切换验证码
$(document).on('click', '#RefreshBtn,#PicVerific', function(){
  var src = $('#PicVerific').attr('src').split('?')[0];
  $('#PicVerific').attr('src', src + '?' + Math.random().toFixed(4));
 });

$(document).on('change', '.registerAreaCode', function(){
  $(this.form).find('.showSelect').val('+' + this.value);
 });

$('body').on('click', '.resetPwd', function(){
  $(this).parents('.modal-content')
  .html('<div class="log-loading"><img src="/static/images/loading.jpg" alt=""></div>')
  .load('/static/tpl/reset-password.html');
});

$('body').on('click', '#creatAccount', function(){
  $('#login_modal').modal('hide');
});

$('body').on('click', '#login-link', function(){
  $('#register_modal').modal('hide');
  
  //  $(this).parents('.modal-content')
  // .html('<div class="log-loading"><img src="/static/images/loading.jpg" alt=""></div>')
  // .load('/static/tpl/loginTpl.html');
});
$('#register_modal,#login_modal').on('shown.bs.modal', function (event) {
  $('body').addClass('modal-open');
});
// facebook
$('body').on('click', '.loginselect .fb', function(){
  $(self).parents('.modal').modal('hide');
  location.href = '/heg_api/login/code.do';
});

$('body').on('click', '.login-btn', function(){

  let type = $(this).data('type');
  var phoneNo = null;
  var password = $(this.form).find('[name=password]').val();
  let areaCode = this.form.areaCode && this.form.areaCode.value;
  var paramsData = '';
  var self = this;
  if(checkForm(this.form)){
    if(type == 1) {
      phoneNo = $(this.form).find('[name=phoneNo]').val();
      phoneNo =  areaCode +' '+ phoneNo;
      paramsData = '?cellphone=' + phoneNo + '&password=' + password + '&type=' + type;
    }else if(type == 2){
      phoneNo = $(this.form).find('[name=email]').val();
      paramsData = '?userName=' + phoneNo + '&password=' + password + '&type=' + type;
    }
    
    $(this).addClass('progress-dynamic');
    $.ajax({
      url: paths.loginNew() + paramsData,
      type: 'GET',
      headers:{'x-Device':'PC'},
      dataType: 'json'
    }).done((res) => {
      try{
        let trackObj = {
          apiMethodName: 'login',
          apiRequestParamter: data,
          apiHttpStatus: '200',
          apiResponseStatus: res.success,
          elementId: 'login-btn'
        };
        window.hegTrackCallback(trackObj);
      }catch(e){}
      if(res.code === 1){
        
        // cookieUtil.setCookie('username', self.form.userName.value);
        $(self).parents('.modal').modal('hide');
        var phoneEdit = cookieUtil.getCookie('phone');
        var userEdit = cookieUtil.getCookie('username');
        if(phoneEdit){
          // 如果 login-btn 有路径，则跳转次路径
          let pathToUrl = $(this).data('url');
          if(pathToUrl){
            location.href = pathToUrl;
            return;
          }
          location.reload();
          localStorage.setItem('loginFlag', JSON.stringify(true));
        }else{
          setTimeout(function(){
            alert('Dear '+userEdit+'. Please register your mobile number now to enjoy our services.');
            location.href = '/account/?src=profile';
          }, 500);
        }
      }else if(res.code === 0){
        $(self).parents('.modal-content')
        .html('<div class="log-loading"><img src="/static/images/loading.jpg" alt=""></div>')
        .load('/static/tpl/registerVerify.html', function(){
          var emailAdr = self.form.userName.value;
          $('.verifyemail').text(emailAdr);
          $('.verifyBtn, .verifyemail').attr('href', hash[emailAdr.replace(/.+@(.+)/, '$1')])
          .click(function(){
            $(this).parents('.modal').modal('hide');
          });
        });
      }else{
        $(self).parents('.modal-content').find('.checkFailure').text(res.msg).removeClass('hidden');
        $(self).removeClass('progress-dynamic');
      }
    }).fail(function(error){
      try{
        let trackObj = {
          apiMethodName: 'login',
          apiRequestParamter: data,
          apiHttpStatus: error.status || '200',
          apiResponseStatus: false,
          elementId: 'login-btn'
        };
        window.hegTrackCallback(trackObj);
      }catch(e){}
      $(self).removeClass('progress-dynamic');
    });
  }
  function checkForm(thisform){
    
    var flag = true;
    let phoneOnOff = true;
    if(type==1) {
      var phoneLength = $('#user_phone', $(thisform)).val().trim().length;
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
    if(type==1 && (!formReg.mobReg.test($('#user_phone', $(thisform)).val().trim()) || !phoneOnOff)){
      $(thisform).find('.error_info .checkError').removeClass('hidden').text('Please enter a valid phoneNo');
      flag = false;
    }

    if( type==2 && !formReg.emailReg.test($('#user_email', $(thisform)).val().trim())){
      $(thisform).find('.error_info .checkError').removeClass('hidden').text('Please enter a valid Email Address');
      flag = false;
    }
    
    if( !formReg.pwdReg.test($('.password', $(thisform)).val()) ){
      $(thisform).find('.error_info .checkError').removeClass('hidden').text('Please enter password (6 - 32 characters)');
      flag = false;
    }
    return flag;
  }
});
var hash={   
  'qq.com': 'http://mail.qq.com',   
  'gmail.com': 'http://mail.google.com',   
  'sina.com': 'http://mail.sina.com.cn',   
  '163.com': 'http://mail.163.com',   
  '126.com': 'http://mail.126.com',   
  'yeah.net': 'http://www.yeah.net/',   
  'sohu.com': 'http://mail.sohu.com/',   
  'tom.com': 'http://mail.tom.com/',   
  'sogou.com': 'http://mail.sogou.com/',   
  '139.com': 'http://mail.10086.cn/',   
  'hotmail.com': 'http://login.live.com/',   
  'live.com': 'http://login.live.com/',   
  'live.cn': 'http://login.live.cn/',   
  'live.com.cn': 'http://login.live.com.cn',   
  '189.com': 'http://webmail16.189.cn/webmail/',   
  'yahoo.com.cn': 'http://mail.cn.yahoo.com/',   
  'yahoo.cn': 'http://mail.cn.yahoo.com/',   
  'eyou.com': 'http://www.eyou.com/',   
  '21cn.com': 'http://mail.21cn.com/',   
  '188.com': 'http://www.188.com/',   
  'foxmail.coom': 'http://www.foxmail.com'   
  };

$(document).on('click', '#sendMbOtp', function(){
  let times = 60;
  let timer = null;
  let phoneOnOff1 = true;
  let mobileNo = $('#mobileNo').val().trim();
  let regionCode = $('#registerAreaCode').val();
  if(regionCode == '91'){
    if(mobileNo.length < 10){
      
      phoneOnOff1 = false;
    } else if(mobileNo.length > 10) {
     
      phoneOnOff1 = false;
    }
  } else if(regionCode == '86'){
    if(mobileNo.length < 11){
      
      phoneOnOff1 = false;
    } else if(mobileNo.length > 11) {
      
      phoneOnOff1 = false;
    }
  }
  let that = this;
  $(this).parents('.mobile-box').find('.checkError').addClass('hidden');
  if(!formReg.mobReg.test(mobileNo) || !phoneOnOff1){
    $(this).parents('.mobile-box').find('.checkError').removeClass('hidden');
    return;
  }
  this.disabled = true;
  $.ajax({
    url:utils.accountPath.getRegOtpByMob() + '?phone='+regionCode + ' ' + mobileNo,
    type:'GET',
  }).done(function(res){
    if(res.code == 0){
      let times = res.lastSendTime;
      timer = setInterval(function(){
        times --;
        that.value = times + 's resend';
        if(times <= 0){
          that.disabled = false;
          that.value = 'Confirm';
          clearInterval(timer);
          times = 60;
        }
      }, 1000);
    }else if(res.code == 1){
      $(that).parents('.mobile-box').find('.checkError').text('The mobile number has existed').removeClass('hidden');
      that.disabled = false;
    }else {
      $(that).parents('.mobile-box').find('.checkError').text(res.msg).removeClass('hidden');
      that.disabled = false;
    }
  });

});
let PicVerificonOff = true;
$(document).on('click', '#registerBtn', function(){
  // $(this).addClass('progress-dynamic');
  var self = this;
  var codeValue = PicVerificonOff ? '' : this.form.VerifiCode.value;
  var data = {
    action : 'register',
    email : this.form.email.value,
    newPassword : this.form.password.value,
    cellphone : this.form.registerAreaCode.value +' ' + this.form.mobileNo.value.trim(),
    sendmsg : this.form.sendmsg.checked,
    otp : this.form.verC.value.trim(),
    code : codeValue
  };
  if(checkForm(this.form)){
    $(this).addClass('progress-dynamic');
    $.ajax({
      url:paths.registerByPhoneAndCode(),
      type:'POST',
      data:JSON.stringify(data),
      headers:{
        'x-Device':'PC',
        'Content-Type':'application/json'
      },
      dataType: 'json'
    }).done(function(result){
      try{
        let trackObj = {
          apiMethodName: 'registerByPhone',
          apiRequestParamter: data,
          apiHttpStatus: '200',
          apiResponseStatus: res.success,
          elementId: 'login-btn'
        };
        window.hegTrackCallback(trackObj);
      }catch(e){}
      if(result.success == false && result.needCode == true){
        PicVerificonOff = false;
        $('.PicVerific-box').removeClass('hidden');
        $('.PicVerific-box1').removeClass('hidden');
        $(self).parents('.modal-content').find('.checkFailure').text('Please enter Verification Code').removeClass('hidden');
        $(self).removeClass('progress-dynamic');
      } else if(result.success == true) {
        location.replace(location.href.replace(/[&]?request=register/g, ''));
      } else{
        $(self).parents('.modal-content').find('.checkFailure').text(result.msg).removeClass('hidden');
        $(self).removeClass('progress-dynamic');
      } 
    }).fail(function(error){
      try{
        let trackObj = {
          apiMethodName: 'registerByPhone',
          apiRequestParamter: data,
          apiHttpStatus: error.status || '200',
          apiResponseStatus: false,
          elementId: 'registerBtn'
        };
        window.hegTrackCallback(trackObj);
      }catch(e){}
      $(self).removeClass('progress-dynamic');
    });
  }
  function checkForm(thisform){
    var flag = true;
    $(thisform).find('.checkError').addClass('hidden');
    
    // var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if(!formReg.emailReg.test($('#email', $(thisform)).val().trim())){
      $(thisform).find('.username-box .checkError').removeClass('hidden');
      flag = false;
    }

    if(!formReg.mobReg.test(thisform.mobileNo.value.trim()) || !phoneOnOff){
      $(thisform).find('.mobile-box .checkError').removeClass('hidden');
      flag = false;
    }

    if($('[name=verC]', $(thisform)).val().trim() == ''){
      $(thisform).find('.verify-box .checkError').removeClass('hidden');
      flag = false;
    }
    if($('#password', $(thisform)).val() == ''){
      $(thisform).find('.password-box .checkError').removeClass('hidden');
      flag = false;
    }
    if($('#password2', $(thisform)).val() == '' || $('#password2', $(thisform)).val() != $('#password', $(thisform)).val() ){
      $(thisform).find('.password2-box .checkError').removeClass('hidden');
      flag = false;
    }
    if(!PicVerificonOff){
      if($('#VerifiCode', $(thisform)).val() == ''){
        $(thisform).find('.PicVerific-box .checkError').removeClass('hidden');
        flag = false;
      }
    }
    
    return flag;
  }
});
$(document).on('click', '#resetPwdBtn', function(){
  let _this = this;
  if(checkForm(this.form)){
    $(this).addClass('progress-dynamic');
    $.ajax({
      url: paths.applyNewPwd() + '?userName=' + _this.form.email.value,
      type:'GET',
      dataType:'json'
    }).done((res) => {
      if(res.success == true){
        let usracc = JSON.stringify(res.data);
        sessionStorage.setItem('usracc', usracc);
        location.href = '/passport';
      }else{
        $(_this).parents('.modal-content').find('.checkFailure').text(res.msg).removeClass('hidden');
        $(_this).removeClass('progress-dynamic');
      } 
    });
  }
  function checkForm(thisform){
    return true;
  }
});

$(() =>{
  // if not sign in show modal
  $('.yours .fore:not(:first)').click(function(){
    if(cookieUtil.getCookie('uuid') == null){
      $('#login_modal').modal({
        show:true,
        remote:'/static/tpl/loginTpl.html'
      });
      return false;
    }
  });
  $('#feedback-wrap').on('click', function(){
    $('.feedback-wrap2').click();
  });
  $('.feedback-wrap2').click(function(){
    $(this).animate({right:'-100%'}, 400, function(){
      $('#Fb-con').animate({right:0}, 600);
    });
  });
  $('#Fb-con .close,#Fb-cancle,#feedBackClose').click(function(){
    $('#Fb-con').animate({right:'-100%'}, 600, function(){
      $('.feedback-wrap2').animate({right:0}, 400);
    });
    // $('#Fb-con').css({right:'-100%'});
    // $('#feedback-wrap').animate({right:0}, 400);
    // alert('Thanks your Feedback');
  });
  $('#Fb_sub').click(function(){
    $(this.form).find('.checkError').addClass('hidden');
    if(this.form.name.value.trim() == ''){
      $(this.form.name).parent('.form-group').find('.checkError').removeClass('hidden');
      return;
    }
    if(!formReg.emailReg.test(this.form.email.value)){
      $(this.form.email).parent('.form-group').find('.checkError').removeClass('hidden');
      return;
    }
    if(this.form.content.value.trim() == ''){
      $(this.form.content).parent('.form-group').find('.checkError').removeClass('hidden');
      return;
    }
    var that = this;
    var data = $(this.form).serialize();
    $.ajax({
      url:accountPath.feedbackUrl(),
      type:'POST',
      data:data,
      dataType:'json'
    }).done((result) => {
      if(result.success){
        $('#Fb-con').css({right:'-100%'});
        $('.feedback-wrap2').animate({right:0}, 400);
        that.form.name.value = '';
        that.form.email.value = '';
        that.form.content.value = '';
        alert('Thanks your Feedback');
      }
    });
  });
});

module.exports = {cookieUtil:cookieUtil};