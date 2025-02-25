(function ($) {
  'use strict';

  // Init Metronal
  var metronal = {};

  // Init Main Content
  metronal.mainContent = {
    list: ['#home', '#about', '#resume', '#portfolio', '#contact'],
    on: '',
    off: ''
  };

  // Pre Load
  metronal.preLoad = function (duration) {
    $('#pre-load').fadeOut(parseInt(duration, 10));
  };

  // Replace Viewport Height
  // Solves the issue about the viewport height on mobile devices as when the page loads
  metronal.replaceVHeight = function () {
    $('html').css({
      height: $(window).height()
    });
  };

  // Portfolio Filter
  metronal.portfolioFilter = {
    // Item container
    container: $('#portfolio .portfolio-item .item-wrapper'),
    // Init function
    init: function () {
      // Checking if all images are loaded
      metronal.portfolioFilter.container.imagesLoaded(function () {
        // Init isotope once all images are loaded
        metronal.portfolioFilter.container.isotope({
          itemSelector: '#portfolio .portfolio-item .item-wrapper .item',
          layoutMode: 'masonry',
          transitionDuration: '0.8s'
        });
        // Forcing a perfect masonry layout after initial load
        metronal.portfolioFilter.container.isotope('layout');
        // Filter items when the button is clicked
        $('#portfolio .portfolio-filter ul li').on('click', 'a', function () {
          // Remove the current class from the previous element
          $('#portfolio .portfolio-filter ul li .current').removeClass('current');
          // Add the current class to the button clicked
          $(this).addClass('current');
          // Data filter
          var selector = $(this).attr('data-filter');
          metronal.portfolioFilter.container.isotope({
            filter: selector
          });
          setTimeout(function () {
            metronal.portfolioFilter.container.isotope('layout');
          }, 6);
          return false;
        });
      });
    }
  };

  // Use Magnific Popup
  metronal.useMagnificPopup = function () {
    // For portfolio item
    $('#portfolio .portfolio-item .item-wrapper .item').magnificPopup({
      delegate: 'a',
      type: 'inline',
      removalDelay: 300,
      mainClass: 'mfp-fade',
      fixedContentPos: true,
      callbacks: {
        beforeOpen: function () {
          $('html').addClass('mfp-helper');
        },
        close: function () {
          $('html').removeClass('mfp-helper');
        }
      }
    });
  };

  // Set Skill Progress
  metronal.setSkillProgress = function () {
    // Select skill
    var skill = $('.single-skill');
    for (var i = 0; i < skill.length; i++) {
      if (skill.eq(i).find('.percentage')[0].textContent == '100%') {
        skill
          .eq(i)
          .find('.progress-wrapper .progress')
          .css({
            width: skill.eq(i).find('.percentage')[0].textContent,
            borderRight: 0
          });
      } else {
        skill.eq(i).find('.progress-wrapper .progress').css('width', skill.eq(i).find('.percentage')[0].textContent);
      }
    }
  };

  // Use TypeIt.js
  metronal.useTypeIt = function () {
    if (typeof TypeIt != 'undefined') {
      new TypeIt('.passion', {
        speed: 200,
        startDelay: 800,
        strings: ['Web Developer', 'Uploader', 'Own Hero'],
        breakLines: false,
        loop: true
      });
    } else {
      return false;
    }
  };

  // Progress Animation
  metronal.progressAnimation = function () {
    // Disable progress animation on IE Browser
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
      $('.progress-wrapper .progress').css({
        animation: 'none'
      });
    }
  };

  // Dynamic Page
  metronal.dynamicPage = function (event, target) {
    if (!event) {
      if (!target) {
        $('#home').addClass('active');
        metronal.mainContent.on = metronal.mainContent.off = '#home';
      } else {
        if (metronal.mainContent.list.includes(target)) {
          $(target).addClass('active');
          metronal.mainContent.on = metronal.mainContent.off = target;
        } else {
          $('#home').addClass('active');
          metronal.mainContent.on = metronal.mainContent.off = '#home';
        }
      }
    } else {
      var currentTarget = event.currentTarget;
      var prevMainContentOff = metronal.mainContent.off,
        targetOff = metronal.mainContent.on,
        targetOn;
      if (
        currentTarget.className === 'menu-link' ||
        currentTarget.className === 'close-menu-link' ||
        currentTarget.id === 'contact-button'
      ) {
        if (metronal.mainContent.list.includes(target)) {
          targetOn = target;
        } else {
          return;
        }
      } else {
        return;
      }

      if (targetOn !== targetOff) {
        $(prevMainContentOff).removeClass('scaleDownCenter');
        $(targetOff).removeClass('scaleUpCenter active');
        $(targetOff).addClass('scaleDownCenter');
        $(targetOn).addClass('scaleUpCenter active');

        metronal.mainContent.off = targetOff;
        metronal.mainContent.on = targetOn;
      }
    }
  };

  // Process Contact Form
  metronal.processContactForm = function () {
    var form = $('form[name="contact"]'),
      message = $('.contact-msg'),
      formData;

    // Success Function
    var doneFunc = function (response) {
      message.text(response);
      message.removeClass('alert-danger').addClass('alert-success').fadeIn();
      setTimeout(function () {
        message.fadeOut();
      }, 2400);
      form.find('input:not([type="submit"]), textarea').val('');
    };

    // Fail Function
    var failFunc = function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 400) {
        message.text(jqXHR.responseText);
      } else {
        message.text(jqXHR.statusText);
      }
      message.removeClass('alert-success').addClass('alert-danger').fadeIn();
      setTimeout(function () {
        message.fadeOut();
      }, 2400);
    };

    // Form On Submit
    form.on('submit', function (e) {
      e.preventDefault();
      formData = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: form.attr('action'),
        data: formData
      })
        .done(doneFunc)
        .fail(failFunc);
    });
  };

  // Window On Resize
  $(window).on('resize', function () {
    metronal.replaceVHeight(), metronal.portfolioFilter.container.isotope('layout');
  });

  // Device Orientation Changes
  window.addEventListener(
    'orientationchange',
    function () {
      metronal.replaceVHeight(), metronal.portfolioFilter.container.isotope('layout');
    },
    false
  );

  // Menu Link On Click
  $('.menu-link').on('click', function (e) {
    metronal.dynamicPage(e, $(this)[0].hash);
  });

  // Close Menu Link On Click
  $('.close-menu-link').on('click', function (e) {
    metronal.dynamicPage(e, $(this)[0].hash);
  });

  // Contact Button On Click
  $('#contact-button').on('click', function (e) {
    metronal.dynamicPage(e, $(this)[0].hash);
  });

  // Prevent Default 'a[href=""]' click
  $('a[href="#"]').on('click', function (e) {
    e.preventDefault();
  });

  // Window On Load
  $(window).on('load', function () {
    metronal.preLoad(800);
  });

  // Document Ready
  $(document).ready(function () {
    metronal.dynamicPage(undefined, window.location.hash),
      metronal.replaceVHeight(),
      metronal.portfolioFilter.init(),
      metronal.useMagnificPopup(),
      metronal.setSkillProgress(),
      metronal.progressAnimation(),
      metronal.useTypeIt(),
      metronal.processContactForm();
  });

  /* autor: doubleam
   introduction: doublelove-test-js
 */

  /* doublelove */
  /* console */
  console.log(
    '%c博客名称%cDoubleAm',
    'line-height:28px;padding:4px;background:#a1afc9;color:#000;font-size:16px;margin-right:15px',
    'color:#3fa9f5;line-height:28px;font-size:16px;'
  );
  console.log(
    '%c网站地址%chttps://a.biugle.cn',
    'line-height:28px;padding:4px;background:#a1afc9;color:#000;font-size:16px;margin-right:15px',
    'color:#00bc12;line-height:28px;font-size:16px;'
  );
  console.log(
    '%c扣扣号码%c1005760694',
    'line-height:28px;padding:4px;background:#a1afc9;color:#000;font-size:16px;margin-right:15px',
    'color:#ff9900;line-height:28px;font-size:16px;'
  );
  console.log(
    '%c欢迎使用来到我的Blog！',
    'line-height:28px;padding:5px;color:#fff;font-weight:bolder;font-size:16px;background-color:chocolate;color:#fff;'
  );
  if (window.console && window.console.log) {
    console.log(
      `%c页面加载消耗了 %c${(Math.round(100 * performance.now()) / 100 / 1e3).toFixed(2)}s`,
      'background: #fff;color: #333;text-shadow: 0 0 2px #eee, 0 0 3px #eee, 0 0 3px #eee, 0 0 2px #eee, 0 0 3px #eee;',
      'color:tomato;font-weight:bolder;'
    );
    localStorage.getItem('access') || localStorage.setItem('access', new Date().getTime());
    let e = new Date(parseInt(localStorage.getItem('access')));
    let o = `${e.getFullYear()}年${e.getMonth() + 1}月${e.getDate()}日`;
    let t = 0;
    localStorage.getItem('hit') ? (t = parseInt(localStorage.getItem('hit'))) : localStorage.setItem('hit', 0);
    localStorage.setItem('hit', ++t);
    console.log(
      `%c这是你自 %c${o} %c以来第 %c${t} %c次在本站打开控制台，你想知道什么秘密吗～`,
      '',
      'color:chocolate;font-weight:bolder;',
      '',
      'color:chocolate;font-weight:bolder;',
      ''
    );
  }
  /* darktheme */
  let brightness = 0; //显示遮罩
  let div;
  function cover(brightness) {
    if (typeof div === 'undefined') {
      div = document.createElement('div');
      div.setAttribute('style', 'position:fixed;top:0;left:0;outline:50000px solid;z-index:99999;');
      document.body.appendChild(div);
    } else {
      div.style.display = '';
    }
    div.style.outlineColor = 'rgba(0,0,0,' + brightness + ')';
  }
  window.addEventListener(
    'keydown',
    function (e) {
      //事件监听
      if (e.altKey && e.keyCode === 90) {
        //Alt+Z 关灯
        cover((brightness = 0.3));
      }
      if (e.altKey && e.keyCode === 88) {
        //Alt+X 开灯
        cover((brightness = 0));
      }
      if (e.altKey && e.keyCode === 38) {
        //Alt+↑ 亮度调高
        if (brightness - 0.05 > 0.05) {
          cover((brightness -= 0.05));
        }
      }
      if (e.altKey && e.keyCode === 40) {
        //Alt+↓ 亮度调低
        if (brightness + 0.05 < 0.95) {
          cover((brightness += 0.05));
        }
      }
    },
    false
  );
  let darkImg = document.querySelector('#dark-theme-img');
  if (darkImg !== null) {
    darkImg.setAttribute('title', '【Alt+↑/↓】调节亮度哦～');
    darkImg.addEventListener('click', function () {
      if (brightness === 0) {
        cover((brightness = 0.3));
      } else {
        cover((brightness = 0));
      }
    });
  }
  /* 状态栏判断 */
  let OriginTitle = document.title;
  let titleTime;
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      document.title = ' (╥﹏╥) 你快回来 ~ ';
      clearTimeout(titleTime);
    } else {
      document.title = ' (∩_∩) 欢迎回来 ~ ' + OriginTitle;
      titleTime = setTimeout(function () {
        document.title = OriginTitle;
      }, 1500);
    }
  });

  document.querySelector('#intro-translate').addEventListener('click', function () {
    let chinese = document.querySelector('#intro-chinese');
    let english = document.querySelector('#intro-english');
    if (chinese.style.display === '' || english.style.display === 'none') {
      chinese.style.display = 'none';
      english.style.display = 'inline';
    } else {
      english.style.display = 'none';
      chinese.style.display = 'inline';
    }
  });

  let emoji = [
    'laugh-wink',
    'grin-hearts',
    'kiss-wink-heart',
    'grin-tongue-squint',
    'grin-squint-tears',
    'laugh-squint',
    'grin-stars'
  ];
  document.querySelector('#random-skin').addEventListener('click', function () {
    let randNum = getRandnum(6);
    document.querySelector('#skin-css').setAttribute('href', './resume/css/skins/skin' + randNum + '.css');
    $('#random-skin').find('i').removeClass();
    $('#random-skin')
      .find('i')
      .addClass('fas')
      .addClass('fa-' + emoji[randNum]);
    $('#random-skin').find('i').addClass('fa-fw');
    $('.main-content#about .inner-content .content #personal-info .profile-picture').css(
      'background-image',
      'url(./resume/img/myphoto' + randNum + '.jpg)'
    );
    $('.lg-profile-picture').css('background-image', 'url(./resume/img/myphoto' + randNum + '.jpg)');
  });

  function getRandnum(range) {
    let num = Math.random() * range;
    num = parseInt(num);
    return num;
  }
})(jQuery);
