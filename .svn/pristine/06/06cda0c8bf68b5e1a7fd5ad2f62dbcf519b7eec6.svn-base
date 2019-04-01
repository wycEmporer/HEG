/**
  *pRange awesome range control
  *Written by
  *Jesse Gao(weizhijie924@hotmail.com)
  *Licensed under the MIT
  *Dependecies
  *------------
  *jQuery 
  *description
  *----------------
  *at initialization,according to this.options.value,adjust this pointer position with "setValue" function;
  *three function (dragEnd, clickBar, setValue) can trigger onstatechage function;
**/
(function($, window, document, undefined){
  'use strict';
  var pRange = function(){
    //第一个this 当前构造函数,第二个指调用的dom 对象
    this.init.apply(this, arguments);
  };
  pRange.prototype = {
    default:{
      onstatechange: function(){},
      isRange:false,
      step:1,
      showLabels: true,
      format:'%s',
      width: 200,
      theme:'',
      disable:false
    },
    template:'<div class="slider-container">\
        <div class="price-label clearfix">\
          <span class="pointer-label">0</span>\
          <span class="pointer-label">0</span>\
        </div>\
        <div class="price">\
          <div class="selection"></div>\
          <a class="rangeHandle low"></a>\
          <a class="rangeHandle high"></a>\
          <div class="tracker"></div>\
        </div>\
      </div>',
    init:function(node, options){
      this.options       = $.extend({}, this.default, options);
      this.inputNode     = $(node);
      this.options.value = this.inputNode.val() || (this.options.isRange ? this.options.from + ',' + this.options.to : this.options.to);
      this.domNode       = $(this.template);
      this.domNode.addClass(this.options.theme);
      // remove 上次的 slider-container
      this.inputNode.parent().find('.slider-container').remove();
      this.inputNode.after(this.domNode);
      this.domNode.on('change', this.onChange);
      this.pointers      = $('.rangeHandle', this.domNode);
      this.lowPointer    = this.pointers.first();
      this.highPointer   = this.pointers.last();
      this.labels        = $('.pointer-label', this.domNode);
      this.lowLabel      = this.labels.first();
      this.highLabel     = this.labels.last();
      this.highLabel.data('price', this.options.to);
      this.bar           = $('.selection', this.domNode);
      this.clickableBar  = this.domNode.find('.tracker');
      this.interval      = this.options.to - this.options.from;
      this.render();
    },
    render: function(){
      if(this.inputNode.width() === 0 && !this.options.width){
        console.log('prange: no width found, returning');
        return;
      }else{
        this.domNode.width(this.options.width || this.inputNode.width());
        this.inputNode.hide();
      }
      if(this.isSingle()){
        this.lowPointer.hide();
      }
      if(!this.options.showLabels){
        this.labels.hide();
      }
      this.attachEvent();
      this.setValue(this.options.value);
    },
    isSingle:function(){
      if(typeof(this.options.value) === 'number'){
        return true;
      }
      return (this.options.value.indexOf(',') !== -1 || this.options.isRange) ? false : true;
    },
    attachEvent:function(){
      this.clickableBar.click($.proxy(this.barClicked, this));
      this.pointers.on('mousedown touchstart', $.proxy(this.onDragStart, this));
      this.pointers.on('dragstart', function(e){
        e.preventDefault();
      });
    },
    onDragStart: function(e){
      if(this.options.disable || (e.type === 'mousedown' && e.which !== 1)) return;
      e.stopPropagation();
      e.preventDefault();
      var pointer = $(e.target);
      this.pointers.removeClass('last-active');
      pointer.addClass('foucused last-active');
      this[(pointer.hasClass('low') ? 'low' : 'high') + 'Label'].addClass('focused');
      $(document).on('mousemove.slider touchmove.slider', $.proxy(this.onDrag, this, pointer));
      $(document).on('mouseup.slider touchend.slider touchcancel.slider', $.proxy(this.onDragEnd, this));
    },
    onDrag:function(pointer, e){
      e.stopPropagation();
      e.preventDefault();
      // 获取第一个手指触摸
      if(e.originalEvent.touches && e.originalEvent.touches.length){
        e = e.originalEvent.touches[0];
      }else if (e.originalEvent.changedTouches && e.originalEvent.changedtouches.length){
        e = e.originalEvent.changedTouches[0];
      }
      //position : 滑动长度 number;
      var position = e.pageX - this.domNode.offset().left;
      this.domNode.trigger('change', [this, pointer, position]);
    },
    onDragEnd: function(e){
      this.pointers.removeClass('focused');
      this.labels.removeClass('focused');
      $(document).off('.slider');
      this.options.onstatechange.call(this, this.options.value);
    },
    barClicked:function(e){
      if(this.options.disable) return;
      var x = e.pageX - this.clickableBar.offset().left;
      if(this.isSingle()){
        this.setPosition(this.pointers.last(), x, true, true);
      }else{
        var pointer = Math.abs(parseInt(this.pointers.first().css('left'), 10) - x + this.pointers.first().width() / 2) < Math.abs(parseInt(this.highPointer.css('left'), 10) - x + this.lowPointer.width() / 2) ? this.lowPointer : this.highPointer;
        this.setPosition(pointer, x, true, true);
      }
      this.options.onstatechange.call(this, this.options.value);
    },
    onChange: function(e, self, pointer, position){
      var min, max;
      if(self.isSingle()){
        min = 0;
        max = self.domNode.width();
      }else {
        min = pointer.hasClass('high') ? self.lowPointer.position().left + self.lowPointer.width() / 2 : 0;
        max = pointer.hasClass('low') ? self.highPointer.position().left + self.highPointer.width() / 2 : self.domNode.width();
      }
      var value = Math.min(Math.max(position, min), max);
      self.setPosition(pointer, value, true);
    },
    // isPx 是否用 px 表示滑动距离 : 用百分比, animate :是否动画
    setPosition:function(pointer, position, isPx, animate){
      var leftPos,
          lowPos = this.lowPointer.position().left,
          highPos = this.highPointer.position().left,
          circleWidth = this.highPointer.width() / 2;
      if(!isPx){
        // 如果不是position 不是px 转换px
        position = this.prcToPx(position);
      }
      if(pointer[0] === this.highPointer[0]){
        highPos = Math.round(position - circleWidth);
      }else {
        lowPos = Math.round(position - circleWidth);
      }
      // pointer的位移: position是计算长度,也是鼠标的位置,减去 pointer半径,鼠标就与原点重合
      pointer[animate ? 'animate' : 'css']({'left': Math.round(position - circleWidth)});
      if(this.isSingle()){
        leftPos = 0;
      }else{
        leftPos = lowPos + circleWidth;
      }
      this.bar[animate ? 'animate' : 'css']({
        'width': Math.round(highPos + circleWidth - leftPos),
        'left': leftPos
      });
      this.showPointerValue(pointer, position, animate);
      this.isReadonly();
    },
    setValue: function(value){
      var values = value.toString().split(',');
      this.options.value = value;
      var prc = this.valueToPrc(values.length === 2 ? values : [0, values[0]]);
      if(this.isSingle()){
        this.setPosition(this.highPointer, prc[1]);
      }else{
        this.setPosition(this.lowPointer, prc[0]);
        this.setPosition(this.highPointer, prc[1]);
      }
      this.options.onstatechange.call(this, this.options.value);
    },
    // position : ...px , animate :true,false
    showPointerValue: function(pointer, position, animate){
      var label = $('.pointer-label', this.domNode)[pointer.hasClass('low') ? 'first' : 'last']();
      var text;
      var value = this.positionToValue(position);
      // 固定起始点值
      if(this.isSingle()){
        this.lowLabel.html(this.options.format(this.options.from));
      }
      if($.isFunction(this.options.format)){
        var type = this.isSingle() ? undefined : (pointer.hasClass('low') ? 'low' : 'high');
        text = this.options.format(value, type);
      }else{
        text = this.options.format.replace('%s', value);
      }
      label.html(text);
      this.setInputValue(pointer, value);
      // 下面是设置label 随 pointer 移动
      // var width = label.html(text).width(),
      //   left = position - width / 2;
      //   left = Math.min(Math.max(left, 0), this.options.width - width);
      //   label[animate ? 'animate' : 'css']({
      //   left: left
      // });
    },
    valueToPrc:function(values){
      var lowPrc = (((values[0] - this.options.from) <= 0 ? 0 : (values[0] - this.options.from))* 100 / this.interval);
      var highPrc = (((values[1] - this.options.from) <= 0 ? 0 : (values[1] - this.options.from))* 100 / this.interval);
      return [lowPrc, highPrc];
    },
    prcToPx: function(prc){
      return (this.domNode.width() * prc) / 100;
    },
    // 坐标值转化数值
    positionToValue: function(pos){
      if(pos/this.domNode.width() <= 0){
        return this.options.from;
      }else if(pos/this.domNode.width() >= 1){
        return this.options.to;
      }else{
        var value = (pos / this.domNode.width()) * this.interval;
        // 加上 底数就是 当前的 值
        value = Math.round(value / this.options.step) * this.options.step;
         
        return value + this.options.from;
      }
    },
    setInputValue: function(pointer, v){
      if(this.isSingle()){
        this.options.value = v.toString();
      }else{
        var values = this.options.value.split(',');
        if(pointer.hasClass('low')){
          this.options.value = v + ',' + values[1];
        }else{
          this.options.value = values[0] + ',' + v;
        }
      }
      if(this.inputNode.val() !== this.options.value){
        this.inputNode.val(this.options.value);
      }
    },
    getValue:function(){
      return this.options.value;
    },
    isReadonly: function(){
          this.domNode.toggleClass('slider-readonly', this.options.disable);
        },
    disable: function(){
      this.options.disable = true;
      this.isReadonly();
    },
    enable: function(){
      this.options.disable = false;
      this.isReadonly();
    },
    toggleDisable: function(){
      this.options.disable = !this.options.disable;
      this.isReadonly();
    }
  };
  var pluginName = 'pRange';
  // $.fn.extend({'pRange': function(){}});
  // $.prototype.pRange = function(){}
  $.fn[pluginName] = function(option){
    var args = arguments,
        result;
    // this 指将来调用 pRange 的jqdom 的集合,可能是多个
    this.each(function(){
      //里面this 指单个dom
      var $this = $(this);
      var options = typeof option === 'object' && option;
      //缓存,如果不用data 就会出现两个 range
      // var data = $.data(this, 'plugin_' + pluginName);
      // var data = $this.data('plugin_' + pluginName);
      // if(!data){
      //   $this.data('plugin_' + pluginName, (data = new pRange(this, options)));
        // $(window).resize(function(){
        //   data.setValue(data.getValue());
        // });
      // }
      var data = new pRange(this, options);
      if(typeof option === 'string'){
        result = data[option].apply(data, Array.prototype.slice.call(args, 1));
      }
    });
    return result || this;
  };
})(jQuery, window, document);

// 期间有 用到init this 里的属性
// 可以用 from 和 to 表示金额 固定大小 
// value 表示范围 单控制

// postions.value 类型