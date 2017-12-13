$(document).ready(function() {
	"use strict";


// ------------- Pre-loader--------------  

// makes sure the whole site is loaded

$(window).load(function() {
    // will first fade out the loading animation
    $(".preloader").fadeOut();
    //then background color will fade out slowly
    $("#faceoff").delay(200).fadeOut("slow");
});

//-------Appearence of navigation----------

  $('header .nav').onePageNav({
    scrollThreshold: 0.2, // Adjust if Navigation highlights too early or too late
    scrollOffset: 90 //Height of Navigation Bar
  });

 
  
 //  $(window).scroll(function() {
  
 //      var $scrollHeight = $(window).scrollTop();
 //      if ($scrollHeight > 600) {
 //        $('#home').slideDown(400);
 //      }else{
 //        $('#home').slideUp(400);
 //      }
    
	
	// //got o top
	//   if ($(this).scrollTop() > 200) {
	// 		$('#go-to-top a').fadeIn('slow');
	// 	  } else {
	// 		$('#go-to-top a').fadeOut('slow');
	//   }  
 //  });
  
  //-------scroll to top---------
  
 $('#go-to-top a').click(function(){
	$("html,body").animate({ scrollTop: 0 }, 750);
	return false;
  });
  


// ------------- Owl Carousel--------------

 $("#owl-demo").owlCarousel({
  navigation : false,
  slideSpeed : 300,
  pagination: true,
  autoPlay: 5000,
  items : 1,
  singleItem: true,
  });



// ----------initializing the wow.js ---------

    // Animate and WOW Animation
    var wow = new WOW(
        {
            //offset: 50,
            mobile: false
           // live: true
        }
    );
    wow.init();

  
});


var fullScreenHome = function() {
    if(matchMedia( "(min-width: 992px) and (min-height: 500px)" ).matches) {
      "use strict"; //RUN JS IN STRICT MODE
    var height = $(window).height();
      contH = $(".banner .col-sm-12").height(),
      contH = $(".banner-carousel .col-sm-12").height(),
      contMT = (height / 2) - (contH / 2);
    $(".banner-carousel").css('min-height', height + "px");
    $(".trans-bg").css('min-height', height + "px");
    $(".banner .col-sm-12").css('margin-top', (contMT - 270) + "px");
    $(".banner-carousel .col-sm-12").css('margin-top', (contMT - 10) + "px");
  }
}

$(document).ready(fullScreenHome);
$(window).resize(fullScreenHome);