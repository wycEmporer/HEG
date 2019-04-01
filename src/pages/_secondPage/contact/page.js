require('./content.less');
require('cp');
import {path} from 'utils';
$(() =>{
  // change website  phone
  $.getJSON(path.getSiteInfo()).then((res) =>{
    if(res.code === 0){
       $('#phoneNo').html(res.webSiteInfo.websitePhone.split('/')[0]+ '<br>' + (res.webSiteInfo.websitePhone.split('/')[1] ==undefined ? '' : res.webSiteInfo.websitePhone.split('/')[1])).attr('href', 'tel:'+ res.webSiteInfo.websitePhone.split('/')[0]);
      // $('#companyName').text(res.webSiteInfo.companyName).attr('href', 'https://'+ res.webSiteInfo.companyName);

      $('#email').text(res.webSiteInfo.websiteAddress).attr('href', 'mailto:'+ res.webSiteInfo.websiteAddress);
      
      $('#companyAddress').text(res.webSiteInfo.companyAddress);
    }
  });
});


$(() =>{
  // change website  phone
  $.getJSON(path.getSiteInfo()).then((res) =>{
    if(res.code === 0){
      var phoneArr = res.webSiteInfo.websitePhone;
      
      $('section .phoneNo').html(phoneArr);
    }
  });
});