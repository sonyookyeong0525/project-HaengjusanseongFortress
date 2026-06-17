$(document).ready(function() {
    const apiKey = "5f8b20dde06e54c2636fb8b0138a4a35";
    const city = "Goyang";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=37.597120&lon=126.828635&appid=5f8b20dde06e54c2636fb8b0138a4a35&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weatherCondition = data.weather[0].main;

            const weatherTranslations = {
                "Clear": "맑음",
                "Clouds": "구름 많음",
                "Rain": "비",
                "Drizzle": "이슬비",
                "Snow": "눈",
                "Thunderstorm": "천둥번개",
                "Mist": "안개",
                "Smoke": "연기",
                "Haze": "실안개",
                "Dust": "먼지",
                "Fog": "짙은 안개"
            };

            const koreanCondition = weatherTranslations[weatherCondition] || weatherCondition;
            const iconElement = document.getElementById('weather-icon');
            const tooltip = document.getElementById('tooltip-text');

            iconElement.src = `img/icon/${weatherCondition}.png`;
            $('#weather-icon-m').attr('src', `img/icon/${weatherCondition}.png`); // ★ 추가: 모바일 날씨 아이콘 동기화

            tooltip.innerText = koreanCondition;
            iconElement.onerror = () => {
                iconElement.src = 'img/icon/default.png';
                $('#weather-icon-m').attr('src', 'img/icon/default.png'); // ★ 추가
                tooltip.innerText = '정보 없음';
            };
        })
    .catch(error => console.error('오류 발생:', error));


    // 팝업창 초기화 
    function closeAll() {
        $(".search_wrap").css("opacity", "0");
        $(".lang_layer").hide();
    }

    $(document).on('click', closeAll);

    $(".lang_btn").on('click', function(e) {
        e.stopPropagation();
        
        let isLangVisible = $(this).siblings('.lang_layer').is(':visible');
        closeAll(); 
        if (!isLangVisible) {
            $(this).siblings('.lang_layer').show();
        }
    });

    $(".search_btn").on('click', function(e) {
        e.stopPropagation();
        
        let isSearchVisible = ($(".search_wrap").css("opacity") == "1");
        closeAll();
        if (!isSearchVisible) {
            $(".search_wrap").css("opacity", "1");
        }
    });

    $(".search_wrap").on('click', function(e) {
        e.stopPropagation();
    });

    $(".lang_layer").on('click', function(e) {
        e.stopPropagation();
    });

    // 탭 이벤트

    $(".tab_btn li").on("click", function(){

        const Tab = $(this).index();

        $(this)
            .addClass("on")
            .siblings()
            .removeClass("on");

        $(".story_card .card")
            .eq(Tab)
            .addClass("active")
            .siblings()
            .removeClass("active");
    });


    //슬라이드 섹션 선언

    const TOTAL_ITEMS = 12;
    const DESKTOP_MAX = 9;  // 3개 표시: 12-3=9
    const TABLET_MAX  = 10; // 2개 표시: 12-2=10
    const MOBILE_MAX  = 11; // 1개 표시: 12-1=11

    let a = 0,
        L_Btn = $(".slide_btn").find("li").eq(0),
        R_Btn = $(".slide_btn").find("li").eq(1),
        Slide = $(".slide").find("ul");

    function isMobile() { return $(window).width() <= 767; }
    function isTablet() { return $(window).width() <= 1024 && $(window).width() > 767; }

    function getMaxIndex() {
        if (isMobile()) return MOBILE_MAX;
        if (isTablet()) return TABLET_MAX;
        return DESKTOP_MAX;
    }

    function getSlideStep() {
        return $('.history_slide .slide ul li').first().outerWidth() + 20;
    }

    function updateCounter(index) {
        var maxIdx = getMaxIndex();
        $('.counter_current').text(String(index + 1).padStart(2, '0'));
        $('.counter_bar_fill').css('width', maxIdx > 0 ? (index / maxIdx) * 100 + '%' : '0%');
    }

    function moveSlide(index) {
        a = index;
        Slide.css("top", "0").animate({"left": -getSlideStep() * a + "px"}, 500, 'linear');
        updateCounter(a);
        L_Btn.css("pointer-events", a === 0 ? "none" : "auto");
        R_Btn.css("pointer-events", a === getMaxIndex() ? "none" : "auto");
    }

    updateCounter(0);

    R_Btn.click(function() { if (a < getMaxIndex()) moveSlide(a + 1); });
    L_Btn.click(function() { if (a > 0) moveSlide(a - 1); });


    // 태블릿(1024px 이하): 아이콘 클릭 → 우측 슬라이드 패널
    $('.icon_position').on('click', function() {
        if ($(window).width() > 1024) return;

        var $icon = $(this);
        var imgSrc = $icon.find('.pin_img img').attr('src') || '';
        var imgAlt = $icon.find('.pin_img img').attr('alt') || '';
        var title  = $icon.find('.pin_text span').text();
        var desc   = $icon.find('.pin_text p').html();

        $('.map_info_panel .panel_img img').attr({ src: imgSrc, alt: imgAlt });
        $('.panel_title').text(title);
        $('.panel_desc').html(desc);

        $('.icon_position').removeClass('panel_active');
        $icon.addClass('panel_active');

        $('.map_info_panel').addClass('panel_open');
    });

    // 패널 닫기
    $('.panel_close').on('click', function() {
        $('.map_info_panel').removeClass('panel_open');
        $('.icon_position').removeClass('panel_active');
    });


    // 모바일 드로어 (767px 이하)
    const IMG_HAMBURGER = 'img/icon/icon_hamburger.png'; // 햄버거 아이콘 경로
    const IMG_CLOSE     = 'img/icon/icon_close.png';     // 닫기 아이콘 경로 ← 이미지 넣으면 됨

    const $header  = $('header');
    const $btnImg  = $('.hamburger_btn img');

    $('.hamburger_btn').on('click', function () {
        if ($header.hasClass('drawer_open')) {
            $header.removeClass('drawer_open');
            $btnImg.attr('src', IMG_HAMBURGER);
            $('body').css('overflow', '');
        } else {
            $header.addClass('drawer_open');
            $btnImg.attr('src', IMG_CLOSE);
            $('body').css('overflow', 'hidden');
        }
    });

    // nav 링크 클릭 시 드로어 닫기
    $('nav a').on('click', function () {
        $header.removeClass('drawer_open');
        $btnImg.attr('src', IMG_HAMBURGER);
        $('body').css('overflow', '');
    });


});
