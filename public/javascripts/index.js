window.onload = function() {
  $('#signin_form').hide();
  $('#signup_form').hide();
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
    if($('.id_input').val() != 0 && $('.pw_input').val() != 0) {
      $('#login_button').fadeIn();

    } else{
      $('#login_button').fadeOut();
    }
  })
  $(".input2").on("change paste keyup",function(){
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
        location.href = ('/');
      } else{
        console.log("TEST");
      }
    };
    xhr.send(data);
  })
}
