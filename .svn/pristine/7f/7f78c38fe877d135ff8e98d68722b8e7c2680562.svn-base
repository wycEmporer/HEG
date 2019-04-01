export default function bottomSelectedPrice(idArr, data, index, silverBalance, isLogin){
  let saveHtml;
  silverBalance  = silverBalance || 0;
  let dFee = data[0][idArr[0]].fee;
  let rFee = data[1][idArr[1]].fee;
  if(dFee.fees[index].exFee){
    var totalPrice =  dFee.fees[index].exFee[0].bfp + dFee.fees[index].exFee[0].gst + rFee.fees[index].exFee[0].bfp + rFee.fees[index].exFee[0].gst;
    var totalDis = dFee.fees[index].exFee[0].dis + rFee.fees[index].exFee[0].dis;
  }else{
    var totalPrice = dFee.fees[index].bfp + dFee.fees[index].gst + rFee.fees[index].bfp + rFee.fees[index].gst;
    var totalDis = dFee.fees[index].dis + rFee.fees[index].dis;
  }
  
  if(index == 1){
    if(!isLogin) {
      silverBalance =Number(sessionStorage.getItem('registerSilver'));
    }
    if(silverBalance < totalDis){
      $('#selected_wrap .disable').removeClass('hidden');
      $('#bookTicket').addClass('hidden');
      if(isLogin) {
        $('.loginText').removeClass('hidden');
        $('.unLoginText').addClass('hidden');
      } else {
        $('.unLoginText').removeClass('hidden');
        $('.loginText').addClass('hidden');
      }
    }

  }else{
    $('#bookTicket').removeClass('hidden');
    $('#selected_wrap .disable').addClass('hidden');
  }

  if(index > 1){
    let totalCashback = dFee.fees[index].cba + rFee.fees[index].cba;
    saveHtml = `Cashback Rs. 
      <span class="colorDan">${totalCashback}</span>
    `;
  }else{
    saveHtml = `You save Rs. 
      <span class="colorDan">${totalDis}</span>
    `;
  }

  $(document).on('mouseenter', '#selected_wrap .book-wrap .disable', function() {
    // if(!$(this).hasClass('disable')) return false; 
    var pops = $(this).siblings('.sliverNoEnough');
    // $('.sliverNoEnough').addClass('hide');
    pops.removeClass('hide');
  });
  $(document).on('mouseleave', '#selected_wrap .book-wrap', function() {
    var pops = $(this).children('.sliverNoEnough');
    pops.addClass('hide');
  });



  $('#bookPrice').html(totalPrice.toThree());
  $('#saveMoney').html(saveHtml);

  $('#selected_wrap .selected-con').find('.mask,.overlap').remove();
  if(data[0][idArr[0]].isBookable == 2){
    var mask = $('<div>').addClass('mask').css({
        'width':'100%',
        'height':'100%',
        top:0,
        position:'absolute',
        'background-color':'#000',
        opacity:'.5',
        color:'#f70707'
      });
    var text = $('<p>').addClass('overlap').css({
      position:'absolute',
      color:'#ffad3d',
      bottom:'10px',
      right:'20px'
    })
    .text(data[0][idArr[0]].unBookableMsg);
    $('#selected_wrap .selected-con').append(mask).append(text);
  }
}

function renderView(viewElement, viewHtml, model){
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}

export function randerSelectedFlight(data){

  var dData = data.oldData[0][data.idArr[0]];
  var rData = data.oldData[1][data.idArr[1]];
    dData.dTime = dData.dt.replace(/.*\s/, '');
    dData.aTime = dData.at.replace(/.*\s/, '');
    dData.dur = $.countTime(dData.dt, dData.at);
    rData.dTime = rData.dt.replace(/.*\s/, '');
    rData.aTime = rData.at.replace(/.*\s/, '');
    rData.dur = $.countTime(rData.dt, rData.at);

  var viewElement1 = $('#leaveSelected');
  var viewElement2 = $('#returnSelected');
  var viewHtml = $('#selectCityTpl').html();
  renderView(viewElement1, viewHtml, {model:dData});
  renderView(viewElement2, viewHtml, {model:rData});
}