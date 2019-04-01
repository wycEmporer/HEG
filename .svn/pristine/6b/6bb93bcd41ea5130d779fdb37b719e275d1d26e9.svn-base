
class Heg{
  constructor(options) {
    this.$options = options;
    this._data = options.data;
    this.update = options.update;
    // Object.keys(options.data).forEach(key => this._proxy(key));
    // observer(options.data);
    // const vdom = watch(this, this._render.bind(this), this._update.bind(this));
    defineReactive(options.data, 'pr', options.data.pr);
    // watch(this._data.pr, this._update.bind(this));
    // console.log(vdom);
  }

}

function defineReactive(obj, key, val) {
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
      observerPr[obj.fn].update();
    }
  });
}

var observerPr = {};
function observer(data){
  observerPr[data.fn] = new Heg({
    el: data.fn.replace(/\//g, '\\/'),
    data,
    update() {
      //9-12
      $('#'+ this.$options.el + ' '+'.fpr').html(Math.round((this._data.pr) / this._data.fee.pCount).toThree());
      var fee = this._data.fee;
      // var cashDoms = $('#'+ this.$options.el + ' '+'.gback');
      for(var i = 1; i < fee.fees.length; i ++){
        if(fee.fees[i].type == 3 || fee.fees[i].type == 4){
          $('#'+ this.$options.el + ' ' + '.gback'+ i).html(Math.round(fee.fees[i].cba / fee.pCount).toThree());
        }
        if (fee.fees[i].type === 2) {
          $('#'+ this.$options.el + ' '+'.memberP').html(Math.round((this._data.pr + fee.fees[i].sdis) / this._data.fee.pCount).toThree());
        }
      }
      
    }

  });
}
export {observer};