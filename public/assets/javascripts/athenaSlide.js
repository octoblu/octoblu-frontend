function athenaSlide() {
	//Set Variables
	if(typeof athenaSlideId === 'undefined'){alert('Error: Athena Slide Id Missing!');}
	else {
		var slideId = athenaSlideId;
		var slide = $('#'+slideId);
		var slideWorks = slide.find('.slide');
		var slideNumber = slideWorks.length;	
		//Check Default
		if(typeof athenaSlideMode === 'undefined'){athenaSlideMode = 'sliding';}
		if(typeof athenaSlideTime === 'undefined'){athenaSlideTime = 500;}
		if(typeof athenaSlideDelay === 'undefined'){athenaSlideDelay = 500;}
		if(typeof athenaSlideEffect === 'undefined'){athenaSlideEffect = 'swing';}
		if(typeof athenaAutoStartLoop === 'undefined'){athenaAutoStartLoop = false;}
		if(typeof athenaLoopTime === 'undefined'){athenaLoopTime = 5000;}
		var slideMode = athenaSlideMode;
		var slideTime = athenaSlideTime;
		var slideDelay = athenaSlideDelay;
		var slideEffect = athenaSlideEffect;
		var autoStartLoop = athenaAutoStartLoop;
		var loopTime = athenaLoopTime;
		//Utility Variables
		var slideCounter = 0;
		var slideOut;
		var slideIn;
		var slideLoop;
		//Start Preparation
		slideWorks.eq(0).css({zIndex: 1});
		if (slideMode == 'sliding') {
			slideWorks.children().css({left: 100+'%', top: 100+'%', opacity: 1});		
			slideWorks.eq(0).children().css({left: 0, top: 0, opacity: 1});
		}
		else if (slideMode == 'fading') {
			slideWorks.children().css({left: 0, top: 0, opacity: 0});		
			slideWorks.eq(0).children().css({left: 0, top: 0, opacity: 1});
		}
		var previousButton = $('#'+athenaPreviousButtonId);
		var nextButton = $('#'+athenaNextButtonId);
		var dotButton = $('.'+athenaDotButtonClass);
		var dotActiveClass = athenaDotActiveClass;
		var playButton = $('#'+athenaPlayButtonId);
		var stopButton = $('#'+athenaStopButtonId);
		//Buttons
		previousButton.click(function(e){
			e.preventDefault();
			slideOut = slideWorks.eq(slideCounter);
			if(slideCounter > 0) {slideCounter--;}
			else {slideCounter = slideNumber-1;}
			slideIn = slideWorks.eq(slideCounter)
			if (slideMode == 'sliding') {
				slidePrevious();
			}
			else if (slideMode == 'fading') {
				fadePrevious();
			}
			if (autoStartLoop == true) {
				stopLoop();
				startLoop();
			}
		});
		nextButton.click(function(e){
			e.preventDefault();
			slideOut = slideWorks.eq(slideCounter);
			if(slideCounter < slideNumber-1) {slideCounter++;}
			else {slideCounter = 0;}
			slideIn = slideWorks.eq(slideCounter);
			if (slideMode == 'sliding') {
				slideNext();
			}
			else if (slideMode == 'fading') {
				fadeNext();
			}
			if (autoStartLoop == true) {
				stopLoop();
				startLoop();
			}			
		});
		dotButton.click(function(e){
			e.preventDefault();
			var slideSelect = $(this).index() - slideCounter;
			if (slideSelect > 0) {
				for (i=0; i<slideSelect; i++) {
					slideOut = slideWorks.eq(slideCounter);
					if(slideCounter < slideNumber-1) {slideCounter++;}
					else {slideCounter = 0;}
					slideIn = slideWorks.eq(slideCounter);
				}
				if (slideMode == 'sliding') {
					slideNext();
				}
				else if (slideMode == 'fading') {
					fadeNext();
				}
				if (autoStartLoop == true) {
					stopLoop();
					startLoop();
				}
			}
			else if(slideSelect < 0) {
				slideSelect = slideSelect*(-1)
				for (i=0; i<slideSelect; i++) {			
					slideOut = slideWorks.eq(slideCounter);
					if(slideCounter > 0) {slideCounter--;}
					else {slideCounter = slideNumber-1;}
					slideIn = slideWorks.eq(slideCounter)
				}
				if (slideMode == 'sliding') {
					slidePrevious();
				}
				else if (slideMode == 'fading') {
					fadePrevious();
				}
				if (autoStartLoop == true) {
					stopLoop();
					startLoop();
				}
			}
		});
		playButton.click(function(e){
			e.preventDefault();
			startLoop();
		});
		stopButton.click(function(e){
			e.preventDefault();
			stopLoop();
		});	
		//Animations
		function slidePrevious() {
			//SETUP
			slideWorks.css({zIndex: 0});	
			slideIn.css({zIndex: 2});
			slideOut.css({zIndex: 1});
			//ANIMATIONS
			slideWorks.not(slideIn).children().each(function(e){
				var current = $(this);
				var currentDir = current.data('out');
				var slideDirLeft;
				var slideDirTop;
				if (currentDir =='left') {slideDirLeft = -100+"%"; slideDirTop = 0+'%';}
				else if (currentDir =='right') {slideDirLeft = 100+"%"; slideDirTop = 0+'%';}				
				else if (currentDir =='top') {slideDirLeft = 0+"%"; slideDirTop = -100+'%';}
				else if (currentDir =='bottom') {slideDirLeft = 0+"%"; slideDirTop = 100+'%';}
				current.stop().animate({left: slideDirLeft, top: slideDirTop, opacity: 0},slideTime,slideEffect);
			});		
			slideIn.children().each(function(e){
				var current = $(this);
				var currentDir = current.data('in');
				var slideDirLeft;
				var slideDirTop;
				if (currentDir =='left') {slideDirLeft = -100+"%"; slideDirTop = 0+'%';}
				else if (currentDir =='right') {slideDirLeft = 100+"%"; slideDirTop = 0+'%';}				
				else if (currentDir =='top') {slideDirLeft = 0+"%"; slideDirTop = -100+'%';}
				else if (currentDir =='bottom') {slideDirLeft = 0+"%"; slideDirTop = 100+'%';}
				current.css({left: slideDirLeft, top: slideDirTop});
				current.stop().delay(current.index()*slideDelay).animate({left: 0+'%', top: 0+'%', opacity: 1},slideTime,slideEffect);
			});
			dotButton.removeClass(dotActiveClass);
			dotButton.eq(slideCounter).addClass(dotActiveClass);
		}
		function slideNext() {
			//SETUP
			slideWorks.css({zIndex: 0});	
			slideIn.css({zIndex: 2});
			slideOut.css({zIndex: 1});
			//ANIMATIONS
			slideWorks.not(slideIn).children().each(function(e){
				var current = $(this);
				var currentDir = current.data('out');
				var slideDirLeft;
				var slideDirTop;
				if (currentDir =='left') {slideDirLeft = -100+"%"; slideDirTop = 0+'%';}
				else if (currentDir =='right') {slideDirLeft = 100+"%"; slideDirTop = 0+'%';}				
				else if (currentDir =='top') {slideDirLeft = 0+"%"; slideDirTop = -100+'%';}
				else if (currentDir =='bottom') {slideDirLeft = 0+"%"; slideDirTop = 100+'%';}
				current.stop().animate({left: slideDirLeft, top: slideDirTop, opacity: 0},slideTime,slideEffect);
			});
			/**/		
			slideIn.children().each(function(e){
				var current = $(this);
				var currentDir = current.data('in');
				var slideDirLeft;
				var slideDirTop;
				if (currentDir =='left') {slideDirLeft = -100+"%"; slideDirTop = 0+'%';}
				else if (currentDir =='right') {slideDirLeft = 100+"%"; slideDirTop = 0+'%';}				
				else if (currentDir =='top') {slideDirLeft = 0+"%"; slideDirTop = -100+'%';}
				else if (currentDir =='bottom') {slideDirLeft = 0+"%"; slideDirTop = 100+'%';}
				current.css({left: slideDirLeft, top: slideDirTop});
				current.stop().delay(current.index()*slideDelay).animate({left: 0+'%', top: 0+'%', opacity: 1},slideTime,slideEffect);
			});
			dotButton.removeClass(dotActiveClass);
			dotButton.eq(slideCounter).addClass(dotActiveClass);
		}
		function fadePrevious() {
			//SETUP
			slideWorks.css({zIndex: 0});
			slideIn.css({zIndex: 2});
			slideOut.css({zIndex: 1});
			//ANIMATIONS
			slideOut.children().each(function(e){
				var current = $(this);
				current.animate({opacity: 0},slideTime,slideEffect);
			});
			/**/
			slideIn.children().each(function(e){
				var current = $(this);
				current.css({opacity: 0});
				current.stop().delay(current.index()*slideDelay).animate({opacity: 1},slideTime,slideEffect);
			});
			dotButton.removeClass(dotActiveClass);
			dotButton.eq(slideCounter).addClass(dotActiveClass);
		}
		function fadeNext() {
			//SETUP
			slideWorks.css({zIndex: 0});	
			slideIn.css({zIndex: 2});
			slideOut.css({zIndex: 1});
			//ANIMATIONS
			slideOut.children().each(function(e){
				var current = $(this);
				current.animate({opacity: 0},slideTime,slideEffect);
			});
			/**/		
			slideIn.children().each(function(e){
				var current = $(this);
				current.css({opacity: 0});
				current.stop().delay(current.index()*slideDelay).animate({opacity: 1},slideTime,slideEffect);
			});
			dotButton.removeClass(dotActiveClass);
			dotButton.eq(slideCounter).addClass(dotActiveClass);
		}
		//Loop
		function startLoop(){
			slideLoop = setTimeout(function() {
				nextButton.click();
			}, loopTime);
		}
		function stopLoop(){
			clearTimeout(slideLoop)
		}
		if (autoStartLoop == true) {			
			startLoop();
		}
	}
}