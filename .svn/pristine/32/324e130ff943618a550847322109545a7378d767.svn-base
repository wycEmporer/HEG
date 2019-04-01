// city module
// require('./cityLayer.less');
const paths = require('utils').path;
require('datepicker/datepicker.js');
import {loadHistoy, storeForm} from '../formstore/formStore';
// datepicker setting
$('#D_date').datepicker({
  // defaultDate:"+1",
  // currentText:"now",
  // gotoCurrent:true,
  setDate:'',
  altField:'#departDate',
  altFormat:'yy-mm-dd',
  firstDay:1,
  minDate:'0',
  maxDate:'+1Y',
  numberOfMonths:2,
  dateFormat:'D, d M, yy',
  onClose:function(selectedDate){
    selectedDate = (selectedDate == '') ? 0 : selectedDate;
    $('#R_date').datepicker('option', 'minDate', selectedDate);
  },
  beforeShow(){
    $(this).datepicker('option', 'maxDate', '+1Y');
  }
});

$('#R_date').datepicker({
  altField:'#returnDate',
  altFormat:'yy-mm-dd',
  firstDay:1,
  minDate:'0',
  maxDate:'+1Y',
  numberOfMonths:2,
  dateFormat:'D, d M, yy',
  onClose:function(selectedDate){
    selectedDate = (selectedDate == '') ? 0 : selectedDate;
    $('#D_date').datepicker('option', 'maxDate', selectedDate);

  },
});
// $('#D_date').datepicker('setDate', new Date(new Date().getTime() + 86400000));
loadHistoy('searchForm');
if($('#Roundtrip').prop('checked')){
  $('.section2 .r-date').removeClass('hidden');
  $('#returnDate').removeAttr('disabled');
  $('#R_date').addClass('active');
}

