  window.onload = function() {
  $('#signin_form').hide();
  $('#signup_form').hide();
  $('.error_message').hide();
  $('#signin').click(function(e) {
    e.preventDefault();
    $('#button_set').fadeOut('300', function(){
      $('#signin_form').fadeIn();
      $('#login_button').hide();
    });
  });
  $('#signup').click(function(e) {
    e.preventDefault();
    $('#button_set').fadeOut('300', function() {
      $('#signup_form').fadeIn();
      $('#signup_button').hide();
    });
  });
  $("#login_back_button").click(function(e) {
    e.preventDefault();
    $('#signin_form').fadeOut('300', function(){
      $('.input1').val('');
      $('#button_set').fadeIn('300');
    });
  });
  $("#signup_back_button").click(function(e){
    e.preventDefault();
    $('#signup_form').fadeOut('300', function() {
      $('.input2').val('');
      $('#button_set').fadeIn('300');
    })
  })
  $(".input1").on("change paste keyup",function(){
    $('.error_message').hide();
    if($('.id_input').val() != 0 && $('.pw_input').val() != 0) {
      $('#login_button').fadeIn();

    } else{
      $('#login_button').fadeOut();
    }
  })
  $(".input2").on("change paste keyup",function(){
    $('.error_message').hide();
    if($('#input1').val() && $('#input2').val() && $('#input3').val() && $('#input4').val()) {
      $('#signup_button').fadeIn();
    } else{
      $('#signup_button').fadeOut();
    }
  })
  $("#input6").on("keydown", function(e) {
    if(e.keyCode === 13)
        $("#login_button").click()
  });

  $("#login_button").on("click", function() {
    var dataJSON = {"id": $("#input5").val(), "password": $("#input6").val()}
    var data = JSON.stringify(dataJSON);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/users/signin', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function(){
      var jr = JSON.parse(this.responseText);
      if(jr.success){
        $('html').fadeOut('slow', function(){
          location.href = ('/');
        });
      } else{
        $('.input1').effect("shake");
        $('.error_message').show();
        $('.input1').val('')
      }
    };
    xhr.send(data);
  })


  $("#input4").on("keydown", function(e) {
    if(e.keyCode === 13)
        $("#signup_button").click()
  });


  $('#signup_button').on('click', function() {
    if($('#input1').val().length<4 || $('#input1').val().length > 20){
      $('#signup_error').show();
      $('#signup_error').text('아이디는 4자 이상 20자 이하여야 합니다.')
      $('#input3').val('')
      $('#input4').val('')
    } else if($('#input3').val().length<8 || $('#input4').val().length > 20) {
      $('#signup_error').show();
      $('#signup_error').text('비밀번호는 8자 이상 20자 이하여야 합니다.')
      $('#input3').val('')
      $('#input4').val('')
    } else if($('#input3').val() !== $('#input4').val()) {
      $('#signup_error').show();
      $('#signup_error').text('비밀번호가 서로 다릅니다.')
      $('#input3').val('')
      $('#input4').val('')
    } else{
      var dataJSON = {"id": $("#input1").val(), "nickname": $("#input2").val(), "password": $("#input3").val()}
      var data = JSON.stringify(dataJSON);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/users/signup', true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function(){
        var jr = JSON.parse(this.responseText);

        if(jr.success){
          $('.input2').val('')
          $('#signup_form').fadeOut('300',function(){
            $('#button_set').fadeIn('300', function(){
              swal('성공적으로 등록을 완료하였습니다.');
            });
          });

        } else{
          $('.input2').effect("shake");
          $('.error_message').show();
          $('#signup_error').text('이미 누군가 동일한 아이디를 사용중입니다.')
          $('.input2').val('')
        }
      };
      xhr.send(data);
    }
  })
}
