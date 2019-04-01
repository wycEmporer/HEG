import * as reg from 'formVerify';
export const Check = {
  checkForm($form){
    $('input, select', $form).removeClass('errorInput');
    $('.checkError', $form).addClass('hidden');
    var flag = Check.checkAgree();
    var $c_num = $form.find('.c_num');
    var $c_month = $form.find('.c_month');
    var $c_year = $form.find('.c_year');
    var $c_holder = $form.find('.c_holder');
    var $c_cvv = $form.find('.c_cvv');

    if($c_num.val().trim() == '' || !reg.bankCardReg.test($c_num.val().trim())){
      flag = false;
      $c_num.parents('.c_group').find('.checkError').removeClass('hidden');
    }
    if($c_month.val() == ''){
      flag = false;
      $c_month.parents('.c_group').find('.checkError').removeClass('hidden');
    }
    if($c_year.val() == ''){
      flag = false;
      $c_year.parents('.c_group').find('.checkError').removeClass('hidden');
    }
    if(!reg.nameReg.test($c_holder.val().trim())){
      flag = false;
      $c_holder.parents('.c_group').find('.checkError').removeClass('hidden');
    }
    if($c_cvv.val().trim() == ''){
      flag = false;
      $c_cvv.parents('.c_group').find('.checkError').removeClass('hidden');
    }
  
    var msg = {
      name_on_card: $c_holder.val().trim(),
      card_number: $c_num.val().trim(),
      card_cvv: $c_cvv.val().trim(),
      card_yyyy: $c_year.val(),
      card_mm: $c_month.val()
    };
    return {
    flag, msg
    };
  },
  checkBank() {
    var flag = Check.checkAgree(), msg;
    var $selected = $('#bankType .otherList select');
    if($selected.val() == 0){
      $('#bankType').find('.checkError').removeClass('hidden');
      flag = false;
    }
    msg = $selected.val();
    return {
    flag, msg
    };
  },
  checkWallet() {
    var flag = Check.checkAgree(), msg;
    var $checked = $('#walletType .bankList input[type=radio]:checked');
    if($checked.length == 0) {
      $('#walletType').find('.checkError').removeClass('hidden');
      flag = false;
    }else {
      msg = $checked.data('id');
    }
    return {
    flag, msg
    };
  },
  // checkEmi() {
  //   var flag = Check.checkAgree(), msg;
  //   var $checked = $('#emiType .bankList input[type=radio]:checked');
  //   if($checked.length == 0) {
  //     $('#emiType').find('.checkError').removeClass('hidden');
  //     flag = false;
  //   }else {
  //     msg = $checked.data('id');
  //   }
  //   return {
  //   flag, msg
  //   };
  // },
  checkUPI(){
    var flag = Check.checkAgree(), msg;
    var $upi = $('#upiType input');
    if(!reg.UPI.test($upi.val().trim())){
      flag = false;
      $('#upiType').find('.checkError').removeClass('hidden');
    }
    return {
    flag, msg:$upi.val()
    };
  },
  checkAgree(){
    return true;
    let flag = true;
    if(!$('#paymentInfo').find('[name=agreement]').prop('checked')){
      $('#paymentInfo').find('[name=agreement]').addClass('errorInput').parents('.checkbox').find('.checkError').html('You must accept the Terms and Conditions to proceed with this booking.').removeClass('hidden');
      flag = false; 
    }
    // return true;
  }
};