let dDate = $('#departDate').val();
let rDate = $('#returnDate').val();
if(!dDate){
  $('#D_date').datepicker('setDate', new Date());
}
if(!rDate){
  $('#R_date').datepicker('setDate', new Date());
}
//oneway and roundway switch 
$('.L-tripType .oneway label').on('click', function(){
  $('.section2 .r-date').addClass('hidden');
  // $(".section2 .r-date").attr("disabled", 'disabled');
  $('#returnDate').attr('disabled', 'disabled');
});
$('.L-tripType .roundtrip label').on('click', function(){
  $('.section2 .r-date').removeClass('hidden');
  // $(".section2 .r-date").removeAttr("disabled");
  $('#returnDate').removeAttr('disabled');
});
//search-flights skip
function handleForm(_this, callback){
  
  $('#searchForm .checkError').addClass('hidden');
  $('#searchForm input').removeClass('inputError');
  var check = function(form){
    var flag = true;
    if(form.D_city.value =='' || form.from.value == ''){
      $('#D_city').addClass('inputError');
      $('.d-city .checkError').removeClass('hidden').text('You missed this');
      flag = false;
    }
    // if($(form.from).data('country') != 'IN'){
    //   $('#D_city').addClass('inputError');
    //   $('.d-city .checkError').removeClass('hidden').text("Int'l flights will be coming soon.");
    //   flag = false;
    // }
    if(form.from.value == form.to.value){
      $('#D_city').addClass('inputError');
      $('#A_city').addClass('inputError');
      flag = false;
    }
    if(form.A_city.value =='' || form.to.value == ''){
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
  if(check(_this.form)){
    // formStore.call(_this);
    let searchArr = $('#searchForm').serializeArray();
    let searchObj = {};
    $.each(searchArr, function(key, value){
      searchObj[value.name] = value.value;
    });
    let returnDate = searchObj.returnDate ? '-' + searchObj.returnDate : '';
    let pathName = '/flights/' + searchObj.from + '-' + searchObj.to + '/' + searchObj.departDate + returnDate;
  
    let searchQuery = '?tripType=' + searchObj.tripType + '&adults=' + searchObj.adults + '&childs=' + searchObj.childs + '&baby=' + searchObj.baby + '&cabinClass=' + searchObj.cabinClass + '&airline='+ (searchObj.airline || '') + '&carrier=' + (searchObj.carrier || '');
    let url = pathName + searchQuery;
    if(callback && typeof(callback) === 'function'){
      callback(url);
    }else{
      window.location.href = url;
    }
  }
}
// switch city
$('#switch_city').on('click', function(){
  var DcityVal = $('#D_city').val();
  var fromVal = $('#From').val();
  $('#D_city').val($('#A_city').val());
  $('#From').val($('#To').val());
  $('#A_city').val(DcityVal);
  $('#To').val(fromVal);
});
// date choose 
$('.section2 .d-date .datepick').click(function(){
  $('#D_date').datepicker('show');
});
$('.section2 .r-date .datepick').click(function(){
  $('#R_date').datepicker('show');
});

// passenger choose
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
//index class choose or AirLine choose
$('#more_options').on('click', function(){
  $(this).find('i').toggleClass('fa-caret-right').toggleClass('fa-caret-down');
  $('.options').toggleClass('hidden');
});
$('<ul id="ui-2">').addClass('autoComplete').appendTo(document.body);
$('#airline').on({
  'focus':function(){
    $('#ui-2').css({
      'position':'absolute',
      'width':$(this).outerWidth(),
      'top':$(this).offset().top + $(this).outerHeight(),
      'left':$(this).offset().left,
    });
  },
  'keyup':function(e){
    var keywords = $(this).val();
    var that = this;
    var citylist = function(data, keywords){
      var reg = new RegExp(keywords, 'i');
      $.each(data, function(index, value){
        if(reg.test(value.ab + value.al)){
          var $item = $('<li class="item" data-ab="'+value.ab+'">'+value.al+'</li>');
          $item.on('click touch', {that:that}, function(evt){
            $(evt.data.that).val($(this).html());
            $('#ui-2 .item').remove();
            $('#ui-2').hide();
            $(evt.data.that).next().val($(this).data('ab'));
            evt.cancelBubble = true;
            evt.stopPropagation();
          });
          $('#ui-2').append($item);
        }
      });
      if($('#ui-2').html() != ''){
        $('#ui-2').css('display', 'block');
      }else{
        $('#ui-2').css('display', 'none');
      }
    };
    if(keywords.length > 1){
      // empty li
      $('#ui-2').empty();
      if(sessionStorage.getItem('airlinesdata') != undefined){
        citylist(JSON.parse(sessionStorage.getItem('airlinesdata')), keywords);
      }else{
        $.ajax({
          url: paths.airlineListUrl(),
          type:'get',
          cache: true,
          dataType: 'json'
        }).done(function(data){
          sessionStorage.setItem('airlinesdata', JSON.stringify(data));
          citylist(data, keywords);
        });//end done
      }
    }else{
      $('#ui-2').css('display', 'none');
      $(this).next().val('');
    }
  },
  'keydown':function(e){
    if(e.which == 13 || e.which == 108) return false;
  },
  'blur': function(){
    setTimeout(function(){
      $('#ui-2').css('display', 'none');
    }, 260);
  }
});

({
  popClass: 'autoComplete',
  popId:'ui-1',
  hoverClass: 'active',
  popLen: 10,
  init:function(){
    this.setDom();
    return this;
  },
  bind:function(dom){
    var self = this;
    $(dom).on({
      'keyup': function(e){
        var lis = self.pop.find('li'),
        temp;
        if(e.which == 38){
          if(self.pop.is(':visible')){
            var activeLi = self.pop.find('li.'+self.hoverClass);
            if(activeLi.length){ //if active exist
              if(activeLi.index() == 0){
                lis.last().addClass(self.hoverClass);
                activeLi.removeClass(self.hoverClass);
                // active li
                self.clickCity.call(lis.last()[0], this);
              }else{
                lis.eq(activeLi.index() - 1).addClass(self.hoverClass);
                activeLi.removeClass(self.hoverClass);
                self.clickCity.call(lis.eq(activeLi.index() - 1)[0], this);
              }
            }else{  //if active is not exist, default last 
              self.pop.find('li:last').addClass(self.hoverClass);
              self.clickCity.call(lis.last()[0], this);
            }
          }else{ // pop layer is hidden 
            self.insert(this);
          }
        }else if(e.which == 40){
          if(self.pop.is(':visible')){
            var activeLi = self.pop.find('li.'+self.hoverClass);
            if(activeLi.length){ //if active exist
              if(activeLi.index() == lis.length - 1){
                lis.first().addClass(self.hoverClass);
                activeLi.removeClass(self.hoverClass);
                self.clickCity.call(lis.first()[0], this);
              }else{
                lis.eq(activeLi.index() + 1).addClass(self.hoverClass);
                activeLi.removeClass(self.hoverClass);
                self.clickCity.call(lis.eq(activeLi.index() + 1)[0], this);
              }
            }else{  //if active is not exist, default last 
              self.pop.find('li:first').addClass(self.hoverClass);
              self.clickCity.call(lis.first()[0], this);
            }
          }else{ // pop layer is hidden 
            self.insert(this);
          }
        }else if(e.which == 13 || e.which == 108){
          var activeLi = self.pop.find('li.'+self.hoverClass);
          if(activeLi.length){
            self.clickCity.call(activeLi[0], this);
          }
          if(this.id == 'D_city'){
            $('#A_city').focus();
          }else if(this.id == 'A_city'){
            $('#D_date').focus();
          }
        }else if(e.which != 9){
          $(this).next().val('');
          self.insert(this);
        }
      },
      'blur': function(){
        let _this = this;
        // make click useful 
        setTimeout(function(){
          self.pop.css('display', 'none');
          if($(_this).next().val() == ''){
            _this.value = '';
          }
        }, 300);
        // self.pop.css('display', 'none');
      },
      'click':function(){
        this.select();
      },
      'focus': function(){
        this.select();
      },
      'keydown': function(e){
        if(e.which == 13 || e.which == 108){
          return false;
        }
      }
    });
  },
  // self is not dom this
  insert:function(inputDom){
    var keywords = inputDom.value;
    this.getCityData(keywords, inputDom);
  },
  setDom:function(){
    var self = this;
    var ul = $('<ul>').appendTo(document.body);
    ul.addClass(self.popClass);
    ul.attr('id', self.popId);
    this.pop = ul;
  },
  getCityData:function(keywords, inputThis){
    var self = this;
    if(keywords.length > 1){
      // empty li
      // $("#ui-1").empty();/
      if(sessionStorage.getItem('citydata1') != null && sessionStorage.getItem('citydata1') != 'undefined'){
        self.cityList(JSON.parse(sessionStorage.getItem('citydata1')), keywords, inputThis);
        // self.listShow();
      }else{
        $.ajax({
          url: paths.cityListUrl(),
          type:'get',
          cache: true,
          dataType: 'json'
        }).done(function(data){
          sessionStorage.setItem('citydata1', JSON.stringify(data.data));
          self.cityList(data.data, keywords, inputThis);
          // self.listShow();
        });//end done
      }
    }else{
      $(this).next().val('');
      $('#ui-1').css('display', 'none');
    }
  },
  cityList: function (data, keywords, inputThis){
    var self = this;
    this.pop.empty();
    var reg = new RegExp(keywords, 'i');
    this.pop.css({
      position:'absolute',
      width:$(inputThis).outerWidth(),
      top:$(inputThis).offset().top + $(inputThis).outerHeight(),
      left:$(inputThis).offset().left,
      display:'none'
    });
    var matchCityArr = [];
    $.each(data, function(index, value){
      if(reg.test(value.airport + value.iata + value.city)){
        if(value.iata == keywords.toUpperCase()){
          matchCityArr.unshift(value);
        }else{
          matchCityArr.push(value);
        }
      }
    });

    $.each(matchCityArr, function(index, value){
      var $item = $(`<li class="item" data-city="${value.iata}" data-cn ="${value.cn}">`);
      $item
      .text(value.city + ' - '+ value.airport + ' ('+ value.iata +')');
      $item.on({
        'click':function(e){
          e.cancelBubble = true;
          e.stopPropagation();
          self.clickCity.call(this, inputThis);
          self.pop.hide();
          // clickCityDelegate();
        },
        'mouseenter':function(){
          $(this).addClass('active').siblings('li').removeClass('active');
        }
      });
      self.pop.append($item);
    });
    if(this.pop.find('li').length == 0){
      this.pop.css('display', 'none');
      return false;
    }
    this.pop.css('display', 'block').find('li:first').addClass(self.hoverClass);
  },
  clickCity:function (inputThis){
    $(inputThis).val($(this).html());
    // $('#ui-1').hide();
    $(inputThis).next().val($(this).data('city'));
    $(inputThis).next().data('country', $(this).data('cn'));
    // $("#ui-1 .item").remove();
  }
}).init().bind('#D_city, #A_city');

export {handleForm, loadHistoy, storeForm};