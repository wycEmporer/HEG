const paths = require('utils').path;
// gold use
export default function goldListion(postData){
  
  $('#checkGold').on('click', function() {
    let self = this;
    $.ajax({
      url: paths.isPayPwd(),
      type: 'GET',
      dataType: 'json',
    }).done(function(res){
      if(res.code === 1){
        $('#setPwdModal').modal('show');
        self.checked = false;
        return false;
      }else if(res.code === 4){
        self.checked = false;
        alert('The gold has used');
      }else if(res.success){
        postData.isUseGold = self.checked;
        postData.happyGoldBalance = res.balance;
        $('#goldBalance').text(res.balance.toThree());
        if (self.checked) {
          $('#paymentInfo .goldBox').removeClass('hidden');
          if(!postData.useGold){
            let useGold = Math.min(postData.happyGoldBalance, (postData.fee.totalPrice + postData.fee.cf));
            postData.useGold = useGold;
            let useGoldInput = $('#useGold').val(useGold);
          }
          
          goldCheck(true, postData.useGold);

        } else {
          $('#paymentInfo .goldBox').addClass('hidden');
          goldCheck(false);
        }
      }
    });
  });

  $(document).on('keyup blur', '#useGold', function(e) {
    e.cancelBubble = true;
    e.stopPropagation();
    this.value = this.value.replace(/[^0-9]+/g, '');

    let useGold = Number(this.value);

    useGold = Math.min.apply(null, [useGold, postData.happyGoldBalance, (postData.fee.totalPrice + postData.fee.cf)]);

    this.value = useGold;
    goldCheck(true, useGold);
  });

  $(document).on('click', '#refreshGold', function(){
    $.getJSON(paths.getGoldUrl()).done(res => {
      postData.happyGoldBalance = res.happyGoldBalance;
      $('#goldBalance').text(res.happyGoldBalance.toThree());
    });
  });
  $(document).on('click', '#setPaymentPwd', function(){
    $('#setPwdModal').modal('hide');
  });

  function goldCheck(checked, useGold) {
    let lastPay = postData.fee.totalPrice + postData.fee.cf;
    if (checked) {
      if(useGold <= 0){
        postData.isUseGold = false;
      }else{
        postData.isUseGold = true;
        lastPay = lastPay - useGold;
        postData.useGold = useGold;
        postData.goldInfo= {
          tradeType: 4,
          tradeAmount: useGold,
        };
      } 
      if(lastPay == 0){
        $('#payTypes').addClass('hidden');
      }else{
        $('#payTypes').removeClass('hidden');
      }
    }else{
      $('#payTypes').removeClass('hidden');
    }
    // $('#section3 .Dtotal').text(lastPay.toThree());
  }
}

