require('./content.less');
require('cp');
const paths = require('utils').path;
$.ajax({
  // url: paths.getNodeList() + '?cId=9',
  url:'https://www.happyeasygo.com/heg_api/advertising/getNodeList.do?cId=9',
  type: 'GET',
  dataType: 'jsonp'
}).done(res =>  {
  if(res.list.length != 0){
    var dataObj = res.list[0];
    var $wrap = $('#mainContent');
    $wrap.append(`<h1 class="title">${dataObj.class}</h1>`);
    var $section = $('<section>');
    if(dataObj.content && dataObj.content.length != 0){
      var firstUl = $('<ul>');
      dataObj.content.forEach(function(val, i){
        firstUl.append(`<li>${val.content}</li>`);
      });
      $section.append(firstUl);
    }
    $.each(dataObj.node, function(key, val){
      var $h2 = $(`<h2>${val.class}</h2>`);
      var $div = $('<div>');
      $.each(val.node, function(index, value){
        var $h3 = $('<h3>').text(value.class);
        $div.append($h3);
        $.each(value.content, function(i, v){
          $div.append(`<p>${v.content}</p>`);
        });
      });

      $section.append($h2).append($div);
    });
    $wrap.append($section);
  }
});