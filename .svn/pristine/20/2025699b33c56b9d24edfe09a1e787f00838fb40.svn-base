(function($){
	$.fn.kwicks = function(options) {
		var defaults = {
			isVertical: false, //横向or竖向
			sticky: false,
			defaultKwick: 0,
			event: 'mouseenter',
			spacing: 0,
			duration: 500
		};
		var o = $.extend(defaults, options);
		var WoH = (o.isVertical ? 'height' : 'width'); // WoH = Width or Height
		var LoT = (o.isVertical ? 'top' : 'left'); // LoT = Left or To

		
		return this.each(function() {
			var container = $(this);
			var kwicks = container.children('li');
			// var normWoH = kwicks.eq(0).css(WoH).replace(/px/,''); // normWoH = Normal Width or Height
			var normWoH = o.normWoH; // normWoH = Normal Width or Height
			if(!o.max) {
				o.max = (normWoH * kwicks.size()) - (o.min * (kwicks.size() - 1));
			} else {
				o.min = normWoH -  (o.max-normWoH)/2;
			}
			// set width of container ul
			if(o.isVertical) {
				container.css({
					width : kwicks.eq(0).css('width'),
					height : (normWoH * kwicks.size()) + (o.spacing * (kwicks.size() - 1)) + 'px'
				});				
			} else {
				container.css({
					width : (normWoH * kwicks.size()) + (o.spacing * (kwicks.size() - 1)) + 'px',
					height : kwicks.eq(0).css('height')
				});				
			}
			var maxLi = o.max + o.spacing; // 470
			var minLi = o.min + o.spacing; // 320
			var norLi = normWoH + o.spacing; //370
			var preCalcLoTs = []; // preCalcLoTs = pre-calculated Left or Top's
			for(let i = 0; i < kwicks.size(); i++) {
				preCalcLoTs[i] = [];
				// don't need to calculate values for first or last kwick
				for( let j = 1; j < kwicks.size() - 1; j++) {
					if(i == j) {
						preCalcLoTs[i][j] = o.isVertical ? j * o.min + (j * o.spacing) : j * o.min + (j * o.spacing);
					} else {
						preCalcLoTs[i][j] = (j <= i ? (j * o.min) : (j-1) * o.min + o.max) + (j * o.spacing);
					}
				}
			}
			// loop through all kwick elements
			let A_index = 0;
			kwicks.each(function(i) {
				var kwick = $(this);
				// set initial width or height and left or top values
				// set first kwick
				if(i === 0) {
					kwick.css(LoT, '0px');
				} 
				// set last kwick
				else if(i == kwicks.size() - 1) {
					kwick.css(o.isVertical ? 'bottom' : 'right', '0px');
					kwick.css('padding-right', '0px');
				}
				// set all other kwicks
				else {
					if(o.sticky) {
						kwick.css(LoT, preCalcLoTs[o.defaultKwick][i]);
					} else {
						kwick.css(LoT, (i * normWoH) + (i * o.spacing));
					}
				}
				// correct size in sticky mode
				if(o.sticky) {
					if(o.defaultKwick == i) {
						kwick.css(WoH, o.max + 'px');
						kwick.addClass('active');
					} else {
						kwick.css(WoH, o.min + 'px');
					}
				}
				kwick.css({
					margin: 0,
					position: 'absolute'
				});
			
				let pageX = 0 ;
				
				kwick.bind(o.event, function(e) {
					
					A_index = $(this).index();
					var div = $('.flexslider');//获取你想要的DIV	
					var x1 = div.offset().left;  //div左边两个的点的x值
					pageX = Math.ceil((e.pageX - x1)/norLi)-1;
					// calculate previous width or heights and left or top values
					var prevWoHs = []; // prevWoHs = previous Widths or Heights
					var prevLoTs = []; // prevLoTs = previous Left or Tops
					kwicks.stop().removeClass('active');
					for(let j = 0; j < kwicks.size(); j++) {
						prevWoHs[j] = kwicks.eq(j).css(WoH).replace(/px/, '');
						prevLoTs[j] = kwicks.eq(j).css(LoT).replace(/px/, '');
					}
					var aniObj = {};
					aniObj[WoH] = o.max;
					var maxDif = o.max - prevWoHs[i];
					var prevWoHsMaxDifRatio = prevWoHs[i]/maxDif;
					
					kwick.addClass('active').animate(aniObj, {
						step: function(now) {
							var percentage = maxDif != 0 ? now/maxDif - prevWoHsMaxDifRatio : 1;
							if(pageX == 0) {
								kwicks.each(function(j) {
									if(j == i+1) {
										kwicks.eq(j).css(WoH, prevWoHs[j] - ((prevWoHs[j] - o.min) * percentage) + 'px');
										kwicks.eq(j).css(LoT, prevLoTs[j] - 0 + ((maxLi+norLi*(i) - prevLoTs[j]) * percentage) + 'px');
									} else if(j == i+2) {
										kwicks.eq(j).css(WoH, prevWoHs[j] - ((prevWoHs[j] - o.min) * percentage) + 'px');
										kwicks.eq(j).css(LoT, prevLoTs[j]-0 + (((norLi*(i)+ minLi + maxLi) - prevLoTs[j]) * percentage) + 'px');
									}
								});
							} else if(pageX == 1) {
								kwicks.each(function(j) {
									if(j == i+1) {
										kwicks.eq(j).css(WoH, prevWoHs[j] - ((prevWoHs[j] - o.min) * percentage) + 'px');
										kwicks.eq(j).css(LoT, prevLoTs[j] - 0 + (((norLi*(j-2)+ minLi + maxLi) - prevLoTs[j]) * percentage) + 'px');
									} else if(j == i-1) {
										kwicks.eq(j).css(WoH, prevWoHs[j] - ((prevWoHs[j] - o.min) * percentage) + 'px');
									} else if(j == i) {
										kwicks.eq(j).css(LoT, prevLoTs[j] - ((prevLoTs[j] - (norLi*(j-1)+minLi)) * percentage) + 'px');
									}
								});
							} else if(pageX == 2) {
								kwicks.each(function(j) {
									if(j == i-2) {
										kwicks.eq(j).css(WoH, prevWoHs[j] - ((prevWoHs[j] - o.min) * percentage) + 'px');
									} else if(j == i-1) {
										kwicks.eq(j).css(WoH, prevWoHs[j] - ((prevWoHs[j] - o.min) * percentage) + 'px');
										kwicks.eq(j).css(LoT, prevLoTs[j]-0 - ((prevLoTs[j] - ((norLi*(j-1)+minLi))) * percentage) + 'px');
									} else if( j == i) {
										kwicks.eq(j).css(LoT, prevLoTs[j]-0 - (( prevLoTs[j] - (minLi*2+norLi*(i-2))) * percentage) + 'px');
									}
								});
							}
						},
						duration: o.duration,
						easing: o.easing
					});

				});
			});
			if(!o.sticky) {
				container.bind('mouseleave', function() {
					var prevWoHs = [];
					var prevLoTs = [];
					kwicks.removeClass('active').stop();
					for(let i = 0; i < kwicks.size(); i++) {
						prevWoHs[i] = kwicks.eq(i).css(WoH).replace(/px/, '');
						prevLoTs[i] = kwicks.eq(i).css(LoT).replace(/px/, '');
					}
					var aniObj = {};
					aniObj[WoH] = normWoH;
					
					var normDif = prevWoHs[A_index] - normWoH;//100
					kwicks.eq(A_index).animate(aniObj, {
						step: function(now) {//450-300
							var percentage = normDif != 0 ? (prevWoHs[A_index] - now)/normDif : 1;
							for(let i = 0; i < kwicks.size(); i++) {
								kwicks.eq(i).css(WoH, prevWoHs[i] - ((prevWoHs[i] - normWoH) * percentage) + 'px');
								if(i < kwicks.size()) {
									kwicks.eq(i).css(LoT, prevLoTs[i] - ((prevLoTs[i] - ((i * normWoH) + (i * o.spacing))) * percentage) + 'px');
								}
							}
						},
						duration: o.duration,
						easing: o.easing
					});
				});
			}

			// 事件

			var flag = true;

			$(document).on('click', '.grid_8 .left2', function(){
				if(!flag) return false;
				var left = parseInt($('.slides').css('left'));
				flag = false;
				if(left >= 0) {
					$('.slides').css('left', -(norLi*(o.length/2)));
				}
				left = parseInt($('.slides').css('left'));
				let i = 1; 
				$('.slides').animate({'left':left+norLi}, 'slow', function(){
					flag = true; 
				});
				i++;
			});
			
			$(document).on('click', '.grid_8 .right2', function(){
				rightClick();
			});

			function rightClick(){
				if(!flag) return false;
				flag = false;
				var ulLength = norLi*(o.length - o.calLength);
				var left = parseInt($('.slides').css('left'));
				if(Math.abs(left) >=ulLength) {
					$('.slides').css('left', -norLi*(o.length/2-3));
				}
				left = parseInt($('.slides').css('left'));
				let i = 1; 
				$('.slides').animate({'left':left-norLi}, 'slow', function(){
					flag = true; 
				});
				i++;
			}
			
			$('.left2,.right2,.slides').hover(
				function(){
					closePlay();
				}, function(){
					autoPlay();
			});

		//给方法定义全局变量是因为停止的时候要使用
		var timer;
		function autoPlay(){
			timer=setInterval(function(){
				rightClick();
			}, 5000);
		}
		function closePlay(){
			clearInterval(timer);
		}
		autoPlay();
		});
	};
})(jQuery);