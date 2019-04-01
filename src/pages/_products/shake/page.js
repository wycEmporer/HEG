require('./content.less');
require('cp');
import {path, cookieUtil} from 'utils';

// $('#tab a[data-toggle="tab"]').on('show.bs.tab', function(e) {
//   let index = $(e.target).attr('index');
//   $('#creditPay').attr('index', index);
// });
if(cookieUtil.getCookie('uuid')){
  $.getJSON(path.getAutChance()).then(res=>{
    $('#chancesFor').html(`<span class="colorDan fontB">${res.data}</span> chances left`);
  });
  renderMyPrizes();
}

$.ajax({
  url: path.getAutPrizeList(),
  dataType: 'json',
}).done(res => {
  renderAmazing(res.data);
});

function renderAmazing(data){
  let itemArr = data.map(v => `<div class="lineH24 fontSz14 marB20"> 
      <h4 class="fontSz16 fontB marB8">${v.name}</h4>
      <div class="marB8">${v.introduction}</div>
      <div class="marB20">${v.tC}</div>
      <h4 class="fontSz16 fontB marB8">Steps to Redeem</h4>
      <div class="marB20">${v.useMethod}</div>
    </div>`);
  $('#amazing').html(itemArr.join(''));
}
function renderMyPrizes(){
  $.ajax({
    url:path.getAutMyPrizes()+ '?activityType=2',
    dataType:'json'
  }).done(res => {
    var data = res.data;
    var trArr = data.map(v => 
      `<tr>
      <td>${v.prizeName}</td>
      <td>${v.category == 1 ?  v.subPrizeName : ''}</td>
      <td>
        <a href="" data-toggle="modal" data-target="#prizeTc" data-introduction="${escape(v.introduction)}" data-method="${escape(v.useMethod)}"  data-tc="${escape(v.tC)}" data-title="${v.prizeName}">Details</a>
      </td>
      <td>${new Date(v.winningTime).toLocaleDateString()}</td>
    </tr>`);
    $('#my table tbody').html(trArr.join(''));
  });
}
$('#prizeTc').on('show.bs.modal', function(event){
  var button = $(event.relatedTarget);
  var tc = button.data('tc');
  var method = button.data('method');
  var introduction = button.data('introduction');
  var html =`<p class="fontSz18">${button.data('title')}</p> <div class="marB8"> ${unescape(introduction)} </div> <div class="marB8">${unescape(tc)}</div>  <div class=""> <p class="fontSz18">Steps to redeem</p> ${unescape(method)}</div>`;
  $(this).find('.modal-body').html(html);
});
$.getJSON(path.getAutWinnerList()).then(res => {
  var WinnerArr = res.data.map(v => `${v.userName} - ${v.prizeName} - ${new Date(v.createTime).toLocaleTimeString()}`);
  loopPrizers(WinnerArr);
});
function loopPrizers (arr){
  var timer = null;
  if(arr.length < 1) return;
  var $prizerView = $('#prizersView');
  var viewArr = arr.map(v => `<p class="pull-left view" style="width:50%">
 ${v}</p>`);
  $prizerView.html(viewArr.join(''));
  
    $prizerView.hover(function() {
        clearInterval(timer);
    },
    function() {
        timer = setInterval(function() {
            scrollList($prizerView);
        },
        5000);
    }).trigger('mouseleave');

    function scrollList(obj) {
      var scrollHeight = $prizerView.find('.view').height();
      $prizerView.stop().animate({marginTop: -scrollHeight},
      1000,
      function() {
          $prizerView.css({marginTop: 0}).find('.view:first').appendTo($prizerView);
          $prizerView.find('.view:first').appendTo($prizerView);
      });
  }

}

// $('.appFeature').click(function(){
//     $('#notice').css({top: $(document).scrollTop()+ 300}).fadeIn(500).delay(2000).fadeOut(1000);
//   return false;
// });

$('a[href="#my"]').on('shown.bs.tab', function (e) {
  renderMyPrizes();
  //e.target // newly activated tab
  //e.relatedTarget // previous active tab
});

$('.leftWrap a[href="#rules"]').on('click', function(){
  $('#tab li:eq(0) a').click();
});
$('.leftWrap a[href="#amazing"]').on('click', function(){
  $('#tab li:eq(2) a').click();
});
$('.leftWrap a[href="#my"]').on('click', function(){
  $('#tab li:eq(3) a').click();
});
$('#tab .tab-content').hide();
$('#tab li a[data-toggle="tab"]').on('click', function(){
  $('#tab .tab-content').show();
  $('#toggleCon').addClass('chevron-up');
  $('#toggleCon').removeClass('chevron-down');
});
$('#toggleCon').on('click', function(){
  $(this).toggleClass('chevron-up');
  $(this).toggleClass('chevron-down');
  $('#tab .tab-content').slideToggle('show');
});

