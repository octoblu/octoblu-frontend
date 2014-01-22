function apolloGallery() {
	//Set Variables
	if(typeof apolloGalleryId === 'undefined'){alert('Error: Apollo Gallery Id Missing!');}
	else {
		var galleryOverlayId = apolloGalleryOverlayId;
		var galleryDestinationId = apolloGalleryDestinationId;
		var galleryPreviousId = apolloGalleryPreviousId;
		var galleryNextId = apolloGalleryNextId;
		var galleryCloseId = apolloGalleryCloseId;
		var galleryMoreId = apolloGalleryMoreId;
		var galleryLoadingId = apolloGalleryLoadingId;
		/**/
		var galleryMenuId = apolloGalleryMenuId;
		/**/
		var galleryId = apolloGalleryId;
		var galleryItemsClasses = apolloGalleryItemsClasses;
		var galleryCoverClasses = apolloGalleryCoverClasses;
		var galleryDescriptionClasses = apolloGalleryDescriptionClasses;
		var galleryExpandClasses = apolloGalleryExpandClasses;
		var galleryDestinationTextClass = apolloGalleryDestinationTextClass;
		/**/
		var galleryOverlay = $('#'+galleryOverlayId);
		var galleryDestination = $('#'+galleryDestinationId);
		var galleryLoading = $('#'+galleryLoadingId);		
		var previousButton = $('#'+galleryPreviousId);
		var nextButton = $('#'+galleryNextId);
		var closeButton = $('#'+galleryCloseId);
		var moreButton = $('#'+galleryMoreId);
		/**/
		var galleryMenu = $('#'+galleryMenuId);
		/**/
		var gallery = $('#'+galleryId);
		var galleryItem  = gallery.find('.'+galleryItemsClasses);
		var galleryNumber = galleryItem.length;
		//Check Default
		if(typeof apolloGalleryTime === 'undefined'){apolloGalleryTime = 300;}
		if(typeof apolloGalleryEffect === 'undefined'){apolloGalleryEffect = 'swing';}
		if(typeof apolloGalleryKeyboard === 'undefined'){apolloGalleryKeyboard = true;}
		if(typeof apolloGalleryHover === 'undefined'){apolloGalleryHover = 'open';}
		
		var galleryTime = apolloGalleryTime;
		var galleryEffect = apolloGalleryEffect;
		var galleryKeyboard = apolloGalleryKeyboard;
		var galleryHover = apolloGalleryHover;
		//Utility Variables
		var galleryRange = 30;	
		var galleryCounter = 0;	
		var galleryMemory;
		//Start Preparation
		var loadingTop = ($(window).height()-galleryLoading.height())/2;
		var loadingLeft = ($(window).width()-galleryLoading.width())/2;
		galleryLoading.css({top: loadingTop, left: loadingLeft});
		if (galleryHover == 'open'){
			$('.'+galleryCoverClasses).css({left: 50+"%", top: 50+"%", opacity: 0, width: 0.1+"%", height: 0.1+"%"});
		}
		//Buttons
		galleryItem.click(function(e){
			//Standard Set
			e.preventDefault();		
			var currentItem = $(this);
			previousButton = $('#'+galleryPreviousId);
			nextButton = $('#'+galleryNextId);
			galleryCounter = currentItem.index();
			//Check Avaliable
			if (currentItem.css('opacity') == '0' || currentItem.css('display') == 'none') {
				if (galleryMemory == 'left') { previousButton.click(); }
				else if (galleryMemory == 'right') { nextButton.click(); }
			}
			else {
				//Get Content
				var imageItem = currentItem.find('.'+galleryExpandClasses).html();
				//Start Animation				
				galleryDestination.css({opacity: 0});
				galleryDestination.html(imageItem);
				galleryDestination.find('img').css({width: '', height: '', margin: 0});
				galleryOverlay.stop().fadeIn(galleryTime);
				galleryLoading.fadeIn('fast');		
				setTimeout(function(){
					var galleryTop = ($(window).height()-galleryDestination.height())/2;
					galleryDestination.css({marginTop: galleryTop});
					galleryLoading.stop().fadeOut('fast');
					galleryDestination.stop().animate({opacity: 1},galleryTime);
				},500);	
			}
		});
		previousButton.click(function(e){
			e.stopPropagation();
			galleryMemory = 'left';
			if(galleryCounter > 0) {galleryCounter--;}
			else {galleryCounter = galleryNumber-1;}
			galleryItem.eq(galleryCounter).click();
		});
		nextButton.click(function(e){
			e.stopPropagation();
			galleryMemory = 'right';
			if(galleryCounter < galleryNumber-1) {galleryCounter++;}
			else {galleryCounter = 0;}
			galleryItem.eq(galleryCounter).click();			
		});
		closeButton.click(function(e){
			e.stopPropagation();
			galleryOverlay.stop().fadeOut(galleryTime);
		});
		moreButton.click(function(e){
			e.stopPropagation();
			var current = galleryDestination.find('.'+galleryDestinationTextClass);
			if(current.css('display') == 'none') {
				current.fadeIn(galleryTime);
			}
			else {
				current.fadeOut(galleryTime);
			}
		});
		galleryOverlay.click(function(){
			galleryOverlay.stop().fadeOut(galleryTime);
		});
		$(document).keyup(function(e) {
			if( galleryOverlay.is(':visible') && galleryKeyboard == true) {
			  //if (e.keyCode == 13) { enter.click(); }     // enter
			  if (e.keyCode == 27) { galleryOverlay.click();}   // esc
			  if (e.keyCode == 37) { previousButton.click();}	//left
			  if (e.keyCode == 39) { nextButton.click();}	//right
			}
		});
		//Hover
		galleryItem.mouseenter(function(e) {
			if (galleryHover == 'open') {
				var current = $(this);
				var cover = current.find('.'+galleryCoverClasses);
				var description = current.find('.'+galleryDescriptionClasses);
				cover.stop().animate({left: 0+'%', top: 0+'%', opacity: 0.7, width: 100+'%', height: 100+'%'},galleryTime,galleryEffect);
				description.stop().delay(galleryTime).fadeIn(galleryTime);
			}
		});
		galleryItem.mouseleave(function(e) {
			if (galleryHover == 'open') {
				var current = $(this);
				var cover = current.find('.'+galleryCoverClasses);
				var description = current.find('.'+galleryDescriptionClasses);
				description.stop().fadeOut(galleryTime);
				cover.delay(galleryTime).animate({left: 50+"%", top :50+"%", opacity: 0, width: 0.1+"%", height: 0.1+"%"},galleryTime,galleryEffect);
			}
		});			
		//Resize	
		$(window).resize(function(){
			galleryResize();
		});		
		function galleryResize() {
			galleryItem.css({width: '', height: ''});
			galleryItem.each(function() {
				var content = $(this);
				var contentWidth = content.width();
				var contentHeight = contentWidth*0.75;
				content.css({height: contentHeight});	
				var current = content.find('img').eq(0);
				var currentHeight = current.height();
				var currentWidth = current.width();
				if (currentWidth >= currentHeight) {
					current.css({height: 100+'%'});
					currentWidth = current.width();
					current.css({marginLeft: ((contentWidth-currentWidth)/2)});
				}
				else if (currentHeight > currentWidth) {
					current.css({width: 100+'%'});
					currentHeight = current.height();
					current.css({marginTop: (contentHeight-currentHeight)/2});
				}			
			});
			galleryMenu.find('a').eq(0).click();
		}
		setTimeout(function(){
			galleryResize();
		},500);
		var galleryAjaxEffect = true;
		if(galleryAjaxEffect == true) {
			galleryItem.css({opacity: 0});			
			var end = gallery.offset().top;
			galleryItem.each(function() {
				var current = $(this);		
				$(window).scroll(function() {
					var start = $(window).scrollTop()+($(window).height()*0.8);
					if(start > end && galleryAjaxEffect == true) {
						//current.delay(current.index()*100).animate({opacity: 1},100);
						setTimeout(function(){
							current.css({opacity: 1});
						},current.index()*100);						
					}
				});
			});
		}
	}//ELSE
}