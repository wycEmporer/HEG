const utils = require('utils');
const paths = utils.path;
import {Homepages, Pop_in} from '../../_GAADS/adGAEvent';

$.ajax({
  url: paths.getAllPromotionInfo() + 'type=33&device=1',
  dataType: 'json',
  type: 'GET'
}).then((res) => {
  if(res.success){
    var model =_.sortBy(_.filter(res.list, function(item){ return item.use;}), 'sort');

    model[0].isFirst = true;
    createHtml(model);
    $(document).trigger('listen.carousel');
  }
});

function createHtml(arr){
  var $html = $('<div class="carousel-inner loop-inner" role="listbox">');
  var $carouselCtl = $('<ol class="carousel-indicators bottom">');
  for(let i = 0; i < arr.length; i ++){
    var snippet = `
      <div class="item  ${arr[i].isFirst ? 'active' : '' }">
          <a href="${arr[i].href}">
            <img src="${arr[i].url}" class="GAAD" ga="${Homepages[i]}" alt="...">
          </a>
        </div>
      `;
    $html.append(snippet);
    var li = `<li data-target="#carBanner" data-slide-to="${i}" class="${arr[i].isFirst ? 'active' : ''}"></li>`;
    
    $carouselCtl.append(li);
  }
  var $leftCtl = $('<a class="left carousel-control" href="#carBanner" role="button" data-slide="prev">'+
                        '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'+
                        '<span class="sr-only">Previous</span>'+
                      '</a>');
  var $rightCtl = $('<a class="right carousel-control" href="#carBanner" role="button" data-slide="next">'+
                      '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'+
                      '<span class="sr-only">Next</span>'+
                    '</a>');

  $html.appendTo('#carBanner');
  $carouselCtl.appendTo('#carBanner');
  $leftCtl.appendTo('#carBanner .container');
  $rightCtl.appendTo('#carBanner .container');
}
$.ajax({
  url: paths.getPromotionInfo() + 'type=15&device=1',
  dataType: 'json',
  type: 'GET',
}).done(res => {
  if(res.success){
    if(res.list.length == 0){
      return;
    }
    var first = _.find(res.list, function(val){return val.use == true;});
    $('#footBanner').html(`<img src="${first.url}" class="GAAD" ga="${Pop_in}" alt="footer banner" style="max-width:1100px;">`);
    $('#promotion-wrap').removeClass('hidden').find('.promotion-con').animate({left:'0', }, 500).delay(2000).animate({left:'-2000', }, 500, function(){
      $('#promotion-wrap').addClass('hidden');
      $('#promotion').animate({left:'0', }, 500);
    });

    $('#promotion-wrap .closed').click(function(){
      $('.promotion-con').animate({left:'-2000', }, 500, function(){
        $('#promotion-wrap').addClass('hidden');
        $('#promotion').animate({left:'0', }, 500);
      });
    });
    $('#promotion').click(function(){
      $(this).animate({left:'-50'}, 400, function(){
        $('#promotion-wrap').removeClass('hidden').find('.promotion-con').animate({left:'0', }, 500);
      });
    });

  }
});


// carousel
$(function(){
    
  function carouselImg(m){
    $('#carBanner .item').eq(m).css({
      display:'block',
      'z-index':'1'
    }).fadeTo(500, 1).delay(500).siblings('.item').css({
      display:'none',
      'z-index':'0'
    }).fadeTo(0, 0.5);
    // let $items = $('#carBanner .item');
    // let overM = m-1 < 0 ? $items.length-1 : m-1;
    // $items.removeClass('cur234').removeClass('over23');
    // $items.eq(m).addClass('cur234');
    // $items.eq(overM).addClass('over23');
  } 
  function carouselIcon(m){
    $('#carBanner .carousel-indicators li').eq(m).addClass('active').siblings('li').removeClass('active');
  }
  
  function carousel(){
    m = (m >= itemLength)? 0 : m;
    carouselImg(m);
    carouselIcon(m);
    m ++;
  }
  var m = 1;
  var itemLength;
  var timer;
  // $(document).on('listen.carousel', function(){
  //   itemLength = $('#carBanner .item').length;
  //   var mytime = setInterval(carousel, 3000);
  //   $('#carBanner .carousel-indicators li').mouseenter(function(){
  //     console.log(0);
  //     var n = $(this).index();
  //     timer = setTimeout(function(){
  //       carouselImg(n);
  //       carouselIcon(n);
  //       m = n + 1;
  //     }, 500);
  //   }).mouseleave(function(){
  //     console.log(1);
  //     clearTimeout(timer);
  //   });
  // });

});