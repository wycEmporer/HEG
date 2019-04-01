import * as formReg from 'formVerify';
export function checkWithdrawal(form){
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
  if(!formReg.bankCardReg.test(form.cardNo.value)){
    $(form.cardNo).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
    flag = false;
  }
  if(form.cardNo.value !== form.re_cardNo.value){
    $(form.re_cardNo).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
    flag = false;
  }
  if(!formReg.emailReg.test(form.email.value)){
    $(form.email).addClass('inputError').parents('.form-group').find('.checkError').removeClass('hidden');
    flag = false;
  }
  if(form.cashAmount.value < 100){
    $(form.cashAmount).addClass('inputError')
    .parents('.form-group').find('.checkError').removeClass('hidden');
    flag = false;
  }
  if(parseInt(form.cashAmount.value) > parseInt(form.cashAmount.getAttribute('avail'))){
    $(form.cashAmount).addClass('inputError');
    flag = false;
  }
  return flag;
}

export function profileCheckForm(that){
  let flag = true;
  let modifyInfo = '';
  let $form = $(that.form);
  $('.checkError', $form).addClass('hidden');
  let sex = $('#infoForm1').find('[name=sex]').val();
  // let realName = $('#infoForm').find('[name=realName]').val();
  let firstName = $form.find('[name=firstName]').val();
  let lastName = $form.find('[name=lastName]').val();
  // let Icode = $form.find('[name=Icode]').val();
  // let cellphone = $form.find('[name=cellphone]').val();
  // let day = $form.find('[name=day]').val();
  // let month = $form.find('[name=month]').val();
  // let year = $form.find('[name=year]').val();
  let birthDate = $form.find('[name=birthday]').val();
  
  if(!formReg.nameReg.test(firstName)){
    $('[name="firstName"]', $form).parents('.form-group').find('.checkError').removeClass('hidden');
    return false;
  
  }
  if( !formReg.nameReg.test(lastName)){
    $('[name="lastName"]', $form).parents('.form-group').find('.checkError').removeClass('hidden');
    return false;
   
  }

  if(sex == ''){
    $('[name="sex"]', $form).parents('.form-group').find('.checkError').removeClass('hidden').html('Please enter a vaild sex');
    return false;
  } else {
    modifyInfo += 'sex='+ sex +'&';
  }
  if(birthDate == ''){
    $('[name="birthday"]', $form).parents('.form-group').find('.checkError').removeClass('hidden').html('Please enter a vaild birthDate');
    return false;
  }
 
  modifyInfo += 'lastName=' + lastName + '&firstName=' + firstName + '&';
  modifyInfo += 'birthDate=' + birthDate;

  return modifyInfo;
}