require('./content.less');
require('./fileUpload/css/zyUpload.css');
import {ZYFILE} from './fileUpload/js/zyFile';
require('./fileUpload/js/zyUpload.js');
require('cp');
import * as formReg from 'formVerify';
import {cookieUtil, path} from 'utils';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
const jobId = window.location.search; 
var positionId = 0; 
var departmentId = 0; 
var href=  window.location.href;
$(() =>{
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  getWorkMessage();
  function getWorkMessage(){
    $.ajax({
      url: path.getWorkMessage() + jobId,
      type: 'GET',
      dataType: 'json',
    }).done(function (res) {
      if(res.succ){
        var model = res.data;
        var myDate = new Date(1528919092000)+'';
        var month = myDate.substr(4, 3),
          day = myDate.substr(8, 2),
          year = myDate.substr(11, 4);
        model.creatData = day + ' ' + month + ', ' + year;
        renderView($('#wrap'), $('#wrapTpl').html(), {'model': model });
        positionId = res.data.id;
        departmentId = res.data.departmentId;
        $('#webShare').attr('href', 'https://web.whatsapp.com/send?text=HappyEasyGo is recruiting now. Lots of positions await for you.' + href);
        $('#webShareIn').attr('href', 'http://www.linkedin.com/shareArticle?url=' + href);
        $('#webUrl').val('HappyEasyGo is recruiting now. Lots of positions await for you.' + href);
      }
    }).fail(function (err) {
      console.log(err);
    });
  }
  var userId = getCookie('uid');
  $.ajax({
    url: path.getInviteInfo(),
    type: 'POST',
    headers: { 
      'x-Device': 'PC',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data:JSON.stringify({userId:userId}),
    dataType: 'json',
  }).done(res => {
    
    
  });

  $(document).on('click', '#copyIcon', function(){
    var Url = document.getElementById('webUrl');
    Url.select();
    document.execCommand('Copy'); 
    const TipsMsg = $(this).parents('ul').siblings('.TipsMsg')[0];
      $(TipsMsg).fadeIn(500).delay(2000).fadeOut(1000);
  });
}); 
 
$(function(){
  
  $('#fileUpload').zyUpload({
    width            :   '443px',                 
    // height           :   '100px',                 
    // itemWidth        :   "120px",                 
    // itemHeight       :   "100px",                 
    url              :   '/heg_api/join/saveCareer.do',  
    multiple         :   false,                   
    dragDrop         :   true,                   
    del              :   true,                   
    finishDel        :   false,  				  
    
    onSelect: function(files, allFiles){                   
      
    },
    onDelete: function(file, surplusFiles){                  
      
    },
    onSuccess: function(file){                  
      
    },
    onFailure: function(file){                  
      
    },
    onComplete: function(responseInfo){         
      
    }
  }, ZYFILE);
});
$(document).on('click', '#saveCareeer', function(){
  if(checkForm(this.form)){
    var myForm = document.getElementById('career_Info');
    var file = document.querySelector('#fileImage');
   
    if(file.files.length == 0 ){
      $('#career_Info').find('.fileUpload-box .checkError').removeClass('hidden');
      return false;
    }
    var formData = new FormData(myForm);
    formData.append('departmentId', departmentId);
    formData.append('positionId', positionId);
    $.ajax({
      url: path.saveCareer(),
      type: 'POST',
      data: formData,                   
      dataType: 'JSON',
      cache: false,                    
      processData: false,             
      contentType: false,               
      success:function (data) {   
        if(!data.succ) {
          $('#career_Info').find('.fileUpload-box .checkError').removeClass('hidden').text(data.msg);
        }else{
          $('#proccedModal').modal('hide');
          $('#saveSuccModal').modal('show');
          myForm.reset();
          $('#fileNmae').text('Attach Resume (Microsoft Word or PDF file is allowed (5MB))');
          $('#career_Info').find('.checkError').addClass('hidden');
        }
        
      }
    });
  }
  function checkForm(){
    var flag = true;
  $('#career_Info').find('.checkError').addClass('hidden');
    // var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;

    if($('#name').val().trim() == ''){
      $('#career_Info').find('.verify-box .checkError').removeClass('hidden');
      flag = false;
    }
    if(!formReg.emailReg.test($('#email').val().trim())){
      $('#career_Info').find('.username-box .checkError').removeClass('hidden');
      flag = false;
    }
    
    if($('#location').val().trim() == ''){
      $('#career_Info').find('.location-box .checkError').removeClass('hidden');
      flag = false;
    }
    if($('#joinReason').val().trim() == '' || $('#joinReason').val().trim().length > 300 ){
      $('#career_Info').find('.joinReason-box .checkError').removeClass('hidden');
      flag = false;
    }
    if(!formReg.mobReg.test($('#mobile').val().trim())){
      $('#career_Info').find('.mobile-box .checkError').removeClass('hidden');
      flag = false;
    }
    return flag;
  }
});

$('#proccedModal').on('hidden.bs.modal', function (e) {
  $('#career_Info').find('.checkError').addClass('hidden');
});

$('#joinReason').keyup(function(){
  var textLength = $(this).val().trim().length;
  $('.textLength').text(300-textLength);
});
