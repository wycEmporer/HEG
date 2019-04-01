const utils = require('utils');
const cookieUtil = utils.cookieUtil;
export class Gold {
  constructor(){
    this.isUseGold = false;
    this.gold = 0;
    this.useGold = 0;
    this.needPay = 1;
  }
  // first 
  getGoldAndPayAmount(needPay){
    this.needPay = needPay;
    if(!cookieUtil.getCookie('uuid')) return;
    $('.summary .offer-group').show();

    $.ajax({
      type: 'GET',
      url:'/heg_api/wallet/searchHappyGold.do',
      headers:{withcredentials: true},
      dataType: 'json'
    }).done(res => {
      this.gold = res.happyGoldBalance;
      $('.summary .goldValue').text(res.happyGoldBalance.toThree());
      this.goldListen();
    }).fail(err => {
      console.log(err);
      alert(err.status + 'queryOrderDetail');
    });
  }
  goldListen(){
    let _this = this;
    $('#checkgold').on('change', function(){
      if(this.checked){
        _this.setOpenGold();
        $('#goldvalue').removeClass('hidden');
      }else{
        _this.setCloseGold();
        $('#goldvalue').addClass('hidden');
      }
    });
    this.goldInputChange();
  }
  setOpenGold(){
    this.useGold = Math.min.apply(null, [this.gold, this.needPay]);
    this.isUseGold = true;
    $('#goldvalue input').val(this.useGold);
    $('#showAmount span').text(this.needPay - this.useGold);
    this.isWholeGoldPay();
  }
  setCloseGold(){
    this.isUseGold = false;
    // this.useGold = 0;
    $('#showAmount span').text(this.needPay);
    this.isWholeGoldPay();
  }
  goldInputChange(){
    let _this = this;
    $('#goldvalue input').on('keyup blur', function(){
      this.value = this.value.replace(/[^0-9]+/g, '');
      _this.useGold = Math.min.apply(null, [_this.gold, _this.needPay, Number(this.value)]);
      this.value = _this.useGold;
      $('#showAmount span').text(_this.needPay - _this.useGold);
      _this.isWholeGoldPay();
    });
  }
  isWholeGoldPay(){
    if(this.needPay <= this.useGold && this.isUseGold){
      $('#wholeGold').show();
      // .removeClass('hidden');
      $('#choosePay').hide();
      // .addClass('hidden');
    }else{
      $('#wholeGold').hide();
      $('#choosePay').show();
    }
  }
}