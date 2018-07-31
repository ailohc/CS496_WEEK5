var socket = io.connect('https://sambong.koreacentral.cloudapp.azure.com:443');
var room_id = "";
var user_name = "";
var user_id = "";
var board = "";

function printClock() {
  var seoul = moment().tz("Asia/Seoul");
  var day = seoul.day();
  if(day == 0) day = "일"
  if(day == 1) day = "월"
  if(day == 2) day = "화"
  if(day == 3) day = "수"
  if(day == 4) day = "목"
  if(day == 5) day = "금"
  if(day == 6) day = "토"
  var hour = seoul.hours();
  var min = seoul.minutes();

  if(min<10) min = "0" + min;
  var ampm = (hour<12) ? "오전" : "오후";
  hour = hour % 12;                       // 현재시간
  var calendar = "("+ day + ")" + " " + ampm + " " + hour + ":" + min; // 현재 날짜

  $("#time").text(calendar);
  setTimeout("printClock()",1000);         // 1초마다 printClock() 함수 호출
}

window.onload = function() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", './getInfo', true);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr.response;
      result_obj = JSON.parse(resultJSON);
      user_name = result_obj.user;
      user_id = result_obj.id;
      console.log(user_name);
    }
  }

  $('#terminal_div').hide();
  $('#terminal_chat_div').hide();
  $('#freeBoard_div').hide();
  $('#freeBoard_add_div').hide();
  $('#freeBoard_detail_div').hide();
  $('#xiri_div').hide();
  // printClock();
  $('.window').draggable();
  $(".dropdown").hide();

  $( "form" ).submit(function( event ) {
    event.preventDefault();
  });
  var z_index_increment = 10;
  $('.window').on("click", function(e){
    e.preventDefault();
    $(this).css('z-index', z_index_increment++);
  })

$("#dropdown").click(function(e){
  if($(".dropdown").is(':visible')){
    $(".dropdown").fadeOut('fast');
  } else{
    $(".dropdown").show();
  }
});
  $("#terminal_").on("click", function(e) {
    e.preventDefault();
    var $img = $('#terminal_');
    $img.animate({
      top : '-=30'
    }, {
      duration: 200,
      complete : function() {
        $img.animate({
          top : "+=30"
        })
      }
    })
  })

  $('.bottom_icon').on('mouseenter', function(e){
    e.preventDefault();
    $(this).animate({
      top : '-=10'
    }, {duration: 100})
  })
  .on("mouseleave", function(e){
    e.preventDefault();
    $(this).animate({
      top : '+=10'
    }, {duration: 100})
  })

  $('.close_btn').on("click", function(){
    $('#project').hide();
  })

  var i = 0;
  $('.full_btn').on("click", function(){
    if(i===0){
      $('#project').width("100%")
      $('#project').height("100%")
      $('#project').css({top: 0, left: 0, position:'absolute'});
      $('.container').width("100%");
      $('.container').height("100%");
      $('#project').css('z-index', 100);
      i=1;
    }
    else if(i===1){
      // $('#project').height("800px")
      $('#project').css({top: 50, left: 370, position:'absolute',overflow: 'hidden'});
      $('#project').css('z-index', 0);
      i=0;
    }
  })
// -------------------------------------------------------------------------------


$('#terminal_btn').on("click", function(e){
  e.preventDefault();
  $('#terminal_div').show(function(){
    $('#TerminalQuery').focus();
  });
})


$('#xiri_btn').on("click", function(e){
  e.preventDefault();
  $('#xiri_div').show();
})

$('#terminal_div .close_btn').on("click", function(e){
  e.preventDefault();
  $('#terminal_div').hide();
})

$('#terminal_chat_div .close_btn').on("click", function(e) {
  e.preventDefault();
  $('#terminal_chat_div').hide();
})

$('#freeBoard_btn').on("dblclick", function(e){
  e.preventDefault();
  $('#freeBoard_div').show(function(){
    board = 1;
    var first_tb = document.getElementById("table1");
    first_tb.innerHTML = "";
    var dataJSON = {"board_id": 1}
    var data = JSON.stringify(dataJSON);
    var xmlHttp1 = new XMLHttpRequest();
    xmlHttp1.open("POST", "/board/", true);
    xmlHttp1.setRequestHeader("Content-Type", "application/json");
    xmlHttp1.send(data);
    xmlHttp1.onreadystatechange = function() {
      console.log("success1");
      if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
        var result = JSON.parse(xmlHttp1.responseText);
        for (var i in result) {
          var elem_id = result[i].id;
          var title = result[i].title;
          var writer = result[i].nickname;
          var string_data = result[i].created_at.split("T");
          var date = string_data[0];
          var tag = result[i].tag_text;
          var obj = document.getElementById("table1");
          var divAppend = document.createElement("tr");
          divAppend.innerHTML = "<td id="+elem_id+" onclick='detail1("+elem_id+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
          obj.appendChild(divAppend);
        }
      }
    }
  });
});

