const utils = require('utils');
const paths = utils.path;

export function getGstList(){
  $.getJSON(paths.getGstInfo(), function(res){
    renderAndListen(res);
  });
}

function renderAndListen(data){
  if(!data.length) return;
  var $gstCon = $('#gstCon').prepend(`<div class="form-gro">
          <select id="gstSelect" class="form-con" style="width:50%">
            <option value="0">Select GST</option>
          </select>
        </div>`);
  let $select = $gstCon.find('#gstSelect');
  for(var i = 0; i < data.length; i++){
    $select.append(`<option value="${data[i].id}">${data[i].registeredCompanyName}</option>`);
  }
  $select.on('change', function(){
    let gstInfo = _.find(data, (val) => {
      return val.id == this.value;
    });
    if(!gstInfo) return;
    var $gstForm = $('#gstCon');
    $gstForm.find('[name=gstN]').val(gstInfo.registrationNumber);
    $gstForm.find('[name=gstC]').val(gstInfo.registeredCompanyName);
    $gstForm.find('[name=gstEmail]').val(gstInfo.email);
    $gstForm.find('[name=gstAddr]').val(gstInfo.registeredCompanyAddress);
    $gstForm.find('[name=gstPhone]').val(gstInfo.phone);
    $gstForm.find('.gstCountry').val(gstInfo.country);
    $gstForm.find('.gstState').val(gstInfo.state);
  });
}