require('./content.less');
require('cp');
const paths = require('utils').path;
$.ajax({
  // url: paths.getNodeList() + '?cId=82',
  url:paths.getNodeList() + '?cId=82',
  type: 'GET',
  dataType: 'jsonp'
}).done(res =>  {
  if(res.list.length != 0){
    var dataObj = res.list[0];
    var $wrap = $('#mainContent');
    $wrap.append(`<h2 class="title">${dataObj.class}</h2>`);
    var $section = $('<section>');
    var textObj83 = dataObj.node.find(function(val){
      return val.cid == 83;
    });
    $.each(textObj83.content, function(key, value){
      var $p = $('<p>').html(value.content);
      $section.append($p);
    });
    $wrap.append($section);
    $wrap.append(`<section>
    <a href="/domestic-terms/" class="colorPri" style="font-size: 14px;">Domestic Flight Booking Terms</a>
    </section>`);

    $.each(dataObj.node, function(key, val){
      if(val.cid == 83){
        return true;
      }
      var $section = $('<section>');

      var $h3 = $(`<h3 data-toggle='collapse' href="#section${val.cid}" aria-expanded='false' aria-controls="section${val.cid}">${val.class}</h3>`);
      $section.append($h3);

      var $div = $(`<div class="collapse" id="section${val.cid}">`);

      $.each(val.content, function(index, value){
        var $p = $('<p>').html(value.content);
        $div.append($p);
      });

      $section.append($div).appendTo($wrap);
    });
  }
});