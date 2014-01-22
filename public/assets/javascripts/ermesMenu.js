function hermesMenu() {
	//Set Variables
	if(typeof hermesMenuId === 'undefined' || typeof hermesBarId === 'undefined'){alert('Error: Hermes Menu Id Missing!');}
	else {
		var menuId = hermesMenuId;
		var barId = hermesBarId;
		var menu = $('#'+menuId);
		var bar = $('#'+barId);
		var menuLink = menu.find('a');
		//Memory Variable
		var lastLocate = 0;
		var lastLink = menuLink.eq(0);
		var scrollClick = false;
		var memoColor = lastLink.css('color');		
		//Check Default
		if(typeof hermesMenuTime === 'undefined'){hermesMenuTime = 500;}
		if(typeof hermesLinkColor === 'undefined'){hermesLinkColor = '';}
		if(typeof hermesSynchroScroll === 'undefined'){hermesSynchroScroll = false;}
		if(typeof hermesResizeCheckpoint === 'undefined'){hermesResizeCheckpoint = false;}
		if(typeof hermesExceptionClass === 'undefined'){hermesExceptionClass = 'nobar';}
		var menuTime = hermesMenuTime;
		var linkColor = hermesLinkColor;
		var sincroScroll = hermesSynchroScroll ;
		var resizeCheckpoint = hermesResizeCheckpoint;
		var exceptionClass = hermesExceptionClass;
		//Utility Variables			
		var activationArea = menu.height();	
		var barLeft = lastLink.parent().position().left;
		var barTop = lastLink.parent().position().top;
		var barWidth = lastLink.parent().width();
		var barHeight = lastLink.parent().height();
		bar.css({
			left: barLeft,
			top: barTop,
			width: barWidth,
			height: barHeight
		});		
		//Start Preparation
		lastLink.css({color: linkColor});
		// Menu Value Click
		menuLink.click(function(e){
			e.preventDefault();
			var current = $(this);
			if(!current.hasClass(exceptionClass)){
				barLeft = current.parent().position().left;
				barTop = current.parent().position().top;
				barWidth = current.parent().width();
				barHeight = current.parent().height();			
				//Move Bar
				bar.stop().animate({
					width: barWidth,
					height: barHeight,
					left: barLeft,
					top: barTop				
				},menuTime, function(){
					if (linkColor == ''){						
						menuLink.not(current).css({color: ''});
						current.css({color: linkColor});
					}
				});
				if (linkColor != ''){
					menuLink.not(current).stop().animate({color: memoColor},menuTime);
					current.stop().animate({color: linkColor},menuTime);
				}
				var linkLocation = current.attr('href');
				if(linkLocation != '#' && sincroScroll == true && linkLocation.substr(0,1) == '#') {
					var sectionLocate = $(linkLocation).offset().top-activationArea+1;	
					// Launch Animations
					scrollClick = true;
					$("html, body").stop().animate({
						scrollTop: sectionLocate
					},menuTime*2, function(){
						lastLocate = sectionLocate;
						lastLink = current;
						scrollClick = false;
					});
					/*Modify Hash - not implemented yet
					setTimeout(function(){window.location.hash = sectionSelected;},1100);
					*/				
					lastLocate = sectionLocate;
				}
				lastLink = current
			}
			else {
				window.location = current.attr('href');
			}
		});

		// Barmenu
		menuLink.each(function() {
			var current = $(this);
			$(window).scroll(function() {		
				var windowScroll = $(window).scrollTop();
				var linkLocation = current.attr('href');
				if(linkLocation != '#' && sincroScroll == true && linkLocation.substr(0,1) == '#') {
					var sectionLocate = $(linkLocation).offset().top-activationArea;				
					// Launch Animations
					if(
					(windowScroll > sectionLocate && sectionLocate > lastLocate && scrollClick == false)
					||
					(windowScroll < lastLocate && sectionLocate < lastLocate && scrollClick == false)
					)
					{
						barLeft = current.parent().position().left;
						barTop = current.parent().position().top;
						barWidth = current.parent().width();
						barHeight = current.parent().height();
						bar.stop().animate({
							width: barWidth,
							height: barHeight,
							left: barLeft,
							top: barTop
						},menuTime, function(){
							if (linkColor == ''){						
								menuLink.not(current).css({color: ''});
								current.css({color: linkColor});
							}
						});
						if (linkColor != ''){
							menuLink.not(current).stop().animate({color: memoColor},menuTime);
							current.stop().animate({color: linkColor},menuTime);
						}
						/*Modify Hash - not implemented yet
						window.location.hash = sectionSelected;
						*/
						lastLocate = sectionLocate;
						lastLink = current;
					}
				}
			});//SCROLL
		});//EACH
		$(window).resize(function() {
			if ( resizeCheckpoint == true) {
				lastLink.click();
			}
			else {
				barLeft = lastLink.parent().position().left;
				barTop = lastLink.parent().position().top;
				barWidth = lastLink.parent().width();
				barHeight = lastLink.parent().height();
				bar.stop().animate({
					width: barWidth,
					height: barHeight,
					left: barLeft,
					top: barTop
				},menuTime);
			}
		});
	}//ELSE		
}//FUNCTION