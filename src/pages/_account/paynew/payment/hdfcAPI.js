export default function postcall(params, target) {
  var tempform = document.createElement('form');
  tempform.action = 'https://secure.ebs.in/pg/ma/payment/request';
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