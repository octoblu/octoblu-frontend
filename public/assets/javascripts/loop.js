jQuery( function($){

	/*----------------------/
	/* PAGE LOADER
	/*---------------------*/

	$('body').jpreLoader({
		showSplash: false,
		loaderVPos: "50%"
	});


	/*----------------------/
	/* MAIN NAVIGATION
	/*---------------------*/

	$(window).on('scroll', function(){
		if( $(window).width() > 1024 ) {
			if( $(document).scrollTop() > 150 ) {
				$('.navbar').addClass('navbar-light');

			}else {
				$('.navbar').removeClass('navbar-light');
			}
		}
	});

	function toggleNavbar() {
		if( ($(window).width() > 1024) && ($(document).scrollTop() <= 150) ) {
			$(".navbar").removeClass("navbar-light");
		} else {
			$(".navbar").addClass("navbar-light");
		}
	}

	toggleNavbar();

	$(window).resize( function() {
		toggleNavbar();
	});



	// hide collapsible menu
	$('.navbar-nav li a').click( function() {
		if($(this).parents('.navbar-collapse.collapse').hasClass('in')) {
			$('#main-nav2').collapse('hide');
		}
	});

	$('#main-nav2').localScroll({
		duration: 1000,
		easing: 'easeInOutExpo'
	});

	$('.hero-buttons').localScroll({
		duration: 1000,
		easing: 'easeInOutExpo'
	});

	/*----------------------/
	/* HERO UNIT SUPERSIZED
	/*---------------------*/

	if( $('.slideshow').length > 0 ) {
		$.supersized({

			// Functionality
			autoplay: 1,				// Slideshow starts playing automatically
			slide_interval: 3000,		// Length between transitions
			transition: 1, 				// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
			transition_speed: 1000,		// Speed of transition

			// Components
			slide_links: 'blank',		// Individual links for each slide (Options: false, 'num', 'name', 'blank')
			thumb_links: 0,				// Individual thumb links for each slide
			slides:  	[				// Slideshow Images
							{image : 'assets/images/sliders/slider1.png', title : '<div class="hero-text"><h2 class="hero-heading">HANDCRAFTED</h2><p>Built to provide great visitor experience</p></div>', thumb : '', url : ''},
							{image : 'assets/images/sliders/slider2.png', title : '<div class="hero-text"><h2 class="hero-heading">PARALLAX</h2><p>Scrolling the page is fun with parallax background</p></div>', thumb : '', url : ''},
							{image : 'assets/images/sliders/slider3.png', title : '<div class="hero-text"><h2 class="hero-heading">BUY ONE FOR TWO</h2><p>Buy one to get both of the agency and personal theme</p></div>', thumb : '', url : ''}
						],
		});

		$(".fa-pause, .fa-play").click( function(){
			$(this).toggleClass("fa-pause fa-play");
		});
	}


	/*-----------------------------/
	/* HERO UNIT FULLSCREEN VIDEO
	/*---------------------------*/
	if( $('.hero-video').length > 0 ) {
		var videoOptions = {
			// mp4: 'assets/videos/motion.mp4',
			// webm: 'assets/videos/motion.webm',
			// ogv: 'assets/videos/motion.ogv',
			mp4: 'assets/videos/skynetplayground.mp4',
			webm: 'assets/videos/skynetplayground.webm',
			ogv: 'assets/videos/skynetplayground.ogg',
			opacity: 1,
			zIndex: 0,
			fullscreen: true,
			muted: 'muted'
		}

		// iPhone seems provide video accesibility, so don't give poster to show the video
		if( $(window).width() > 480 ) {
			videoOptions.poster = 'assets/images/sliders/slider3.png';
		}

		$('.hero-unit').videoBG(videoOptions);

		// resize the wrapper as the video resized
		$(window).resize( function() {
			$('.videoBG_wrapper').width('100%');
			$('.videoBG_wrapper').height('100%');
		});

		// video volume control
		$('.fa-volume-up, .fa-volume-off').click( function() {
				$('.videoBG video').toggleVolume();
				$(this).toggleClass("fa-volume-up fa-volume-off");
			}
		);

		$.fn.toggleVolume = function() {
			var domVideo = $(this).get(0);

			if( domVideo.muted == true ) {
				domVideo.muted = false;
			}else {
				domVideo.muted = true;
			}
		}
	}

	/*----------------------/
	/* TESTIMONIAL
	/*---------------------*/

	$('.flexslider').flexslider({
		slideshowSpeed: 4000,
		directionNav: false,
		pauseOnAction: false
	});

	// .parallax(xPosition, speedFactor, outerHeight) options:
	// xPosition - Horizontal position of the element
	// inertia - speed to move relative to vertical scroll. Example: 0.1 is one tenth the speed of scrolling, 2 is twice the speed of scrolling
	// outerHeight (true/false) - Whether or not jQuery should use it's outerHeight option to determine when a section is in the viewport

	function setParallax() {
		if( $(window).width() > 1024 ) {
			if( $('#testimonial').hasClass('parallax') ) {
				$('#testimonial').parallax(0, 0.1);
			}
		}
	}

	setParallax();

	$(window).resize( function() {
		setParallax();
	});

	/*----------------------/
	/* TWITTER STREAM
	/*---------------------*/

	/*
	* ### HOW TO CREATE A VALID ID TO USE: ###
	* Go to www.twitter.com and sign in as normal, go to your settings page.
	* Go to "Widgets" on the left hand side.
	* Create a new widget for what you need eg "user timeline" or "search" etc.
	* Feel free to check "exclude replies" if you dont want replies in results.
	* Now go back to settings page, and then go back to widgets page, you should
	* see the widget you just created. Click edit.
	* Now look at the URL in your web browser, you will see a long number like this:
	* 345735908357048478
	* Use this as your ID below instead!
	*/
	/**
	* How to use fetch function:
	* @param {string} Your Twitter widget ID.
	* @param {string} The ID of the DOM element you want to write results to.
	* @param {int} Optional - the maximum number of tweets you want returned. Must
	*     be a number between 1 and 20.
	* @param {boolean} Optional - set true if you want urls and hashtags to be hyperlinked!
	* @param {boolean} Optional - Set false if you dont want user photo /
	*     name for tweet to show.
	* @param {boolean} Optional - Set false if you dont want time of tweet
	*     to show.
	* @param {function/string} Optional - A function you can specify to format
	*     tweet date/time however you like. This function takes a JavaScript date
	*     as a parameter and returns a String representation of that date.
	*     Alternatively you may specify the string 'default' to leave it with
	*     Twitter's default renderings.
	*/

	twitterFetcher.fetch( '474676149037965312', 'tweet', 1, true, false, true, 'default');


	/*----------------------/
	/* SCROLL TO TOP
	/*---------------------*/

	if( $(window).width() > 992 ) {
		$(window).scroll( function() {
			if( $(this).scrollTop() > 300 ) {
				$('.back-to-top').fadeIn();
			} else {
				$('.back-to-top').fadeOut();
			}
		});

		$('.back-to-top').click( function(e) {
			e.preventDefault();

			$('body, html').animate({
				scrollTop: 0,
			}, 800, 'easeInOutExpo');
		});
	}


	/*----------------------/
	/* WORKS
	/*---------------------*/

	var $container = $('.work-item-list');

	new imagesLoaded( $container, function() {
		$container.isotope({
			itemSelector: '.work-item'
		});
	});

	$(window).smartresize( function() {
		$container.isotope('reLayout');
	});

	$('.work-item-filters a').click( function(e) {

		var selector = $(this).attr('data-filter');
		$container.isotope({
			filter: selector
		});

		$('.work-item-filters a').removeClass('active');
		$(this).addClass('active');

		return false;
	});

	var originalTitle, currentItem;

	$('.media-popup').magnificPopup({
		type: 'image',
		callbacks: {
			beforeOpen: function() {

				// modify item title to include description
				currentItem = $(this.items)[this.index];
				originalTitle = currentItem.title;
				currentItem.title = '<h3>' + originalTitle + '</h3>' + '<p>' + $(currentItem).parents('.work-item').find('img').attr('alt') + '</p>';

				// adding animation
				this.st.mainClass = 'mfp-fade';
			},
			close: function() {
				currentItem.title = originalTitle;
			},
		}

	});


	/*----------------------/
	/* CALL TO ACTION
	/*---------------------*/

	if( $(window).width() > 1024 ) {
		wow = new WOW({
			animateClass: 'animated'
		});

		wow.init();
	} else {
		$('.wow').attr('class', '');
	}

	/*----------------------/
	/* TOOLTIP
	/*---------------------*/

	if( $(window).width() > 1024 ) {
		$('body').tooltip({
			selector: "[data-toggle=tooltip]",
			container: "body"
		});
	}

	// init scrollspy except on Opera, it doesn't work because body has 100% height
	if ( !navigator.userAgent.match("Opera/") ) {
		$('body').scrollspy({
			target: '#main-nav2'
		});
	}else {
		$('#main-nav2 .nav li').removeClass('active');
	}


});
