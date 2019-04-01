import * as formReg from 'formVerify';
export default function(btnId, url, hasphoneNO){
  $('#' + btnId).on('click', function(){
    $('.checkError', $(this.form)).addClass('hidden');
    let phone = $(this.form).find('[name=phone]').val();
    let _this = this;
    if(hasphoneNO){
      phone = null;
    }else{
      if(!formReg.mobReg.test(phone)){
        $('input[name=phone]', $(this.form)).next().text('Please enter a valid Mobile No.').removeClass('hidden');
        return false;
      }
    }
    let times = 60;
    let timer = null;
    let that = this;
    $.getJSON(url+'?phone=' + phone).then(res => {
      if(res.success){
        that.disabled = true;
        times = res.lastSendTime || times;
        timer = setInterval(function(){
          times --;
          that.value = times + 's resend';
          if(times <=0){
            that.disabled = false;
            that.value = 'Send OTP';
            clearInterval(timer);
            times = 60;
          }
        }, 1000);
      }else{
        $('input[name=phone]', $(_this.form)).next().text(res.msg).removeClass('hidden');
      }
    }).fail(err =>{

    });
  });
}