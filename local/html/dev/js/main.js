function showpopap() {
    $('.block-popap').fadeIn(600);
    $('.block-popap .block-bg').click(function () {
        $('.block-popap').fadeOut(600);
    })
}

$(function () {
    $('input, select').styler({
        selectSearch: true
    });


    var speed = 3500;
    var homeSlider = $('.home-slider').lightSlider({
        loop: true,
        speed: speed,
        pause: speed * 1.5,
        item: 1,
        auto: true,
        slideMargin: 0,
        onBeforeStart: function ($el) {
            $('.home-slider-conteiner #loader').remove();
            $('.home-slider-conteiner').append('<div id="loader" class="run-animation"/>');
        },
        onAfterSlide: function ($el) {
            $('.home-slider-conteiner #loader').remove();
            $('.home-slider-conteiner').append('<div id="loader" class="run-animation"/>');
        }
    });

    var recommend = $('.recommend-slider').lightSlider({
        loop: false,
        item: 4,
        autoWidth: true,
        enableTouch: false,
        pager: false,
        slideMargin: 30,
    });

    $('.recommend-block .controls .prev').click(function () {
        recommend.goToPrevSlide();
    });
    $('.recommend-block .controls .next').click(function () {
        recommend.goToNextSlide();
    });

    var producttop = $('.producttop-slider').lightSlider({
        loop: false,
        item: 2,
        autoWidth: true,
        enableTouch: false,
        pager: true,
        slideMargin: 30,
    });

    $('.producttop-block .controls .prev').click(function () {
        producttop.goToPrevSlide();
    });
    $('.producttop-block .controls .next').click(function () {
        producttop.goToNextSlide();
    });

    var slider = $('.image-block-list .gallery').lightSlider({
        gallery: true,
        item: 1,
        vertical: true,
        verticalHeight: 550,
        vThumbWidth: 80,
        thumbItem: 6,
        thumbMargin: 5,
        slideMargin: 10,
        onSliderLoad: function (e) {
            var $this = $(e);
            $this.parents('.lSSlideOuter').append('<span class="scroll-top"><span/></span><span class="scroll-bottom"><span/></span>');

            var $prev = $this.parents('.lSSlideOuter').find('.scroll-top');
            var $next = $this.parents('.lSSlideOuter').find('.scroll-bottom');

            $next.click(function () {
                slider.goToNextSlide();
            });
            $prev.click(function () {
                slider.goToPrevSlide();
            });
        }
    });


    $('.rateit').bind('rated reset', function (e) {
        $(this).rateit('readonly', true);
    });

    $('.ui-favorites').click(function () {
        if (!$(this).is('.active')) {
            $(this).addClass('active').text('Избранное');
        }
    });

    $('.popap-show').hover(function () {
        clearTimeout($.data(this, 'timer'));
        $('.popap-block', this).stop(true, true).slideDown(300);
    }, function () {
        $.data(this, 'timer', setTimeout($.proxy(function () {
            $('.popap-block', this).stop(true, true).slideUp(300);
        }, this), 100));
    });

    mapsResize();

    $(window).resize(function () {
        mapsResize();
    })
});

function mapsResize() {
    var w = $(document).width();
    var width = $('.wrapper .container').width();
    $('#map-canvas').css({
        width: w,
        left: -(w - width) / 2,
    });
}

$(function () {

    var html5Slider = document.getElementById('range');
    if (html5Slider) {
        var startPrice = parseInt($('input#min-price').data('min'));
        var maxPrice = parseInt($('input#max-price').data('max'));

        noUiSlider.create(html5Slider, {
            start: [startPrice, maxPrice],
            connect: true,
            range: {
                'min': [0],
                'max': [maxPrice]
            }
        });

        $('.price-range .info-price .ui-delete').click(function () {
            html5Slider.noUiSlider.set([startPrice, maxPrice]);
        });

        html5Slider.noUiSlider.on('update', function (values, handle) {
            $('.price-range .info-price > .min-price > span').html(parseInt(values[0]));
            $('.price-range .info-price > .max-price > span').html(parseInt(values[1]));
            $('input#min-price').val(parseInt(values[0]));
            $('input#max-price').val(parseInt(values[1]));
        });
    }
});