$('#freeBoard_add_btn').on("click", function(e){
  e.preventDefault();
  $('#freeBoard_add_div').show();
})

$('#freeBoard_add_div .close_btn').on("click", function(e) {
  e.preventDefault();
  $('#freeBoard_add_div').hide();
})

$('#freeBoard_div .close_btn').on("click", function(e){
  e.preventDefault();
  $('#freeBoard_div').hide();
})

$('#freeBoard_detail_div .close_btn').on("click", function(e) {
  e.preventDefault();
  $('#freeBoard_detail_div').hide();
})

$('#xiri_div .close_btn').on("click", function(e){
  e.preventDefault();
  $('#xiri_div').hide();
})
//---------------------------------------------------------------------------------------------

$('#search_input1').on("keydown", function(e){
  if(e.keyCode === 13){
    var dataJSON = {"board_id": 1, "keyword": $("#search_input1").val()}
    var data = JSON.stringify(dataJSON);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "/board/search", true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(data);
    xmlHttp.onreadystatechange = function() {
      console.log("success");
      if (xmlHttp.readyState == XMLHttpRequest.DONE) {
        var result = JSON.parse(xmlHttp.responseText);
        console.log(result.length);
        if(result.length != undefined){
          var obj = document.getElementById("table1");
          obj.innerHTML = "";
          for (var i in result) {
            var elem_id = result[i].id;
            var title = result[i].title;
            var writer = result[i].nickname;
            var string_data = result[i].created_at.split("T");
            var date = string_data[0];
            var tag = result[i].tag_text;
            var divAppend = document.createElement("tr");
            divAppend.innerHTML = "<td onclick='detail1("+elem_id+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
            obj.appendChild(divAppend);
          }
        }
      }
    }
  }
})

//-------------------------------------xiri

$(function() {
  if (typeof webkitSpeechRecognition != 'function') {
    alert('Only Works in Chrome Browser');
    return false;
  }

  var recognition = new webkitSpeechRecognition();
  var isRecognizing = false;
  var ignoreOnend = false;
  var finalTranscript = '';
  var $btnMic = $('#btn-mic');
 	var $result = $('#result');
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    isRecognizing = true;
    $btnMic.attr('class', 'on');
    response.innerHTML = '';
    console.log("시작");
  };

  recognition.onend = function() {
    isRecognizing = false;
    if (ignoreOnend) {
      return false;
    }

    // DO end process
    $btnMic.attr('class', 'off');
    if (!finalTranscript) {
      return false;
    }

    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final-span'));
      window.getSelection().addRange(range);
    }

  };

  recognition.onresult = function(event) {
    var interimTranscript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      return;
    }

    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    finalTranscript = capitalize(finalTranscript);
    final_span.innerHTML = linebreak(finalTranscript);
    interim_span.innerHTML = linebreak(interimTranscript);
    fireCommand(finalTranscript);
  };

  function textToSpeech(text) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  function fireCommand(string) {
    if (string.endsWith('알람') || string.endsWith('알 람')) {
  		alert('알람');
  	}
    else if (string.endsWith('안녕') || string.endsWith('안 녕')) {
      response.innerHTML = "안녕하세요";
      textToSpeech($('#response').text());
    }
    else if (string.endsWith('누구야') || string.endsWith('넌 누구야') || string.endsWith('넌 누 구 야')) {
      response.innerHTML = "안녕하세요 저는 Xiri에요";
  	  textToSpeech('안녕하세요 저는 Xiri에요');
    }
    else if (string.endsWith('터미널') || string.endsWith('터미널 켜줘') || string.endsWith('터 미 널 켜 줘')) {
      $('#xiri').modal('hide');
      $('#myTerminal').modal('show');
    }
    else if (string.endsWith('꺼져') || string.endsWith('꺼 져')) {
      $('#xiri').modal('hide');
  	}
  }

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      ignoreOnend = true;
    } else if (event.error == 'not-allowed') {
      ignoreOnend = true;
    }

    $btnMic.attr('class', 'off');
  };

  var two_line = /\n\n/g;
  var one_line = /\n/g;
  var first_char = /\S/;

  function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }

  function capitalize(s) {
    return s.replace(first_char, function(m) {
      return m.toUpperCase();
    });
  }

  function start(event) {
    if (isRecognizing) {
      recognition.stop();
      return;
    }
    recognition.lang = 'ko-KR';
    recognition.start();
    ignoreOnend = false;

    finalTranscript = '';
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
  }

  function requestServer() {
    $.ajax({
      method: 'post',
      url: 'https://www.google.com/speech-api/v2/recognize?output=json&lang=en-us&key=AIzaSyDiMqfg8frtoZflA_2LPqfGdpjmgTMgWhg',
      data: '/examples/speech-recognition/hello.wav',
      contentType: 'audio/l16; rate=16000;', // 'audio/x-flac; rate=44100;',
      success: function(data) {
      },
      error: function(xhr) {
      }
    });
  }
  $btnMic.click(start);
});


