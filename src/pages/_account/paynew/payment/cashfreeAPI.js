const IS_PROD_URL = (process.env.NODE_ENV === 'production' && !IS_UAT) ? 'https://www.cashfree.com/checkout/post/submit' : 'https://test.cashfree.com/billpay/checkout/post/submit ';
const paths = require('utils').path;
export default function(type, params, target){
  var tempform = document.createElement('form');
  tempform.action = IS_PROD_URL;
  tempform.method = 'post';
  tempform.style.display = 'none';
  if (target) {
    tempform.target = target;
  }

  for (var x in params) {
    var opt = document.createElement('input');
    opt.name = x;
    opt.value = params[x];
    tempform.appendChild(opt);
  }

  var opt = document.createElement('input');
  opt.type = 'submit';
  tempform.appendChild(opt);
  document.body.appendChild(tempform);
  tempform.submit();
  document.body.removeChild(tempform);
}