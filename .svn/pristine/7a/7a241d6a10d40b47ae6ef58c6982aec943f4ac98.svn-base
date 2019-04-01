require('cp');
require('lessDir/base.less');
require('./content.less');
var utils = require('utils'); 
var queryObj = utils.parseQueryStr();
$.ajax({
  url:utils.path.verifyRegister()+ '?token=' + queryObj.token,
  type:'GET',
  header: {'x-Device':'PC'},
  dataType:'json'
}).done(function(data){
  var status = {
    ACSUCCESS:{
      'titleClass': 'success',
      'titleText': 'Activation successful',
      'text1': 'Your HappyEasyGo account is actived',
      'text2': 'You can book tickets with the account',
      'btnClass':'',
      'url': '/',
      'btnText': 'Book now',
    },
    ACEXPIRED:{
      'titleClass': 'fail',
      'titleText': 'Activation link expired',
      'text1': 'Your HappyEasyGo account has not been activated.',
      'text2': 'The original activation link has expired and a new activation mail has been sent to your mail box.',
      'btnClass':'resend',
      'btnText': 'Go to mailbox',
    },
    ACUSED:{
      'titleClass': 'success',
      'titleText': 'Account already activated',
      'text1': 'Your HappyEasyGo account has been actived already.',
      'text2': 'You can book tickets with the account.',
      'url': '/',
      'btnClass':'',
      'btnText': 'Book now',
    },
    ACERROR:{
      'titleClass': 'fail',
      'titleText': 'Activation failed',
      'text1': 'Your HappyEasyGo account has not been activated.',
      'text2': 'If you copy the link address from the activation mail, please make sure the full address is copied.',
      'btnClass':'register',
      'btnText': 'Sign up again',
    }
  };
  var hash={   
    'qq.com': 'http://mail.qq.com',   
    'gmail.com': 'http://mail.google.com',   
    'sina.com': 'http://mail.sina.com.cn',   
    '163.com': 'http://mail.163.com',   
    '126.com': 'http://mail.126.com',   
    'yeah.net': 'http://www.yeah.net/',   
    'sohu.com': 'http://mail.sohu.com/',   
    'tom.com': 'http://mail.tom.com/',   
    'sogou.com': 'http://mail.sogou.com/',   
    '139.com': 'http://mail.10086.cn/',   
    'hotmail.com': 'http://login.live.com/',   
    'live.com': 'http://login.live.com/',   
    'live.cn': 'http://login.live.cn/',   
    'live.com.cn': 'http://login.live.com.cn',   
    '189.com': 'http://webmail16.189.cn/webmail/',   
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',   
    'yahoo.cn': 'http://mail.cn.yahoo.com/',   
    'eyou.com': 'http://www.eyou.com/',   
    '21cn.com': 'http://mail.21cn.com/',   
    '188.com': 'http://www.188.com/',   
    'foxmail.coom': 'http://www.foxmail.com'   
  };
  var model = status[data.status];
    model.email = data.email == ''  ? 'javascript:void(0)' : data.email ;
    model.url = model.url || '/';
    var renderTemp = _.template($('#contentTpl').html());
    $('.activation').html(renderTemp(model));
    // $('.activation .login').click(function(){
    //   $('#login_modal').find('.modal-content').load('/static/tpl/loginTpl.html').end().modal('show');
    // });
    $('.activation .register').click(function(){
      $('#register_modal').find('.modal-content').load('/static/tpl/register.html').end().modal('show');
    });
});