//-----------------end of the onload


}

function query_submit() {
  let query = document.getElementById("TerminalQuery").value;
  let node = document.createElement("li");
  let textnode = document.createTextNode("apple-ui-MacBook-Pro:~ "+user_name+"$"+query);
  node.appendChild(textnode);
  document.getElementById("TerminalList").appendChild(node);
  document.getElementById("TerminalQuery").value = "";
  let split_query = query.split(" ");
  if (split_query[0] === "ls") {
    let foldernode = document.createElement("li");
    let foldertextnode = document.createTextNode("apple-ui-MacBook-Pro:~ "+user_name+"$freshman sophomore junior senior all");
    foldernode.appendChild(foldertextnode);
    document.getElementById("TerminalList").appendChild(foldernode);
  }
  if (split_query[0] === "vim") {
      console.log(split_query[1]);
      room_id = split_query[1];
      console.log(room_id);
      socket.emit('join:room', {roomId: room_id});
      $('#terminal_div').hide();
      $('#terminal_chat_div').show(function(){
        console.log("get chag");
        socket.on('send:message', function (data) {
        let chat_message = document.createElement("li");
        let chat_message_text = document.createTextNode("apple-ui-MacBook-Pro:"+room_id+" "+"cs496"+"$"+data);
        chat_message.appendChild(chat_message_text);
        document.getElementById("ChatList").appendChild(chat_message);
        });
        $('#ChatQuery').focus();
      });;
  }
  if (split_query[0] === "cd") {
    console.log(split_query[1]);
    folder_id = split_query[1];
    if (folder_id === 'free') {
      $('#terminal_div').hide();
      $('#freeBoard_div').show(function(){
        board = 1;
        var first_tb = document.getElementById("table1");
        first_tb.innerHTML = "";
        var dataJSON = {"board_id": 1}
        var data = JSON.stringify(dataJSON);
        var xmlHttp1 = new XMLHttpRequest();
        xmlHttp1.open("POST", "/board/", true);
        xmlHttp1.setRequestHeader("Content-Type", "application/json");
        xmlHttp1.send(data);
        xmlHttp1.onreadystatechange = function() {
          console.log("success1");
          if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
            var result = JSON.parse(xmlHttp1.responseText);
            for (var i in result) {
              var elem_id = result[i].id;
              var title = result[i].title;
              var writer = result[i].nickname;
              var string_data = result[i].created_at.split("T");
              var date = string_data[0];
              var tag = result[i].tag_text;
              var obj = document.getElementById("table1");
              var divAppend = document.createElement("tr");
              divAppend.innerHTML = "<td id="+elem_id+" onclick='detail1("+elem_id+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
              obj.appendChild(divAppend);
            }
          }
        }
      });
    }
    else if (folder_id === 'anonymous') {
      $('#terminal_div').hide();
     // $('#terminal_chat_div').show();
    }
  }
}

function chat_submit() {
  let chat_query = document.getElementById("ChatQuery").value;
  console.log(document.getElementById("ChatQuery").value);
  if (chat_query === ':wq') {
    $('#terminal_chat_div').hide();
    $('#terminal_div').show(function(){
      $('#TerminalQuery').focus();
    });
  }
  socket.emit('send:message', {roomId: room_id, message: chat_query});
  document.getElementById("ChatQuery").value = "";
}

function add_free() {
  $('#freeBoard_div').hide();
  $('#freeBoard_add_div').show();
}


function send_free_add () {
  console.log(document.freetags.free_tags.value);
  var dataJSON = {"user_id" : user_id, "board_id" : board, "title" : document.name_form.free_name.value, "contents_text" : document.contents_form.free_contents.value, "tags" : document.freetags.free_tags.value};
  var data = JSON.stringify(dataJSON);
  console.log(dataJSON);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/board/contents", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
  $('#freeBoard_add_div').hide();
  document.name_form.free_name.value = "";
  document.contents_form.free_contents.value = "";
  document.freetags.free_tags.value ="";
  //$("#freeTags").tagit("tags").remove();
  $('#freeBoard_div').show();
  //xhr.onreadystatechange = function() {
    //if (xhr.readyState == XMLHttpRequest.DONE) {
      //var result = JSON.parse(xhr.responseText);

    //}
  //}
}


function detail1(elem_id) {
  $('#freeBoard_div').hide();
  $('#freeBoard_detail_div').show();
  console.log(elem_id);
  var dataJSON = {"board_id" : board, "contents_id" : elem_id};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", "/board/detail", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr1.response;
      result_obj = JSON.parse(resultJSON);
      console.log(resultJSON);
        $("#freetitle").text(result_obj.title);
        $("#freeuser").text(result_obj.nickname);
        $("#freecontent").text(result_obj.contents_text);
        $("#freetag").text(result_obj.tag_text);

    }
  }
}

// -------------------------------------------------------------------------------