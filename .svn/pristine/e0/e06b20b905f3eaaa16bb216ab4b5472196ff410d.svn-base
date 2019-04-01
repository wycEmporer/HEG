require('./content.less');
require('./Paging/pagination.less');
require('cp');
import pagination from './Paging/am-pagination';
import {cookieUtil, path} from 'utils';
// import { open } from 'fs/promises';
const isLogin = cookieUtil.getCookie('uuid') == null ? false : true;
var option = {totals : 0};
$(() =>{
  function renderView(viewElement, viewHtml, model) {
    var renderTemp = _.template(viewHtml);
    viewElement.html(renderTemp(model));
  }
  
  $.ajax({
    url: path.getReferRankWeekHistory(),
    type: 'GET',
    dataType: 'json',
  }).done(function (res) {
    if(res.succ){
      var model = res.data;
      model.forEach(ele => {
        var rank_Date =new Date(ele.rankDate);
        var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const y = rank_Date.getFullYear();
        const M = rank_Date.getMonth();
        const D = rank_Date.getDate();
        const rankingDate = D + ' ' + month[M] + ' ' + y;
        ele.rankingDate = rankingDate;
      });
      option.totals = model.length;
      
      var showModel = model.slice(0, 10);
      renderView($('#historyTable'), $('#historyTableTpl').html(), {'myModel': showModel });

      var pagersm = pagination('#paginationContral', {
        page: 1,
        totals: option.totals,
        pageSize: 10,
        theme: 'bootstrap',
        btnSize: 'sm'
      });
      jQuery('#paginationContral').on('am.pagination.change', function (e) {
          var showModel = model.slice((e.page-1)*e.pageSize, (e.page-1)*e.pageSize + e.pageSize);
          renderView($('#historyTable'), $('#historyTableTpl').html(), {'myModel': showModel });
      });
    }
  }).fail(function (err) {
    console.log(err);
  });
  

});