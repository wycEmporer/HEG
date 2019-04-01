export default function (type, isLogin){
  return;
  if(type == 0 && !isLogin){
    $('#proWrap').removeClass('hidden');
  }
  $('#proOpenWrap').click(function(){
    $(this).find('.proOpenCon').animate({right: '-100%', }, 400, function(){
      $('#proOpenWrap').addClass('hidden');
      $('#proWrap').removeClass('hidden').find('.proCon').animate({right:'0', }, 1000);
    });
  });
  $('#proWrap .closed').click(function(){
    $('#proWrap .proCon').animate({right:'-100%'}, 1000, function(){
      $('#proWrap').addClass('hidden');
      $('#proOpenWrap').removeClass('hidden').find('.proOpenCon').animate({right:'0'}, 400);
    });
  });
}