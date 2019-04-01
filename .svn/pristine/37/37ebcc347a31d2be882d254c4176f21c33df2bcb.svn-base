  let imgFile= [];
  let imgSrc = [];
  let imgName = [];
  function uploadImg(obj){
    let $input = $('#' + obj.inputId);
    let imgBoxId = '#' + obj.imgBox;
    let index = obj.index;
    imgSrc[index] = [];
    imgName[index] = [];
    imgFile[index] = [];
    $input.on('change', function(){
      let fileImg = $input[0];
      let fileList = fileImg.files;
      for(let i = 0; i < fileList.length; i++){
        let imgSrcI = getObjectURL(fileList[i]);
        imgName[index].push(fileList[i].name);
        imgSrc[index].push(imgSrcI);
        imgFile[index].push(fileList[i]);
      }
      addNewContent(imgBoxId, index);
    });
  }
  function getIdenOtp(obj){
    let timer = null;
    let otpBtn = '#' + obj.btnId;
    $(otpBtn).on('click', function(){
      let that = this;
      this.disabled = true;
      $.getJSON(obj.url).done(res =>{
        if(res.success){
          let times = res.lastSendTime;
          timer = setInterval(function(){
            times --;
            that.value = times + 's resend';
            if(times <= 0){
              that.disabled = false;
              that.value = 'Send OTP';
              clearInterval(timer);
              times = 60;
            }
          }, 1000);
        }else if(res.code === 2){
          $(that.form).find('.checkError').text(res.msg).removeClass('hidden');
        }
      });
    });
  }
  function subImg(obj){
    let btnId = '#' + obj.btnId;
    $(btnId).on('click', function(){
      $('.checkError', $(this.form)).addClass('hidden');
      if(imgFile[0].length < 1 || imgFile[1].length < 1){
        alert('Please choose your imgages');
        return;
      }
      let fd = new FormData(document.getElementById('uploadImg'));
      for(let i = 0; i < imgFile.length; i ++){
        fd.append('image' + i, imgFile[i][0]);
      }
      if(this.form.idenOtp.value == ''){
        $('#idenOtp').find('.checkError').removeClass('hidden');
      }
      $.ajax({
        type: 'post',
        url: obj.url,
        data: fd,
        contentType: false,
        processData: false,
      }).done(res =>{
        if(res.success){
          loction.href = decodeURIComponent(obj.originUrl);
        }else if(res.code == 1){

        }else if(res.code == 2){
          $('#idenOtp').find('.checkError').removeClass('hidden');
        }else if(res.code == 3){
          alert('Something was wrong, please try again later');
        }
      });
    });
  }
  function addNewContent(imgBoxId, index){
    for(var a = 0; a < imgSrc[index].length; a++) {
      var oldBox = $(imgBoxId).html();
      $(imgBoxId).html(oldBox + '<div class="imgContainer"><img title=' + imgName[index][a] + ' alt=' + imgName[index][a] + ' src=' + imgSrc[index][a] + '><p onclick="removeImg(this,' + a + ' , '+ index +')" class="imgDelete">delect</p></div>');
    }
    if(imgSrc[index].length > 0){
      $(imgBoxId).css('z-index', '1');
    }else{
      $(imgBoxId).css('z-index', '-1');
    }
  }

  function removeImg(that, a, index){
    imgFile[index].splice(a, 1);
    imgSrc[index].splice(a, 1);
    imgName[index].splice(a, 1);
    let imgBoxId = '#' + $(that).parents('.imgBox').attr('id');
    addNewContent(imgBoxId, index);
  }
  // create img url
  function getObjectURL(file) {
    var url = null;
    if(window.createObjectURL != undefined) { // basic
      url = window.createObjectURL(file);
    } else if(window.URL != undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if(window.webkitURL != undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }
export {uploadImg, subImg, removeImg, getIdenOtp};