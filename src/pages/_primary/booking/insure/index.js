import { resolve } from 'url';
import { get } from 'https';
const cookieUtil = require('cp').cookieUtil;
const paths = require('utils').path;

$(document).on('click', '#isShowMore', function() {
  // if ($(this).data('intl')) {
  //   return true;
  // }
  let $benWrap = $('#benWrap');
  let $bItem = $benWrap.find('.b-item');
  if ($(this).attr('show') == 'true') {
    $(this).attr('show', 'false');
    $(this).removeClass('foad');
    // $(this).html(`<span class="colorPri fontSz24 fontB">+6</span> 
    //       <br>
    //       <span>more</span>`);
    $('.loadMore .drow').addClass('down');
    $benWrap.height(0);
  } else {
    $(this).attr('show', 'true');
    $(this).addClass('foad');
    $benWrap.height(Math.ceil($benWrap.children('.b-item').length / 2) * 56);
    // $(this).html('<span class="colorPri fontSz24 fontB">Less</span>');
    $('.loadMore .drow').removeClass('down');
  }
  return false;
});

$(document).on('click', '.showMore', function() {
  $('#isShowMore').click();
});
$(document).on('click', '.drow', function() {
  $('.foldedIcon').click();
});

function renderView(viewElement, viewHtml, model) {
  var renderTemp = _.template(viewHtml);
  viewElement.html(renderTemp(model));
}

function insureChecked(postData){
  $('#insureCountView').show();
  postData.fee.withInsureDiscount = postData.insureObj.withInsureDiscount;
  postData.fee.tdis = postData.insureObj.tdis;
  let insurePrice = postData.insureObj.perInsurePr*postData.insureObj.days*postData.travellers;
  $('#insureItem .insurePr').text(insurePrice.toThree());
  $('#insureItem').slideDown('normal');
  $('#insureCountWrap').show();
  postData.fee.insurePr = insurePrice;
  postData.totalPrice = postData.fee.totalPrice;
  postData.isInsure = true;
  if(postData.insureObj.hasInsurance){
      $('#viewCash_2')
    .removeClass('hidden')
    .find('.viewCash_2')
    .text((postData.insureObj.tdis).toThree());
  }
  $('#applyCoupon').click();
  if(postData.type == 2){
    JudgeSilver(postData, true);
  }
}
function insureUnchecked(postData){
  $('#insureCountView').hide();
  postData.fee.withInsureDiscount = 0;
  postData.fee.tdis = 0;
  postData.isInsure = false;
  $('#insureItem').slideUp('normal');
  $('#insureCountWrap').hide();
  postData.fee.insurePr = 0;
  postData.totalPrice = postData.fee.totalPrice;
  $('#viewCash_2')
  .addClass('hidden');
  $('#applyCoupon').click();
  if(postData.type == 2){
    JudgeSilver(postData, false);
  }
  
}
function initInsurance(postData) {
  $('input[name=insureRadios][value=yes]').click(function(){
    insureChecked(postData);
    $('.checksec').addClass('active');
  });

  $('input[name=insureRadios][value=no]').click(function(){
    // if(postData.insureObj.hasInsurance){
    //   $('#cancelInsureModal')
    //   .find('.noInsuranceMsg').text(postData.insureObj.noInsuranceMsg)
    //   .end().find('.withInsureDiscount').text(-postData.insureObj.withInsureDiscount)
    //   .end().modal('show');
    //   return false;
    // }
    $('input[name=insureRadios][value=no]').prop('checked', true);
    insureUnchecked(postData);
    $('.checksec').removeClass('active');
  });

  // $('#cancelInsureModal .uncheckedBtn').click(function(){
  //   $('input[name=insureRadios][value=no]').prop('checked', true);
  //   $('#cancelInsureModal').modal('hide');
  //   insureUnchecked(postData);
  // });

  if(postData.type == 1 && !postData.insureObj.hasInsurance) {
    $('input[name=insureRadios][value=no]').click();
    
  } else {
    $('input[name=insureRadios][value=yes]').click();
  }
  

  $('.insureTime').on('blur', function(e){
    $(this).val($(this).val().replace(/[^\d]/g, ''));
    $(this).val($(this).val().replace(/^[0]/g, ''));

    let insureObj = postData.insureObj;
    if($(this).val().trim() == '' || parseFloat($(this).val().trim()) < 2){
      $(this).val(2);
    } else if (parseFloat($(this).val().trim()) > 180){
      $(this).val(180);
    }
    insureObj.days = $(this).val().trim()-0;

    let insurePrice = insureObj.days*insureObj.perInsurePr*postData.travellers;
    $('.perInsurePr').html('<i class="rs">Rs.</i>' + insureObj.days*insureObj.perInsurePr + ' for ' + insureObj.days +' days (Per Peson)');
    $('#insureItem .insurePr').text(insurePrice);
    postData.fee.insurePr = insurePrice;
    postData.totalPrice = postData.fee.totalPrice;
    
  });
  $(document).on('click', '.checksec', function(e){
    e.stopPropagation();
    $(this).toggleClass('active');
    if($(this).hasClass('active')){
      $('input[name=insureRadios][value=yes]').click();
    } else {
      $('input[name=insureRadios][value=no]').click();
    }
  });
  $(document).on('click', '.sec-trip ', function(){
    $('.checksec').click();
  });
}

