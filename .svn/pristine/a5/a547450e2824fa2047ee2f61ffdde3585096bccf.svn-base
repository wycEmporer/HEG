import * as formReg from 'formVerify';
export default function travellerHold(travellerObj) {
  $('.travellerHis input').on('click', function(){
    let $passengerInfos = $(this).parents('.listWrap').find('.passengerInfo');

    let userId = $(this).data('id');
    if(this.checked){
      let $emptyInput;
      if($passengerInfos.length == 1){
        $emptyInput = $passengerInfos;
        $(this).parents('.nameItem').siblings().find('input[type=checkbox]').prop('checked', false);
      }else{
        $emptyInput =  $passengerInfos.filter(function(index){
          return !$(this).data('id');
        }).eq(0);
        if($emptyInput.length == 0){
          alert('The order is available for ('+ $passengerInfos.length +') passenger(s) only. If you wish to add more passengers, please modify your search criteria. Sorry for the inconvenience.');
          return false;
        }
      }
      let type = $(this).data('type');
      let travellerInfo = _.find(travellerObj[type], function(val){
        return val.id == userId;
      });

      $emptyInput.data('id', userId);
      
      $emptyInput.find('select.sex').find('option[value='+(travellerInfo.sex+1)+']').prop('selected', true);
      $emptyInput.find('input.Fname').val(travellerInfo.passengerFirstName);
      $emptyInput.find('input.Lname').val(travellerInfo.passengerLastName);
      $emptyInput.find('.formItem.row').find('input,select').removeClass('errorInput').siblings('.checkError').addClass('hidden').empty();
      if(!!travellerInfo.birthDate){
        let day = travellerInfo.birthDate.slice(0, 2);
        let month = travellerInfo.birthDate.slice(3, 5);
        let year = travellerInfo.birthDate.slice(6, 10);
        $emptyInput.find('select.day').find('option[value='+day+']').prop('selected', true);
        $emptyInput.find('select.month').find('option[value='+month+']').prop('selected', true);
        $emptyInput.find('select.year').find('option[value='+year+']').prop('selected', true);
      }
      
    }else{

      let $fullInput =  $passengerInfos.filter(function(index){
        return $(this).data('id') == userId;
      });
      $fullInput.data('id', null);
      $fullInput.find('select.sex').find('option[value=0]').prop('selected', true);
      $fullInput.find('input.Fname').val('');
      $fullInput.find('input.Lname').val('');
      $fullInput.find('select.day').find('option[value=0]').prop('selected', true);
      $fullInput.find('select.month').find('option[value=0]').prop('selected', true);
      $fullInput.find('select.year').find('option[value=0]').prop('selected', true);
      $fullInput.find('.formItem.row').find('input,select').addClass('errorInput').siblings('.checkError').append('<span class="miss">You missed this</span>').removeClass('hidden');
    }
  });
  $('.traMore').on('click', function(){
    $(this).find('i').toggleClass('fa-caret-up');
    $(this).parents('.travellerHisWrap').toggleClass('collapseWrap');
  });

  $('.passengerInfo input, .passengerInfo select').on('blur', function(){
    if($(this).val() == 0 || $(this).val() == ''){
      $(this).addClass('errorInput').parents('.inputBox').find('.checkError').append('<span class="miss">You missed this</span>').removeClass('hidden');
    } else if(/Fname/i.test($(this)[0].name) && !formReg.nameReg.test($(this).val().trim())) {
      $(this).siblings('.checkError').append('<span class="miss">Please enter a valid name</span>').removeClass('hidden');
    } else if(/Lname/i.test($(this)[0].name) && !formReg.nameReg.test($(this).val().trim())) {
      $(this).siblings('.checkError').append('<span class="miss">Please enter a valid name</span>').removeClass('hidden');
    } else if(/Lname/i.test($(this)[0].name) && formReg.nameReg.test($(this).val().trim()) && $(this).val().trim().length < 2 ) {
      $(this).siblings('.checkError').append('<span class="miss">Last name should be at least 2 characters long.</span>').removeClass('hidden');
    } else {
      $(this).removeClass('errorInput');
    }
    let $passengerInfo = $(this).parents('.passengerInfo');
    if(checkCon(this)){
      $passengerInfo.data('id', null);
    }else{
      let id = $passengerInfo.data('id') ? $passengerInfo.data('id') : 111;
      $passengerInfo.data('id', id);
    }
  });
  $('.conDetails input').on('blur', function(){
    if($(this).val() == '' && !$(this).hasClass('errorInput')){
      $(this).addClass('errorInput').parents('.inputBox').find('.checkError').append('<span class="miss">You missed this</span>').removeClass('hidden');
    } else if(/contactName/.test($(this)[0].name) && !formReg.nameReg.test($(this).val().trim())) {
      $(this).siblings('.checkError').append('<span class="miss">Please enter a valid name</span>').removeClass('hidden');
    } else if(/email/.test($(this)[0].name) && !formReg.emailReg.test($(this).val().trim())) {
      $(this).siblings('.checkError').append('<span class="miss">Please enter a valid Email Address</span>').removeClass('hidden');
    } else if(/phoneNo/.test($(this)[0].name) && !formReg.mobReg.test($(this).val().trim())) {
      $(this).parents('.pull-left').siblings('.checkError').append('<span class="miss">Please enter a valid phone number</span>').removeClass('hidden');
    } else if(/phoneNo/.test($(this)[0].name) &&( $(this).parents('.inputBox').find('.areaCode').val() == '91' && $(this).val().trim().length != 10 || $(this).parents('.inputBox').find('.areaCode').val() == '86' && $(this).val().trim().length != 11 )) {
      $(this).parents('.pull-left').siblings('.checkError').append('<span class="miss">Please enter a valid phone number</span>').removeClass('hidden');
    } else {
      $(this).removeClass('errorInput');
    }
  });
  $('#gstCon input').on('blur', function(){
    if($(this).val() == '' && !$(this).hasClass('errorInput')){
      $(this).addClass('errorInput').parents('.inputBox').find('.checkError').append('<span class="miss">You missed this</span>').removeClass('hidden');
    } else if(/gstN/.test($(this)[0].name) && !formReg.gstNum.test($(this).val().trim())) {
      $(this).siblings('.checkError').append('<span class="miss">Only take alphabet and digit, special character not allowed</span>').removeClass('hidden');
    } else if(/gstC/.test($(this)[0].name) && !formReg.gstName.test($(this).val().trim())) {
      $(this).siblings('.checkError').append('<span class="miss">Take only alphabet and digit and including this character also -.</span>').removeClass('hidden');
    } else if(/gstEmail/.test($(this)[0].name) && !formReg.emailReg.test($(this).val().trim())) {
      $(this).siblings('.checkError').append('<span class="miss">Please enter a valid Email Address</span>').removeClass('hidden');
    } else if(/gstPhone/.test($(this)[0].name) && !formReg.gstPhone.test($(this).val().trim())) {
      $(this).siblings('.checkError').append('<span class="miss">Please enter a valid phone number</span>').removeClass('hidden');
    } else {
      $(this).removeClass('errorInput');
    }
  });
  $('.passengerInfo input, .passengerInfo select, .conDetails input, #gstCon input').on('focus', function(){
    $(this).removeClass('errorInput').parents('.inputBox').find('.checkError').addClass('hidden').empty();
  });
  function checkCon(that){
    let $passengerInfo = $(that).parents('.passengerInfo');
    let $inputs = $passengerInfo.find('input');
    let $selects = $passengerInfo.find('select');
    for(var i = 0; i < $inputs.length; i ++){
      if($inputs[i].value.length > 0){
        return false;
      }
    }
    for(var i = 0; i < $selects.length; i ++){
      if($selects[i].value != 0){
        return false;
      }
    }

    return true; // passengerInfo is empty
  }

}