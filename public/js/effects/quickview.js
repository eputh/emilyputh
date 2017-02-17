jQuery(document).ready(function($){
    //final width --> this is the quick view image slider width
    //maxQuickWidth --> this is the max-width of the quick-view panel
    var sliderFinalWidth = 400,
        maxQuickWidth = 900;

    //open the quick view panel
    $('.cd-trigger').on('click', function(event){
        var selectedImage = $(this).parent('.effect-bubba').children('img'),
            selectedImageUrl = selectedImage.attr('src');

        $('.featured').addClass('overlay-layer');
        animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');

        // update the cd-project-info
        updateProjectInfo(selectedImageUrl);

        //update the visible slider image in the quick view panel
        //you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
        updateQuickView(selectedImageUrl);
    });

    //close the quick view panel
    $('.featured').on('click', function(event){
        if( $(event.target).is('.cd-close') || $(event.target).is('.featured.overlay-layer')) {
            closeQuickView( sliderFinalWidth, maxQuickWidth);
        }
    });
    $(document).keyup(function(event){
        //check if user has pressed 'Esc'
        if(event.which=='27'){
            closeQuickView( sliderFinalWidth, maxQuickWidth);
        }
    });

    //quick view slider implementation
    $('.cd-quick-view').on('click', '.cd-slider-navigation a', function(){
        updateSlider($(this));
    });

    //center quick-view on window resize
    $(window).on('resize', function(){
        if($('.cd-quick-view').hasClass('is-visible')){
            window.requestAnimationFrame(resizeQuickView);
        }
    });

    function updateProjectInfo(url) {
        if (url=="images/ageless-link-long.png") {
            document.getElementById("project-title").innerText = "Ageless Link";
            document.getElementById("project-link").href = "https://ageless-link.firebaseapp.com";
            document.getElementById("project-link").innerText = "Visit the Website";
        } else if (url=="images/canvas-long.png") {
            document.getElementById("project-title").innerText = "Canvas Course Management System";
            document.getElementById("project-link").href = "http://sites.uci.edu/canvaspilot/";
            document.getElementById("project-link").innerText = "View the Case Study";
        } else if (url=="images/armagriddon-long.png") {
            document.getElementById("project-title").innerText = "Armagriddon Game Server";
            document.getElementById("project-link").href = "https://github.com/jlingad/INF122FinalAssignment";
            document.getElementById("project-link").innerText = "View on GitHub";
        } else if (url=="images/PSL-SRS-long.png") {
            document.getElementById("project-title").innerText = "Personal Sustainability Lifestyle App";
            document.getElementById("project-link").href = "projects/TEAM20-SRS-FINAL.pdf";
            document.getElementById("project-link").innerText = "View SRS";
        } else if (url=="images/personal-long.png") {
            document.getElementById("project-title").innerText = "First Personal Website";
            document.getElementById("project-link").href = "https://first-personal-website.firebaseapp.com/";
            document.getElementById("project-link").innerText = "Visit the Website";
            document.getElementById("project-description").innerHTML = "Check out the research and testing of this website " +
                "<a href='https://first-personal-website.firebaseapp.com/final-project.html' style='font-size: 18px;" +
                "text-transform: none; margin: 0 0;'> here.</a>";
        } else if (url=="images/scribble-long.png") {
            document.getElementById("project-title").innerText = "Scribble Meeting Scheduler";
            document.getElementById("project-link").href = "projects/INF151.zip";
            document.getElementById("project-link").innerText = "View Documents";
        } else if (url=="images/shopx-long.png") {
            document.getElementById("project-title").innerText = "ShopX Mobile";
            document.getElementById("project-link").href = "projects/ShopX-design-studio.pdf";
            document.getElementById("project-link").innerText = "View Research";
        }
    }
    
    function updateSlider(navigation) {
        var sliderContainer = navigation.parents('.cd-slider-wrapper').find('.cd-slider'),
            activeSlider = sliderContainer.children('.selected').removeClass('selected');
        if ( navigation.hasClass('cd-next') ) {
            ( !activeSlider.is(':last-child') ) ? activeSlider.next().addClass('selected') : sliderContainer.children('li').eq(0).addClass('selected');
        } else {
            ( !activeSlider.is(':first-child') ) ? activeSlider.prev().addClass('selected') : sliderContainer.children('li').last().addClass('selected');
        }
    }

    function updateQuickView(url) {
        $('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="'+ url +'"]').parent('li').addClass('selected');
    }

    function resizeQuickView() {
        var quickViewLeft = ($(window).width() - $('.cd-quick-view').width())/2,
            quickViewTop = ($(window).height() - $('.cd-quick-view').height())/2;
        $('.cd-quick-view').css({
            "top": quickViewTop,
            "left": quickViewLeft,
        });
    }

    function closeQuickView(finalWidth, maxQuickWidth) {
        var close = $('.cd-close'),
            activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').attr('src'),
            selectedImage = $('.empty-box').find('img');

        //update the image in the gallery
        if( !$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {
            selectedImage.attr('src', activeSliderUrl);
            animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
        } else {
            closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
        }
    }

    function animateQuickView(image, finalWidth, maxQuickWidth, animationType) {
        //store some image data (width, top position, ...)
        //store window data to calculate quick view panel position
        var parentListItem = image.parent('.effect-bubba'),
            topSelected = image.offset().top - $(window).scrollTop(),
            leftSelected = image.offset().left,
            widthSelected = image.width(),
            heightSelected = image.height(),
            windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            finalLeft = (windowWidth - finalWidth)/2,
            finalHeight = finalWidth * heightSelected/widthSelected,
            finalTop = (windowHeight - finalHeight)/2,
            quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth ,
            quickViewLeft = (windowWidth - quickViewWidth)/2;

        if( animationType == 'open') {
            //hide the image in the gallery
            parentListItem.addClass('empty-box');
            //place the quick view over the image gallery and give it the dimension of the gallery image
            $('.cd-quick-view').css({
                "top": topSelected,
                "left": leftSelected,
                "width": widthSelected,
            }).velocity({
                //animate the quick view: animate its width and center it in the viewport
                //during this animation, only the slider image is visible
                'top': finalTop+ 'px',
                'left': finalLeft+'px',
                'width': finalWidth+'px',
            }, 1000, [ 400, 20 ], function(){
                //animate the quick view: animate its width to the final value
                $('.cd-quick-view').addClass('animate-width').velocity({
                    'left': quickViewLeft+'px',
                    'width': quickViewWidth+'px',
                }, 300, 'ease' ,function(){
                    //show quick view content
                    $('.cd-quick-view').addClass('add-content');
                });
            }).addClass('is-visible');
        } else {
            //close the quick view reverting the animation
            $('.cd-quick-view').removeClass('add-content').velocity({
                'top': finalTop+ 'px',
                'left': finalLeft+'px',
                'width': finalWidth+'px',
            }, 300, 'ease', function(){
                $('.featured').removeClass('overlay-layer');
                $('.cd-quick-view').removeClass('animate-width').velocity({
                    "top": topSelected,
                    "left": leftSelected,
                    "width": widthSelected,
                }, 500, 'ease', function(){
                    $('.cd-quick-view').removeClass('is-visible');
                    parentListItem.removeClass('empty-box');
                });
            });
        }
    }
    function closeNoAnimation(image, finalWidth, maxQuickWidth) {
        var parentListItem = image.parent('.effect-bubba'),
            topSelected = image.offset().top - $(window).scrollTop(),
            leftSelected = image.offset().left,
            widthSelected = image.width();

        //close the quick view reverting the animation
        $('.featured').removeClass('overlay-layer');
        parentListItem.removeClass('empty-box');
        $('.cd-quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
            "top": topSelected,
            "left": leftSelected,
            "width": widthSelected,
        });
    }
});