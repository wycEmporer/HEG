import * as formReg from 'formVerify';
export default function checkWithdrawal(form){
  var $form = $(form);
  $('input, select', $form).removeClass('inputError');
  $('.checkError', $form).addClass('hidden');
  var flag = true;
  $.each($form.serializeArray(), function(i, val){
    val.value = val.value.trim();
    if(val.value === ''){
      $('[name=' + val.name + ']', $form).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
      flag = false;
    }
  });
  if(form.cardNo.value !== form.re_cardNo.value){
    $(form.re_cardNo).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
    flag = false;
  }
  if(form.cashAmount.value < 100){
    $(form.cashAmount).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
    flag = false;
  }
  return flag;
}