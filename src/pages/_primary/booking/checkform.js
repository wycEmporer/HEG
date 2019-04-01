import * as formReg from 'formVerify';
// formReg : {nameReg, emailReg, mobReg, pwdReg}
export function checkForm(thisForm){
  var $thisForm = $(thisForm); 
  $('input, select', $thisForm).removeClass('errorInput');
  $('.checkError', $thisForm).empty().addClass('hidden');

  var flag = true;
  const errorinputNameArr = [];
  var phoneOnOff1 = true;

  var areaCodeVal = $thisForm.find('.showSelect').val();
  const phoneNoLength= $thisForm.find('#travellDetail').val().length;

  if(areaCodeVal == '+91'){
    if(phoneNoLength < 10){
      
      phoneOnOff1 = false;
    } else if(phoneNoLength > 10) {
      
      phoneOnOff1 = false;
    }
  } else if(areaCodeVal == '+86'){
    if(phoneNoLength < 11){
     
      phoneOnOff1 = false;
    } else if(phoneNoLength > 11) {
     
      phoneOnOff1 = false;
    }
  }
  let FnameCompar = [];
  let LnameCompar = [];
  let nameCompar = [];
  $.each($thisForm.serializeArray(), function(i, val){
    val.value = val.value.trim();
    if(val.value == '0' || val.value == ''){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').append('<span class="miss">You missed this</span>').removeClass('hidden');
      errorinputNameArr.push(val.name);
      flag = false;
    }else if(/Fname/i.test(val.name) && !formReg.nameReg.test(val.value)){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').append('<span>Please enter a valid name</span>').removeClass('hidden');
      errorinputNameArr.push(val.name);
      flag = false;
    }else if(/Lname/i.test(val.name)){
      if(!formReg.nameReg.test(val.value)){
        $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').append('<span>Please enter a valid name</span>').removeClass('hidden');
        errorinputNameArr.push(val.name);
        flag = false;
      }else if(val.value.length < 2){
        $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').append('<span>Last name should be at least 2 characters long.</span>').removeClass('hidden');
        errorinputNameArr.push(val.name);
        flag = false;
      }
    }else if(/(email)|(gstEmail)/.test(val.name) && !formReg.emailReg.test(val.value)){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').html('Please enter a valid Email Address').removeClass('hidden');
      errorinputNameArr.push(val.name);
      flag = false;
    }else if(/phoneNo/.test(val.name) && (!formReg.mobReg.test(val.value) || !phoneOnOff1)){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').html('Please enter a valid Mobile No.').removeClass('hidden');
      flag = false;
      errorinputNameArr.push(val.name);
    }else if(/contactName/i.test(val.name) && !formReg.nameReg.test(val.value)){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').html('Please enter a valid name').removeClass('hidden');
      flag = false;
      errorinputNameArr.push(val.name);
    }else if(/gstN/i.test(val.name) && !formReg.gstNum.test(val.value)){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').html('Only take alphabet and digit, special character not allowed').removeClass('hidden');
      flag = false;
      errorinputNameArr.push(val.name);
    }else if(/gstPhone/i.test(val.name) && !formReg.gstPhone.test(val.value)){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').html('Phone can\'t less than 10 digits').removeClass('hidden');
      flag = false;
      errorinputNameArr.push(val.name);
    }else if(/gstC/i.test(val.name) && !formReg.gstName.test(val.value)){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').html('Take only alphabet and digit and including this character also -.').removeClass('hidden');
      flag = false;
      errorinputNameArr.push(val.name);
    }else if(/password/.test(val.name) && !formReg.pwdReg.test(val.value)){
      $('[name=' + val.name + ']', $thisForm).addClass('errorInput').parents('.inputBox').find('.checkError').html('Please enter password (6 - 32 characters)').removeClass('hidden');
      flag = false;
      errorinputNameArr.push(val.name);
    }
  
    if(/Fname/i.test(val.name)){
      FnameCompar.push(val);
    }
    if(/Lname/i.test(val.name)){
      LnameCompar.push(val);
    }
  });
  _.each(FnameCompar, function(val, index){
    nameCompar.push({
      Fname: val.value,
      Lname : LnameCompar[index].value
    });
  });

 
  !flag && thisForm[errorinputNameArr[0]].scrollIntoView();

  // 判断乘客名字不能相等
  for (let i = 0; i < nameCompar.length; i++) {
    const ele = nameCompar[i];
    for (let j = i + 1; j < nameCompar.length; j++) {
      const ele2 = nameCompar[j];
      if(ele.Fname == ele2.Fname && ele.Lname == ele2.Lname && ele.Fname != '' && ele.Lname != '') {
        alert('Passenger names can\'t be same.');
       flag = false;
       break;
      }
    }
    if(!flag){
      break;
    }
  }

 return flag;
}
