$(document).ready(function(){
	demeterScroll()
});
function demeterScroll() {
	//Preparation
	var windowHeight = $(window).height()*0.8;
	var windowWidth = $(window).width();
	var scrollAnimateTime = 500;
	var scrollAnimateEffect = 'swing';
	var scrollAnimateFrom = 150;
	var scrollAnimateItem = $('.s-a');
	$(window).load(function(){
		scrollAnimateItem.each(function(){
			var current = $(this);
			var currentParent = $(this).parent();
			var currentParentHeight = currentParent.outerHeight();
			var currentParentWidth = currentParent.outerWidth();
			var currentEffect = current.data('effect');
			if (currentEffect == 'fromleft') {
				currentParent.css({
					overflow: 'hidden',
					width: currentParentWidth,
					height: currentParentHeight
				});
				current.css({
					opacity: 0,
					marginLeft: -scrollAnimateFrom,
					marginRight: scrollAnimateFrom,
					width: 100+'%',
					height: 100+'%'
				});	
			}
			else if (currentEffect == 'fromright') {
				currentParent.css({
					overflow: 'hidden',
					width: currentParentWidth,
					height: currentParentHeight
				});
				current.css({
					opacity: 0,
					marginLeft: scrollAnimateFrom,
					marginRight: -scrollAnimateFrom,
					width: 100+'%',
					height: 100+'%'
				});	
			}
			else if (currentEffect == 'fromtop') {
				currentParent.css({
					overflow: 'hidden',
					width: currentParentWidth,
					height: currentParentHeight
				});
				current.css({
					opacity: 0,
					marginTop: -scrollAnimateFrom,
					width: 100+'%',
					height: 100+'%'
				});	
			}
			else if (currentEffect == 'frombottom') {
				currentParent.css({
					overflow: 'hidden',
					width: currentParentWidth,
					height: currentParentHeight
				});
				current.css({
					opacity: 0,
					marginTop: scrollAnimateFrom,
					width: 100+'%',
					height: 100+'%'
				});	
			}
			else if (currentEffect == 'onlyfade') {
				currentParent.css({
					overflow: 'hidden',
					width: currentParentWidth,
					height: currentParentHeight
				});
				current.css({
					opacity: 0
				});	
			}
		});//EACH
	});//LOAD		

	scrollAnimateItem.each(function(){
		var current = $(this);
		var currentParent = current.parent();
		var currentParentHeight = currentParent.offset().top;
		$(window).scroll(function() {
			var scrollHeight = $(window).scrollTop()+windowHeight;
			if (scrollHeight > currentParentHeight || $(window).scrollTop() > ($(document).height()-$(window).height()-20)) {
				var currentEffect = current.data('effect');
				var currentDelay = current.data('delay');
				if (currentEffect == 'onlyfade') {
					current.delay(currentDelay).animate({opacity: 1},scrollAnimateTime,scrollAnimateEffect);
				}
				else if (currentEffect == 'fromleft' || currentEffect == 'fromright') {
					current.delay(currentDelay).animate({opacity: 1, marginLeft: 0, marginRight: 0},scrollAnimateTime,scrollAnimateEffect);
				}
				else if (currentEffect == 'frombottom' || currentEffect == 'fromtop') {
					current.delay(currentDelay).animate({opacity: 1, marginTop: 0, marginBottom: 0},scrollAnimateTime,scrollAnimateEffect);
				}
				setTimeout(function() {
					currentParent.css({overflow: 'initial', width: '', height: ''});
					current.css({width: '', height: ''});
					current.removeClass('s-a');
				}, scrollAnimateTime+currentDelay);
			}
		});//SCROLL
	});//EACH
}//function