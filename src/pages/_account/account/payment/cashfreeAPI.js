const paths = require('utils').path;
export default function(type, params, IS_PROD_URL, target){
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