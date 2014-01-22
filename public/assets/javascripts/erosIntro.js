function erosIntro() {
	//Set Variables
	var intro_container = $('#'+introId);	
	//Check Default
	if(typeof introStart === 'undefined'){introStart = intro_container;}
	if(typeof introZoom === 'undefined'){introZoom = 10;}
	if(typeof introTime === 'undefined'){introTime = 800;}
	if(typeof introEffect === 'undefined'){introEffect = 'swing';}
	if(typeof introDelay === 'undefined'){introDelay = 1000;}
	/*var introStart = erosIntroStart;
	var introZoom = erosIntroZoom;
	var IntroTime = erosIntroTime;
	var introEffect = erosIntroEffect;
	var introDelay = erosIntroDelay*/
	//Utility Variables
	var minSize = 1200;
	var intro_svg;
	var intro_svg_outer;
	var intro_svg_inner;
	//Start Preparation
	intro_svg = intro_container.find('.svg');
	intro_svg_inner = intro_svg.find('.svg_inner');
	intro_svg_outer = intro_svg.find('.svg_outer');
		
	introStart.click(function(e){
		e.preventDefault();
		//openIntro();
	});
	function openIntro(){	
		var svgWidth = intro_svg.width();
	  	var svgHeight = intro_svg.height();
		intro_svg.stop().animate({
			width: svgWidth*introZoom,
			height: svgHeight*introZoom,
			marginLeft: -(((svgWidth*introZoom)-svgWidth)/2),
			marginTop: -(((svgHeight*introZoom)-svgHeight)/2)
		},introTime,introEffect);
		intro_container.fadeOut(introTime);
	}
	
	$(window).resize(function(){
		if (intro_container.css('display')!='none') {
			introResize();
		}
	});
	
	function introResize() {
	  	var windowWidth = $(window).width();
		if (windowWidth > minSize) {
			intro_container.css({
				width: windowWidth,
				marginLeft: 0
			});
		}
		else {
			intro_container.css({		
				width: minSize,
				marginLeft: ((windowWidth-minSize)/2)
			});
		}
		intro_svg.css({
			width: intro_container.width(),
			height: intro_container.height()
		});
	}
	$(window).load(function() {
		setTimeout(function(){
			$('#coverintro').fadeOut();
		},1000);	
		setTimeout(function(){
			$('.svg_inner path').each(function(){
			var current = $(this);
				setTimeout(function(){
					current.css({fill: 'transparent', strokeWidth: 1});
				},(current.index()*500));
			});
		},2000);
		introResize();
		setTimeout(function(){openIntro()},5500);
	});
}