function JudgeSilver (postData, flag) {
  if(postData.isLogin){
    var tdis = flag ? postData.insureObj.tdis : 0;
    var discount = Math.abs(tdis) + Math.abs(postData.fee.discount);  
    var userId = getCookie('uid');
    $.ajax({
      url: paths.getIsSilverEnough() +'?silverAmount=' + discount +'&userId=' + userId,
      type: 'GET',
      dataType: 'json'
    })
      .done(res => {
        if(!res.success) {
          if(res.code == 900){
            let model = null;
            let bookExpireObj = {
              title: 'Oops!',
              text: res.msg,
              btnTex: 'OK',
              href: null
            };
            model = Object.assign({}, bookExpireObj);
            model.href = cookieUtil.getCookie('flightsUrl') ? cookieUtil.getCookie('flightsUrl') : '/';
            let $bookExpire = $('#bookExpire');
            let $bookExpireCon = $bookExpire.find('.modal-content');
            renderView($bookExpireCon, $bookExpireCon.html(), { model });
            $bookExpire.modal('show');
          }
        }
      })
      .fail(err => {
       
      });
  }
} 

/**
 * [getInsure description]
 * @param  {Object} flightObj alis postData
 * @return {null}           [description]
 */
export function getInsure(flightObj) {
  let reqData = {
    token: flightObj.token,
    passengerCount: flightObj.travellers,
    from: flightObj.departFlight.ds,
    to: flightObj.departFlight.as,
    international: flightObj.isIntl,
    departFlightList: [
      {
        departDateTime: flightObj.departFlight.dt,
        wdt: flightObj.departFlight.wdt,
        arrDateTime: flightObj.departFlight.at
      }
    ]
  };
  if (flightObj.returnFlight && Object.keys(flightObj.returnFlight).length != 0) {
    reqData.returnFlightList = [
      {
        departDateTime: flightObj.returnFlight.dt,
        arrDateTime: flightObj.returnFlight.at,
        wdt: flightObj.returnFlight.wdt
      }
    ];
  }

  $.ajax({
    url: paths.getInsure_v2(),
    type: 'POST',
    data: JSON.stringify(reqData),
    headers: {
      'x-Device': 'PC',
      'Content-Type':'application/json'
    },
  }).then(res => {
    if (res.success) {
      let product = res.data.productInfoList[0];
      let model = {
        isIntl: flightObj.isIntl,
        termsUrl: flightObj.isIntl ? '/apollo-international-terms' + product.value : '/apollo-domestic-terms',
        perInsurePr: product.price,
        passengers: flightObj.travellers,
        title: product.computeMode == 1 ? '' : 'per day',
        days: res.data.days,
        setPri : product.disPrice,
        isSetPri : product.price - product.disPrice
      };
      
      flightObj.insureObj = {
        hasInsurance: res.data.hasInsurance,
        withInsureDiscount: (res.data.hasInsurance && flightObj.type != 2) ? res.data.tdis : 0, 
        days: model.isIntl ? model.days : 1,
        perInsurePr: model.setPri,
        noInsuranceMsg: (res.data.noInsuranceMsg|| '').replace(/\s/g, ' '),
        tdis : res.data.tdis
      };
      
      renderView($('#insureWrap'), $('#insureTpl').html(), { model });
      initInsurance(flightObj);
      
    }
    if(flightObj.type == 2){
      JudgeSilver(flightObj, false);
    }
  });
  
}
 