import * as formReg from 'formVerify';
export function checkAgree(){
  return true;
  let flag = true;
  if(!$('#paymentInfo').find('[name=agreement]').prop('checked')){
    $('#paymentInfo').find('[name=agreement]').addClass('errorInput').parents('.checkbox').find('.checkError').html('You must accept the Terms and Conditions to proceed with this booking.').removeClass('hidden');
    flag = false; 
  }
  // return true;
}
export default function checkFrom($form) {
  $('input, select', $form).removeClass('errorInput');
  $('.checkError', $form).addClass('hidden');
  var flag = checkAgree();
  var $c_num = $form.find('.c_num');
  var $c_month = $form.find('.c_month');
  var $c_year = $form.find('.c_year');
  var $c_holder = $form.find('.c_holder');
  var $c_cvv = $form.find('.c_cvv');

  if($c_num.val().trim() == '' || !formReg.bankCardReg.test($c_num.val().trim())){
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
  if(!formReg.nameReg.test($c_holder.val().trim())){
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
}

export function checkBank() {
  var flag = checkAgree(), msg;
  var $selected = $('#bankType .otherList select');
  if($selected.val() == 0){
    $('#bankType').find('.checkError').removeClass('hidden');
    flag = false;
  }
  msg = $selected.val();

  return {
flag, msg
};
}

export function checkWallet() {
  var flag = checkAgree(), msg;
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
}

export function checkUPI(){
  var flag = checkAgree(), msg;
  var $upi = $('#upiType input');
  if(!formReg.UPI.test($upi.val().trim())){
    flag = false;
    $('#upiType').find('.checkError').removeClass('hidden');
  }
  return {
flag, msg:$upi.val()
};
}
