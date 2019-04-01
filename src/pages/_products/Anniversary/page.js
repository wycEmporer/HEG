require('./content.less');
require('cp');
import {cookieUtil, path} from 'utils';
import './easing/easing.js';
// import { open } from 'fs/promises';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
var utils = require('utils');
var str = cookieUtil.getCookie('email');
var reg = RegExp(/"/);
var userEmail = reg.test(str) ? str.replace(/\"/g, '') : str;
const userPhone = cookieUtil.getCookie('phone');
var queryObj = utils.parseQueryStr();
$(() =>{
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  if(!isLogin){
    let model =  {};
    model.isLogin = isLogin;
    model.remaining =  0;
    renderView($('#Prize'), $('#PrizeTpl').html(), {'myModel': model });
    renderView($('#lotteryNum'), $('#lotteryNumTpl').html(), { model });
  }else{
    getLotteryChange();
    lotteryPrize();
  }
  var isBegin = false;
  var u =108;
  var num = 8;
  var model = {};
  var listData  = {};
  var info = {
    email:userEmail,
    phone :userPhone
  };
  // 不获奖时的随机数
  function numRand() {
    var x = 888; //上限
    var y = 111; //下限
    return randNum();
    function randNum() {
      var rand = parseInt(Math.random() *(x - y + 1) + y);
      var num_arr = (rand+'').split('');

      var  isAllEqual = num_arr.every(function(val, index){
                          if(index != 0){
                            return num_arr[0] != val;
                          }
                        });
      
      if(isAllEqual){
        randNum();
      }else{
        return rand;
      }
    }
  }
  // Lottery start
  function startLotter (){
    $.ajax({
      url: path.goLottery(),
      type: 'GET',
      dataType: 'json',
      headers: {
        'x-Device': 'PC',
        'Content-Type':'application/json'
      },
    }).done(function (res) {
      
      if(res.succ){
        model = res.data;
        lotterRotating(model);
      }
    }).fail(function (err) {
      console.log(err);
    });
  }

  // Turntable (转盘)
  function lotterRotating (model){ 
    if(isBegin) return false;
    var result = 111;
    isBegin = true;
    $('.num').css('backgroundPositionY', 0);
    if(model.win){
      switch (model.level){
        case 1:
          result = 888;
          break;
        case 2:
          result = 444;
          break;
        case 3:
          result = 666;
          break;
        case 4:
          result = 555;
          break;
        case 5:
          result = 333;
          break;
        case 6:
          result = 111;
          break;
        case 7:
          result = 777;
          break;
        case 8:
          result = 222;
          break;
      }
    }else {
      result = numRand();
    }
    var num_arr = (result+'').split('');
    $('.num').each(function(index){
      var _num = $(this);
      setTimeout(function(){
        _num.animate({backgroundPositionY: (u*num*3) + (u*num_arr[index])}, {
          duration: 5000+index*1500,
          easing: 'easeInOutCirc',
          complete: function(){
            if(index==2) {
              isBegin = false;
              $('.Handle').addClass('up');
              if(model.win){
                renderView($('#prizeImg'), $('#prizeImgTpl').html(), { model });
                $('#prizeModal').modal('show');
                
                lotteryPrize();
              }else{
                $('#noPrizeModal').modal('show');
                
              }
              renderView($('#lotteryNum'), $('#lotteryNumTpl').html(), { model });
            }
          }
        });
      }, index * 300);
    });
    $('.Handle').removeClass('up');
  }
  // lottery change
  function getLotteryChange (){
    $.ajax({
     url: path.obtainRemainingLottery(),
     type: 'GET',
     dataType: 'json',
     headers: {
       'x-Device': 'PC',
       'Content-Type':'application/json'
     },
    }).done(function (res) {
      if(res.succ){
        let model =  {};
        model.remaining =  res.data < 0 ? 0 : res.data;
        renderView($('#lotteryNum'), $('#lotteryNumTpl').html(), { model });
      }
    }).fail(function (err) {
      console.log(err);
    });
  }
  //  lottery prize
  function lotteryPrize (){
    $.ajax({
      url: path.selectWinningRecord(),
      type: 'GET',
      dataType: 'json',
      headers: {
        'x-Device': 'PC',
        'Content-Type':'application/json'
      },
    }).done(function (res) {
      if(res){
        let model =  {};
        model = res;
        model.isLogin = isLogin;
        if(model.succ){
          listData = model.data;
          model.data.forEach(ele => {
            var str1 = (new Date(ele.winningTime) + '').substr(4, 6); 
            var str2 = (new Date(ele.winningTime) + '').substr(16, 5); 
            ele.winTime = str1 + ' ' + str2;
          });
        }
        renderView($('#Prize'), $('#PrizeTpl').html(), {'myModel': model });
      }
    }).fail(function (err) {
      console.log(err);
    }); 
  }
  // 提交邮寄地址
  function saveRecipient (data){
    $.ajax({
      url: path.saveRecipient(),
      type: 'POST',
      data:JSON.stringify(data),
      dataType: 'json',
      headers: {
        'x-Device': 'PC',
        'Content-Type':'application/json'
      },
    }).done(function (res) {
      lotteryPrize(); 
    }).fail(function (err) {
      console.log(err);
    }); 
  }

  // 抽奖
  $(document).on('click', '#lotterBtn', function(){
    if(!isLogin){
      $('.login_btn a').click();
      return false;
    }
    $('#changeTCModal').modal('show');
    var num = $('.lotteryRemaining').text();
    // if(num > 0){
    //   startLotter();
    // }else {
    //   // $('#noChangeModal').modal('show');
    //   $('#changeTCModal').modal('show');
    // }
  });
  // 抽奖机会
  $(document).on('click', '.getChange', function(){
    $('#changeTCModal').modal('show');
  });
  // 邮寄信息填写
  $(document).on('click', '.Redeem', function(){
    var index = $(this).data('index');
    $('#informationModal').modal('show');
    $('#infoEmail').val(info.email);
    $('#infoPhone').val(info.phone);
    $('#MailingInfo').data('index', index);
  });
  // 邮寄地址查看
  $(document).on('click', '.check', function(){
    var index = $(this).data('index');
    $('#viewInforModal').modal('show');
    var model = {};
    listData.forEach(function(val, idx){
      if(val.winningId == index) {
        model = val;
      }
    });
    model.userEmail = info.email;
    model.userPhone = info.phone;
    renderView($('#userInfo2'), $('#userInfo2Tpl').html(), {'myModel': model });
  });
  // 提交邮寄信息
  $(document).on('click', '#MailingInfo', function(){
    var id = $(this).data('index');
    if(!$('.checkBox').prop('checked')){
      return false;
    }
    var infoArr = $('#userInfo').serializeArray();
    var onOff = infoArr.some(function(val){
      return val.value == ''; 
    });
    var dataM = {};
    dataM = {
      id:id,
      recipientName:infoArr[2].value,
      postalCode:infoArr[3].value,
      recipientAddress:infoArr[4].value,
    };
    if(onOff){
      $('.checkError').removeClass('hidden');
    }else{
      saveRecipient(dataM);
      $('#informationModal').modal('hide');
    }   
  });
  //flight slideDown book

  $(document).on('click', '.prizeTC>li>p', function() {
    var lis = $(this).siblings('div').children('ul').children('li');
    var ps = $(this).siblings('div').children('p');
    var pLength = ps.length;
    var liHeight = 0;
    for (let index = 0; index < lis.length; index++) {
      const elementH = $(lis[index]).height();
      liHeight = liHeight + elementH;
    }
    var pHeight = $(ps).outerHeight() == null  ? 0 : $(ps).outerHeight();
    if (!$(this).children('.foldIcon').hasClass('curr')) {
      $(this).siblings('div').css('overflow', 'initial').animate({
        height: liHeight- 0 + pLength*pHeight-0 + 10,
        paddingTop : 5,
        paddingBottom:5
      });
      $(this).children('.foldIcon').addClass('curr');
    } else {
      $(this).siblings('div').css('overflow', 'hidden').animate({
        height: 0, 
        paddingTop:0,
        paddingBottom:0
      });
      $(this).children('.foldIcon').removeClass('curr');
    }
  });
  $(document).on('click', '.checkBox', function(){
    if(!$('.checkBox').prop('checked')){
      $('#MailingInfo').attr('disabled', 'disabled');
    }else{
      $('#MailingInfo').attr('disabled', false);
    }
  });

  if(queryObj.type){
    $('.prizeTC>li').eq(queryObj.type-1).children('p').children('.foldIcon').click();
    document.querySelector('#roll_top').scrollIntoView(true); 
  }

  $(document).on('click', '#Prize .prizeBox ul li', function(){
    $(document).scrollTop(1000); 
    var prizeName = $(this).children('.prize_Info').find('.pull-left').text();
    var ps = $('.prizeTC>li').children('p');
    var type;
    $.each(ps, function(index, val){
      if(prizeName.indexOf(val.innerText) != -1 ){
        type = index;
        return false; 
      }
    });
    $('.prizeTC>li').eq(type).children('p').children('.foldIcon').click(); 
  });
  
});  