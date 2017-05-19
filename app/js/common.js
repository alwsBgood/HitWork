if (localStorage.name && localStorage.email && localStorage.phone)  {
  // запись сохраненных данных сразу в поля, если надо
  $('input[name="name"]').val(localStorage.name);
  $('input[type="email"]').val(localStorage.email);
  $('input[type="tel"]').val(localStorage.phone);
}

$(function() {
  $("[name=send]").click(function (e) {
   var btn = $(this);
   var form = $(this).closest('form');

   $(":input.error").removeClass('error');
   $(".allert").remove();

   var error;
   var ref = btn.closest('form').find('[required]');
   var loc = ymaps.geolocation.city+', '+ymaps.geolocation.region+', '+ymaps.geolocation.country;
   $('[name=city]').val(loc);
   var msg = btn.closest('form').find('input, textarea, select');
   var short_msg = btn.closest('form').find('[name=project_name], [name=admin_email], [name=form_subject], [name=city], [name=page_url], [name=user_agent], [type="text"], [type="email"], [type="tel"], [name=weight], [name=height]');
   var msg = btn.closest('form').find('input, textarea, select');
   var send_btn = btn.closest('form').find('[name=send]');
   var send_adress = btn.closest('form').find('[name=send_adress]').val();
   var send_options = btn.closest('form').find('[name=campaign_token]');;
   var formType = btn.closest('form').find('[name=form_type]').val();
   var redirect = btn.closest('form').find('[name=redirect]').val();
   var test_form = btn.closest('form').find('[name=test_form]').val();
   var alertImage = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 286.1 286.1"><path d="M143 0C64 0 0 64 0 143c0 79 64 143 143 143 79 0 143-64 143-143C286.1 64 222 0 143 0zM143 259.2c-64.2 0-116.2-52-116.2-116.2S78.8 26.8 143 26.8s116.2 52 116.2 116.2S207.2 259.2 143 259.2zM143 62.7c-10.2 0-18 5.3-18 14v79.2c0 8.6 7.8 14 18 14 10 0 18-5.6 18-14V76.7C161 68.3 153 62.7 143 62.7zM143 187.7c-9.8 0-17.9 8-17.9 17.9 0 9.8 8 17.8 17.9 17.8s17.8-8 17.8-17.8C160.9 195.7 152.9 187.7 143 187.7z" fill="#E2574C"/></svg>';


   var man_weight = Number($('[name=weight]').val());
   var man_height = Number($('[name=height]').val())/100;
   var man_health_number = man_weight/Math.pow(man_height,2);

   localStorage.name = form.find('input[name="name"]').val();
   localStorage.email = form.find('input[type="email"]').val();
   localStorage.phone = form.find('input[type="tel"]').val();


   $(ref).each(function() {
    if ($(this).val() == '') {
      var errorfield = $(this);
      $(this).addClass('error').parent('.field').append('<div class="allert"><span>Заполните это поле</span>' + alertImage + '</div>');
      error = 1;
      $(":input.error:first").focus();
      return;
    } else {
      var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
      if ($(this).attr("type") == 'email') {
        if (!pattern.test($(this).val())) {
          $("[name=email]").val('');
          $(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный e-mail</span>' + alertImage + '</div>');
          error = 1;
          $(":input.error:first").focus();
        }
      }
      var patterntel = /^()[- +()0-9]{9,18}/i;
      if ($(this).attr("type") == 'tel') {
        if (!patterntel.test($(this).val())) {
          $("[name=phone]").val('');
          $(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите номер телефона в формате +3809999999</span>' + alertImage + '</div>');
          error = 1;
          $(":input.error:first").focus();
        }
      }
    }
  });
   if (!(error == 1)) {
    $(send_btn).each(function() {
      $(this).attr('disabled', true);
    });
    // Отправка на почту
    $.ajax({
      type: 'POST',
      url: 'mail.php',
      data: short_msg,
      success: function() {
        setTimeout(function() {
          $("[name=send]").removeAttr("disabled");
        }, 1000);
        $('div.md-show').removeClass('md-show');
        $('form').trigger("reset");
        console.log(man_health_number);
        if(test_form == 1) {
          if(man_health_number <= 19) {
            window.location.href = '/test/index.html?man_health_number='+man_health_number;
          } else if(19 < man_health_number && man_health_number <= 24) {
            window.location.href = '/test/index_19-24.html?man_health_number='+man_health_number;
          } else if(25 < man_health_number && man_health_number <= 30) {
            window.location.href = '/test/index_25-30.html?man_health_number='+man_health_number;
          } else if(31 < man_health_number && man_health_number <= 40) {
            window.location.href = '/test/index_31-40.html?man_health_number='+man_health_number;
          } else {
            window.location.href = '/test/index_40.html?man_health_number='+man_health_number;
          }
        } else {
          window.location.href = '/success'
        }

        // dataLayer.push({
        //   'form_type': formType,
        //   'event': "form_submit"
        // });
          // Отправка в базу данных
        //   $.ajax({
        //    type: 'POST',
        //    url: 'db/registration.php',
        //    dataType: 'json',
        //    data: form.serialize(),
        //    success: function(response) {
        //      console.info(response);
        //      console.log(form.serialize());
        //      if (response.status == 'success') {
        //       $('form').trigger("reset");
        //       // window.location.href = '/success';
        //     }
        //   }
        // });
      },
      error: function(xhr, str) {
        console.log("Erorr")
      }
    });

  }
  return false;
})
});

 // Smooth scroll to anchor

 $('.scroll').click(function(){
  $('html, body').animate({
    scrollTop: $( $.attr(this, 'href') ).offset().top
  }, 1000);
  return false;
});


//  INPUT TEL MASK

jQuery(function($){
 $("input[type='tel']").mask("+38 (099) 999-9999");
});


// Scroll BAR

$(window).scroll(function() {
  // calculate the percentage the user has scrolled down the page
  var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());

  $('.bar-long').css('width', scrollPercent +"%"  );

});


//YOUTUBE

$(function() {
  $(".youtube").each(function() {
    $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

    $(this).append($('<div/>', {'class': 'play'}));

    $(document).delegate('#'+this.id, 'click', function() {
      var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
      if ($(this).data('params')) iframe_url+='&'+$(this).data('params');

      var iframe = $('<iframe/>', {'frameborder': '0', 'src': iframe_url, 'width': $(this).width(), 'height': $(this).height() })

      $(this).replaceWith(iframe);
    });
  });
});

//  UP BUTTON

$( document ).ready(function() {
  $('#scrollup img').mouseover( function(){
    $( this ).animate({opacity: 0.65},100);
  }).mouseout( function(){
    $( this ).animate({opacity: 1},100);
  });

  $(window).scroll(function(){
    if ( $(document).scrollTop() > 0 ) {
      $('#scrollup').fadeIn('slow');
    } else {
      $('#scrollup').fadeOut('slow');
    }
  });

  $('#scrollup').click(function() {
    $('body,html').animate({scrollTop:0},1000);
  });
});

// PREVENT SCROLLING

$('.md-trigger').click(function() {
  $("body").addClass('unscroll');
});

$('.md-close').click(function() {
  $("body").removeClass('unscroll');
});

$('.md-overlay').click(function() {
  $("body").removeClass('unscroll');
});


//Sliders

$('.slider_08_video').slick({
  slidesToShow: 1,
  dots: true,
  arrows: true,
  infinite: true,
  slidesToScroll: 1,
  fade: true,
  adaptiveHeight: true,
});

$('.slider_08_msg').slick({
  slidesToShow: 1,
  dots: true,
  arrows: true,
  infinite: true,
  slidesToScroll: 1,
  fade: true,
  adaptiveHeight: true,
});




// $('.slick-media').slick('unslick').slick('reinit');

jQuery(document).ready(function($) {

  function getSliderSettings(){
    return {
      slidesToShow: 1,
      dots: true,
      arrows: true,
      infinite: true,
      slidesToScroll: 1,
      fade: true,
      adaptiveHeight: true,
    }
  }

  $('.tabs_controll li a').click(function(event) {
    $('[class*="slider_08_"]').slick('slickGoTo', 0);
    $('[class*="slider_08_"]').slick('unslick');
    $('[class*="slider_08_"]').slick(getSliderSettings());
  });
});


//Tabs

setTimeout(function(){
  $('.tabs').tabslet({
    animation: true,
    active: 2
  })
})

// Accordion

$('.btn_open_more').click(function(event) {
  event.preventDefault();
  $(this).closest('.item').find('.closed').slideToggle();
  $(this).toggleClass('opened');

  if($(this).hasClass('opened')){
    $(this).children('.text_btn').html('Скрыть');
    $(this).children('.plus').html('-')
  } else {
    $(this).children('.text_btn').html('Смотреть все');
    $(this).children('.plus').html('+')
  }
});


// Menu

$(document).ready(function() {
    (function() {
      var i, resize;

      i = setInterval(function() {
        return $("#nav .wrapper").toggleClass("cross");
    }, 1500);

      $("#nav .wrapper").click(function() {
        clearInterval(i);
        if($('#nav').hasClass('open')){
            return $("#nav .wrapper").addClass("cross");
        } else {
            return $("#nav .wrapper").removeClass("cross");
        }
    });
      $('.callback').click(function(){
        clearInterval(i);
        $("#nav .wrapper").addClass("cross");
      });
  }).call(this);

    $('#menu').click(function(){
        $('#nav').toggleClass('open');
        $('body').toggleClass('unscroll');
        setTimeout(function() {
          $('#nav .inner').toggleClass('open');
        }, 600);
    });

    $('#nav li a').click(function(){
      $('#nav').removeClass('open');
      $('#nav .inner').removeClass('open');
      $('body').removeClass('unscroll');
      $("#nav .wrapper").removeClass("cross");
    })

    $('html').keydown(function(){
      if (event.keyCode == 27) {
        $('#nav').removeClass('open');
        $('#nav .inner').removeClass('open');
        $('body').removeClass('unscroll');
        $("#nav .wrapper").removeClass("cross");
      }
    });

});