require('./content.less');
require('cp');
const paths = require('utils').path;
$.ajax({
  url: paths.getNodeList() + '?cId=69',
  // url:'https://www.happyeasygo.com/heg_api/advertising/getNodeList.do?cId=69',
  type: 'GET',
  dataType: 'jsonp'
}).done(res =>  {
  if(res.list.length != 0){
    var dataObj = res.list[0];
    var $wrap = $('#mainContent');
    $wrap.append(`<h2 class="title">${dataObj.class}</h2>`);
    var $section = $('<section>');
    if(dataObj.content && dataObj.content.length != 0){
      var firstUl = $('<ul>');
      dataObj.content.forEach(function(val, i){
        firstUl.append(`<li>${val.content}</li>`);
      });
      $section.append(firstUl);
    }
    $.each(dataObj.node, function(key, val){
      var $ul = $('<ul>');
      var $h3 = $(`<h3>${val.class}</h3>`);
      var $div = $('<div>');
      if(!val.content){
        return true;
      }
      $.each(val.content, function(index, value){
        $ul.append(`<li>${value.content}</li>`);
      });
      $div.append($ul);
      $section.append($h3).append($div);
    });
    $wrap.append($section);
  }
});