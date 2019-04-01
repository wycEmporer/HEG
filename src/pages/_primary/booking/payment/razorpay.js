export default function razorpay(params){
  $.getScript('https://checkout.razorpay.com/v1/razorpay.js').done(res => {
    var razorpay = new Razorpay({
      key: params.data.appId,
      callback_url: params.data.returnUrl,
      redirect: true
    });
    razorpay.createPayment(params.data.data);
    // .on('payment.success', success_callback)
    // .on('payment.error', error_callback);
  });
}