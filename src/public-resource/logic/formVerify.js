
/*
  nameReg.test(form.value)
  u4E00-u9FA5 //chinese 
*/
export const nameReg = /^[A-Za-z\s\'\-\.]*[A-Za-z]+[A-Za-z\s\'\-\.]*$/;
export const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,6}$/;
export const mobReg =  /^\d+$/;
export const mobCommerReg = /^(([\d]+\s)?[\d]{6,20},)*(([\d]+\s)?[\d]{6,20})$/;
export const pwdReg = /.{6,32}/;
export const bankCardReg = /^\d+$/;
export const gstNum = /^[A-Za-z0-9]{1,20}$/;
export const gstName = /^[A-Za-z\d\-\.\s]+$/;
export const gstPhone = /^[0-9]{10,20}$/;
export const UPI = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[A-Za-z\d]+/;
export const PNR = /^[0-9a-zA-Z]+$/;
