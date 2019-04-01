class Heg{
  constructor(options){
    this.$options = options;
    this._data = options.data;
    this.update = options.update;
    defineReactive(options.data, 'disPrice', options.data.disPrice, this);
    defineReactive(options.data, 'totalPrice', options.data.totalPrice, this);
  }
}
function defineReactive(obj, key, val, that) {
  // const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: ()=>{
      // if(Dep.target){
      //   dep.add(Dep.target);
      // }
      return val;
    },
    set: newVal => {
      if(newVal === val)
        return;
      val = newVal;
      that.update();
    }
  });
}

function observer(data){
  new Heg({
    el: data.elementId,
    data,
    update(){
      $('#viewOopr').html((this._data.fee.oopr).toThree());
      $('#viewCash').html(this._data.fee.discount.toThree());
      $('.viewCash_1').html(this._data.fee.discount.toThree());
      $('#silverDis').html(this._data.fee.discount);
      $('#' + this.$options.el).html(this._data.totalPrice.toThree());
    }
  });
}
export {observer};