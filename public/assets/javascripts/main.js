$(document).ready(function () {
	/*INTRO*/
	erosIntro(
		introId = 'mainintro'
	);
	/*SLIDE*/
	athenaSlide(
		athenaSlideId = 'slidecontent',
		athenaPreviousButtonId = 'slide-previous',
		athenaNextButtonId = 'slide-next',
		athenaDotButtonClass = 'slide-dot',
		athenaDotActiveClass = 'slide-active',
		athenaPlayButtonId = 'slide-play',
		athenaStopButtonId = 'slide-stop',
		/**MORE OPTIONS**/
		athenaSlideMode = 'sliding',
		athenaSlideTime = 500,
		athenaSlideDelay = 500,
		athenaSlideEffect = 'swing',
		athenaAutoStartLoop = true,
		athenaLoopTime = 5000
	);
	demeterScroll(
		demeterScrollAnimateMinWidth = 1024,
		demeterScrollAnimateTime = 500,
		demeterScrollAnimateEffect = 'swing'
	)
	$(window).load(function () {
		/*GALLERY*/
		apolloGallery(
			/*gallery-opened*/
			apolloGalleryOverlayId = 'gallery-overlay',
			apolloGalleryDestinationId = 'gallery-destination',
			apolloGalleryPreviousId = 'gallery-previous',
			apolloGalleryNextId = 'gallery-next',
			apolloGalleryCloseId = 'gallery-close',
			apolloGalleryMoreId = 'gallery-more',
			apolloGalleryLoadingId = 'gallery-loading',
			/*gallery-menu*/
			apolloGalleryMenuId = 'isotope_filters',
			/*gallery-closed*/
			apolloGalleryId = 'isotope_container',
			apolloGalleryItemsClasses = 'gallery-item',
			apolloGalleryCoverClasses = 'gallery-cover',
			apolloGalleryDescriptionClasses = 'gallery-description',
			apolloGalleryExpandClasses = 'gallery-expand',
			apolloGalleryDestinationTextClass = 'gallery-text'
		);
		/*MAIN MENU*/
		hermesMenu(
			hermesMenuId = 'mainmenu',
			hermesBarId = 'mainmenubar',
			hermesSynchroScroll = true,
			hermesExceptionClass = 'nobar'
		);
		/*ACCORDION MENU*/
		hermesMenu(
			hermesMenuId = 'navtabs_menu',
			hermesBarId = 'navtabs_menubar',
			hermesSynchroScroll = false,
			hermesLinkColor = 'white'
		);
		/*GALLERY MENU*/
		hermesMenu(
			hermesMenuId = 'isotope_filters',
			hermesBarId = 'isotope_filtersbar',
			hermesSynchroScroll = false,
			hermesLinkColor = 'white'
		);
		/*ISOTOPE*/
		if ($('#isotope_container').length){
			var $container = $('#isotope_container');
			$container.isotope({
				 duration: 750,
				 easing: 'linear',
				 queue: false,
				 layoutMode : 'masonry'
			});
		}
		$('#isotope_filters a').click(function(){
			//DYNAMIC MENU LABEL
			var selector = $(this).attr('data-filter');
			$container.isotope({ filter: selector });
			return false;
		});
		/*CLASS TICKET*/
		var t_current = $('.ticket');
		var t_number = t_current.length;
		var t_counter = 0;
		$('.ticket-button').click(function(){
			current = $(this);
			if (current.hasClass('ticket-right')) {
				t_current.eq(t_counter).stop().fadeOut(300);
				if (t_counter < t_number-1) {
					t_counter++;
				}
				else {
					t_counter = 0;
				}
				t_current.eq(t_counter).stop().delay(300).fadeIn(300);
			}
			else {
				t_current.eq(t_counter).stop().fadeOut(300);
				if (t_counter < t_number-1) {
					t_counter--;
				}
				else {
					t_counter = t_number-1;
				}
				t_current.eq(t_counter).stop().delay(300).fadeIn(300);
			}

		});
		$(window).resize(function() {
			if($(window).width() > 992) {
			t_current.css({display: ''});
			}
			else {
			t_current.css({display: ''});
			t_current.eq(0).show();
			}
			t_counter = 0;
		});
		/*SKILLS*/
		$('#skills').find('.progress-bar').css({width: 0});
		var s_windowHeight = $(window).height()*0.5;
		var s_target = $('#skills').offset().top;
		$(window).scroll(function(){
			var s_scrollHeight = $(window).scrollTop()+s_windowHeight;
			if (s_scrollHeight > s_target) {
				$('#skills').find('.progress-bar').each(function() {
					var current = $(this);
					var s_final = current.data('final');
					current.css({width: s_final+'%'});
				});
			}
		});
		/*CONTACUS*/
		/*
		var c_windowHeight = $(window).height()0.5;
		var c_target = $('#contactus').offset().top;
		$(window).scroll(function(){
			var c_scrollHeight = $(window).scrollTop()+c_windowHeight;
			if (c_scrollHeight > c_target) {
				$('#contactus').slideDown(500);
			}
		});
		*/
/*********************/
	});//END LOAD
});//END READY
