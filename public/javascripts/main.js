var socket = "";
var room_id = "";
var user_name = "";
var user_id = "";
var board = "";
var free_id = "";
var question_id = "";
var anom_id = "";
var free_flag = "";
var question_flag = "";
var anom_flag = "";
var room = ["freshman", "sophomore", "junior", "senior" ,"all"];
var z_index_increment = 10;
var freetagsarray = "";
var questiontagsarray = "";
var anomtagsarray = "";

function turn_off() {
  window.open('', '_self', '');
  window.close();
  return false;
}

function Detail_Date() {
  var n_date = new Date ();
  var n_year = n_date.getYear()+1900;
  var n_month = n_date.getMonth() + 1;
  var n_day = n_date.getDate();
  var n_hour = n_date.getHours();
  var n_min = n_date.getMinutes();
  var time_string = "";
  if (n_hour <= 12) {
  time_string = n_year+"년 "+n_month+"월 "+n_day+"일 오전 "+n_hour+":"+n_min;
  }
  else {
  time_string = n_year+"년 "+n_month+"월 "+n_day+"일 오후 "+n_hour+":"+n_min;
  }
  console.log(time_string);
  console.log(document.getElementById("detail_time").innerHTML);
  $(".set_current_detail_time").text(time_string);
}




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

function show_freeboard () {
  $('#freeBoard_div').show(function(){
    board = 1;
    $(this).css({'z-index': ++z_index_increment});
    var first_tb = document.getElementById("table1");
    first_tb.innerHTML = "";
    var dataJSON = {"board_id": 1}
    var data = JSON.stringify(dataJSON);
    var xmlHttp1 = new XMLHttpRequest();
    xmlHttp1.open("POST", "/board/load", true);
    xmlHttp1.setRequestHeader("Content-Type", "application/json");
    xmlHttp1.send(data);
    xmlHttp1.onreadystatechange = function() {
      console.log("success1");
      if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
        var result = JSON.parse(xmlHttp1.responseText);
        for (var i in result) {
          var elem_id1 = result[i].id;
          var title = result[i].title;
          var writer = result[i].nickname;
          var string_data = result[i].created_at.split("T");
          var date = string_data[0];
          var tag = result[i].tag_text;
          var obj = document.getElementById("table1");
          var divAppend = document.createElement("tr");
          divAppend.setAttribute('id', "freeboard_"+elem_id1);
          divAppend.setAttribute('ondblclick','detail1('+elem_id1+');');
          divAppend.innerHTML = "<td id="+elem_id1+" ondblclick='detail1("+elem_id1+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
          obj.appendChild(divAppend);
        }
      }
    }
  });
  }

  function show_free_side (callback) {
    // document.getElementById("detail-list-area").innerHTML = "";
    var dataJSON = {"board_id": 1}
    var data = JSON.stringify(dataJSON);
    var xmlHttp1 = new XMLHttpRequest();
    xmlHttp1.open("POST", "/board/load", true);
    xmlHttp1.setRequestHeader("Content-Type", "application/json");
    xmlHttp1.send(data);
    xmlHttp1.onreadystatechange = function() {
      console.log("success1");
      if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
        var result = JSON.parse(xmlHttp1.responseText);
        document.getElementById("detail-list-area").innerHTML = "";
        for (var i in result) {
          var elem_id1 = result[i].id;
          var title = result[i].title;
          var writer = result[i].nickname;
          var string_data = result[i].created_at.split("T");
          var date = string_data[0];
          var tag = result[i].tag_text;
          var obj = document.getElementById("detail-list-area");
          var divAppend = document.createElement("div");
          divAppend.className = "detail-list-item";
          divAppend.setAttribute('id', "detail_"+elem_id1);
          divAppend.setAttribute('onclick','detail1('+elem_id1+');');
          divAppend.innerHTML = "<p class='detail_title' >"+title+"</p><p class='creator'><span>"+date+"&nbsp;&nbsp;"+"</span>"+writer+"</p>";
          obj.appendChild(divAppend);
        }
        callback();
      }
    }

  }

  function show_freecomments() {
    var dataJSON = {contents_id : free_id};
    var data = JSON.stringify(dataJSON);
    var xmlHttp1 = new XMLHttpRequest();
    xmlHttp1.open("POST", "board/comments/free/load", true);
    xmlHttp1.setRequestHeader("Content-Type", "application/json");
    xmlHttp1.onreadystatechange = function() {
      if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
        document.getElementById("FreeCommentsList").innerHTML = "";
        var result = JSON.parse(xmlHttp1.responseText);
        for (var i in result) {
          var comment_id1 = result[i].id;
          var comment_user = result[i].user_id;
          var comment_text = result[i].comment_text;
          var comment_date_string = result[i].created_at.split("T");
          var comment_date = comment_date_string[0];
          var li = document.createElement("div");
          li.className = "FreeCommentsElement"
          li.innerHTML = "<span id = 'FreeCommentText' class = 'FreeCommentText'>"+comment_text+"</span> - <span id = 'FreeCommentUser' class = 'FreeCommentUser'>"+comment_user+"</span><span id = 'FreeCommentDate' class = 'FreeCommentDate'>"+comment_date+"</span><button id= 'FreeCommentDelete' class = 'FreeCommentDelete' onclick = 'Delete_free_comments("+comment_id1+");'>삭제</button>";
          document.getElementById("FreeCommentsList").appendChild(li);
        }
      }
    }
    xmlHttp1.send(data);
  }

  function show_question () {
    $('#question_div').show(function(){
      board = 2;
      $(this).css({'z-index': ++z_index_increment});
      var first_tb = document.getElementById("table2");
      first_tb.innerHTML = "";
      var dataJSON = {"board_id": 2}
      var data = JSON.stringify(dataJSON);
      var xmlHttp1 = new XMLHttpRequest();
      xmlHttp1.open("POST", "/board/load", true);
      xmlHttp1.setRequestHeader("Content-Type", "application/json");
      xmlHttp1.send(data);
      xmlHttp1.onreadystatechange = function() {
        console.log("success2");
        if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
          var result = JSON.parse(xmlHttp1.responseText);
          for (var i in result) {
            var elem_id1 = result[i].id;
            var title = result[i].title;
            var writer = result[i].nickname;
            var string_data = result[i].created_at.split("T");
            var date = string_data[0];
            var tag = result[i].tag_text;
            var obj = document.getElementById("table2");
            var divAppend = document.createElement("tr");
            divAppend.setAttribute('id', "question_"+elem_id1);
            divAppend.setAttribute('ondblclick','detail2('+elem_id1+');');
            divAppend.innerHTML = "<td id="+elem_id1+" ondblclick='detail2("+elem_id1+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
            obj.appendChild(divAppend);
          }
        }
      }
    });
    }


    function show_question_side (something) {
      //document.getElementById("detail-list-area-question").innerHTML = "";
      var dataJSON = {"board_id": 2}
      var data = JSON.stringify(dataJSON);
      var xmlHttp1 = new XMLHttpRequest();
      xmlHttp1.open("POST", "/board/load", true);
      xmlHttp1.setRequestHeader("Content-Type", "application/json");
      xmlHttp1.send(data);
      xmlHttp1.onreadystatechange = function() {
        console.log("success1");
        if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
          var result = JSON.parse(xmlHttp1.responseText);
          document.getElementById("detail-list-area-question").innerHTML = "";
          for (var i in result) {
            var elem_id1 = result[i].id;
            var title = result[i].title;
            var writer = result[i].nickname;
            var string_data = result[i].created_at.split("T");
            var date = string_data[0];
            var tag = result[i].tag_text;
            var obj = document.getElementById("detail-list-area-question");
            var divAppend = document.createElement("div");
            divAppend.setAttribute('id', "question_detail_"+elem_id1);
            divAppend.setAttribute('onclick','detail2('+elem_id1+');');
            divAppend.className = "detail-list-item";
            divAppend.innerHTML = "<p class='detail_title' onclick = 'detail2("+elem_id1+");'>"+title+"</p><p class='creator'><span>"+date+"&nbsp;&nbsp;"+"</span>"+writer+"</p>";
            obj.appendChild(divAppend);
          }
          something();
        }
      }
    }


    function show_questioncomments() {
      var dataJSON = {contents_id : question_id};
      var data = JSON.stringify(dataJSON);
      var xmlHttp1 = new XMLHttpRequest();
      xmlHttp1.open("POST", "board/comments/prob/load", true);
      xmlHttp1.setRequestHeader("Content-Type", "application/json");
      xmlHttp1.onreadystatechange = function() {
        if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
          document.getElementById("QuestionCommentsList").innerHTML = "";
          var result = JSON.parse(xmlHttp1.responseText);
          for (var i in result) {
            var comment_id1 = result[i].id;
            var comment_user = result[i].user_id;
            var comment_title = result[i].title;
            var comment_text = result[i].comment_text;
            var comment_date_string = result[i].created_at.split("T");
            var comment_date = comment_date_string[0];
            var li = document.createElement("div");
            li.className = "QuestionCommentsElement"
            li.innerHTML = "<br><div class = 'question_title'><span id='QuestionCommentTitle' class='QuestionCommentTitle'>"+comment_title+" </span></div><div class = 'question_info'><span id = 'QuestionCommentUser' class = 'QuestionCommentUser'>"+comment_user+"&nbsp;&nbsp;</span><span id = 'QuestionCommentDate' class = 'QuestionCommentDate'>"+comment_date+"</span></div><div class = 'question_comment'><span id = 'QuestionCommentText' class = 'QuestionCommentText'>"+comment_text+"</span><button id= 'questionCommentDelete' class = 'QuestionCommentDelete' onclick = 'Delete_question_comments("+comment_id1+");'>&#xf00d;</button></div>";
            document.getElementById("QuestionCommentsList").appendChild(li);
          }
        }
      }
      xmlHttp1.send(data);
    }

function show_anomboard () {
  $('#anonymous_div').show(function(){
    board = 3;
    $(this).css({'z-index': ++z_index_increment});
    var first_tb = document.getElementById("table3");
    first_tb.innerHTML = "";
    var dataJSON = {"board_id": 3}
    var data = JSON.stringify(dataJSON);
    var xmlHttp1 = new XMLHttpRequest();
    xmlHttp1.open("POST", "/board/load/anonym", true);
    xmlHttp1.setRequestHeader("Content-Type", "application/json");
    xmlHttp1.send(data);
    xmlHttp1.onreadystatechange = function() {
      console.log("success3");
      if (xmlHttp1.readyState == XMLHttpRequest.DONE) {
        var result = JSON.parse(xmlHttp1.responseText);
        for (var i in result) {
          console.log(result[i].id);
          var elem_id1 = result[i].id;
          var title = result[i].title;
          var writer = result[i].user_name;
          var string_data = result[i].created_at.split("T");
          var date = string_data[0];
          var tag = result[i].tag_text;
          var obj = document.getElementById("table3");
          var divAppend = document.createElement("tr");
            divAppend.setAttribute('id', "anom_"+elem_id1);
            divAppend.setAttribute('ondblclick','detail3('+elem_id1+');');
          divAppend.innerHTML = "<td id="+elem_id1+" ondblclick='detail3("+elem_id1+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
          obj.appendChild(divAppend);
        }
      }
    }
  });
  }

  function show_anom_side(something) {
    //document.getElementById("detail-list-area-anom").innerHTML = "";
    var dataJSON = {"board_id" : 3};
    var data = JSON.stringify(dataJSON);
    var xmlHttp3 = new XMLHttpRequest();
    xmlHttp3.open("POST", "/board/load/anonym", true);
    xmlHttp3.setRequestHeader("Content-Type", "application/json");
    xmlHttp3.send(data);
    xmlHttp3.onreadystatechange = function() {
      if (xmlHttp3.readyState == XMLHttpRequest.DONE) {
        var result = JSON.parse(xmlHttp3.responseText);
        document.getElementById("detail-list-area-anom").innerHTML = "";
        for (var i in result) {
          var elem_id3 = result[i].id;
          var title = result[i].title;
          var writer = result[i].user_name;
          var string_data = result[i].created_at.split("T");
          var date = string_data[0];
          var tag = result[i].tag_text;
          var obj = document.getElementById("detail-list-area-anom");
          var divAppend = document.createElement("div");
          divAppend.setAttribute('id', "anom_detail_"+elem_id3);
            divAppend.setAttribute('onclick','detail3('+elem_id3+');');
          divAppend.className = "detail-list-item-anom";
          divAppend.innerHTML = "<p class='detail_title'>"+title+"</p><p class='creator'><span>"+date+"&nbsp;&nbsp;"+"</span>"+writer+"</p>";
          obj.appendChild(divAppend);
        }
        something();
      }
    }
  }

  function show_anomcomments() {
    var dataJSON = {contents_id : anom_id};
    var data = JSON.stringify(dataJSON);
    var xmlHttp3 = new XMLHttpRequest();
    xmlHttp3.open("POST", "board/comments/anonym/load", true);
    xmlHttp3.setRequestHeader("Content-Type", "application/json");
    xmlHttp3.onreadystatechange = function() {
      if (xmlHttp3.readyState == XMLHttpRequest.DONE) {
        document.getElementById("AnomCommentsList").innerHTML = "";
        var result = JSON.parse(xmlHttp3.responseText);
        for (var i in result) {
          var comment_id3 = result[i].id;
          var comment_user = result[i].user_name;
          var comment_text = result[i].comment_text;
          var comment_date_string = result[i].created_at.split("T");
          var comment_date = comment_date_string[0];
          var li = document.createElement("div");
          li.className = "AnomCommentsElement"
          li.innerHTML = "<span id = 'AnomCommentText' class = 'AnomCommentText'>"+comment_text+"</span> - <span id = 'AnomCommentUser' class = 'AnomCommentUser'>"+comment_user+"</span><span id = 'AnomCommentDate' class = 'AnomCommentDate'>"+comment_date+"</span><button id= 'AnomCommentDelete' class = 'AnomCommentDelete' onclick = 'check_com_pw(" + comment_id3 + ");'>삭제</button>";
          document.getElementById("AnomCommentsList").appendChild(li);
        }
      }
    }
    xmlHttp3.send(data);
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
      document.getElementById("user").innerHTML = user_name + " 로그아웃..."
      console.log(user_name);
    }
  }

  $('#terminal_div').hide();
  $('#terminal_chat_div').hide();
  $('#freeBoard_div').hide();
  $('#freeBoard_add_div').hide();
  $('#freeBoard_detail_div').hide();
  $('#xiri_div').hide();
  $('#question_div').hide();
  $('#anonymous_div').hide();
  $('#question_add_div').hide();
  $('#questionBoard_detail_div').hide();
  $('#anomBoard_detail_div').hide();
  $('#anomBoard_add_div').hide();

  printClock();
  $('.window').draggable();
  $('.folder').draggable();
  $(".dropdown").hide();

  $( "form" ).submit(function( event ) {
    event.preventDefault();
  });
  $('.window').on("click", function(e){
    e.preventDefault();
    $(this).css({'z-index': ++z_index_increment});
  })

$("#dropdown").click(function(e){
  if($(".dropdown").is(':visible')){
    $(".dropdown").fadeOut('fast');
  } else{
    $(".dropdown").show(function(){
      $(this).css({'z-index' : ++z_index_increment});
    });
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
        $('#terminal_div').show(function(){

          $(this).css({'z-index' : ++z_index_increment});
          $('#TerminalQuery').focus();
        });
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


$('#siri_icon').on("click", function(e){
  e.preventDefault();
  $('#xiri_div').show('slide', {
    direction : "right"
  }, 1000);
})

$('#terminal_div .close_btn').on("click", function(e){
  e.preventDefault();
  document.getElementById("TerminalList").innerHTML = "";
  $('#terminal_div').hide();
})

$('#terminal_chat_div .close_btn').on("click", function(e) {
  e.preventDefault();
  $('#terminal_chat_div').hide();
})

$('#freeBoard_btn').on("dblclick", function(e){
  e.preventDefault();
  $('#freeBoard_div').css({top: 200, left: 350, position: 'absolute', overflow: 'hidden', 'z-index': ++z_index_increment});
  show_freeboard();
});

$('#freeBoard_add_btn').on("click", function(e){
  e.preventDefault();
  $('#freeBoard_add_div').css({top: 100, left: 400, position: 'absolute', overflow: 'hidden', 'z-index': ++z_index_increment});
  $('#freeBoard_add_div').show();
})

$('#freeBoard_add_div .close_btn').on("click", function(e) {
  e.preventDefault();
  document.name_form.free_name.value = "";
  document.contents_form.free_contents.value = "";
  freetagsarray.removeAll();
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

$("#question_btn").on("dblclick", function(e){
  e.preventDefault();
  $('#question_div').css({top: 150, left: 500, position: 'absolute', overflow: 'hidden'});
  show_question();
})

$('#question_div .close_btn').on("click", function(e){
  e.preventDefault();
  $('#question_div').hide();
})

$('#anonymous_btn').on('dblclick', function(e){
  e.preventDefault();
  $('#anonymous_div').css({top: 100, left: 650, position: 'absolute', overflow: 'hidden'});
  show_anomboard();
})

$('#anonymous_div .close_btn').on("click", function(e){
  e.preventDefault();
  $('#anonymous_div').hide();
})

$('#anomBoard_add_div .close_btn').on("click", function(e){
  e.preventDefault();
  $('#anomBoard_add_div').hide();
})

$('#anomBoard_detail_div .close_btn').on("click", function(e){
  e.preventDefault();
  $('#anomBoard_detail_div').hide();
})



$('#question_add_div .close_btn').on("click", function(e){
  e.preventDefault();
  document.question_name_form.question_name.value = "";
  document.question_contents_form.question_contents.value = "";
  questiontagsarray.removeAll();
  $('#question_add_div').hide();
})

$('#questionBoard_detail_div .close_btn').on("click", function(e){
  e.preventDefault();
  $('#questionBoard_detail_div').hide();
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
            var elem_id1 = result[i].id;
            var title = result[i].title;
            var writer = result[i].nickname;
            var string_data = result[i].created_at.split("T");
            var date = string_data[0];
            var tag = result[i].tag_text;
            var divAppend = document.createElement("tr");
            divAppend.innerHTML = "<td onclick='detail1("+elem_id1+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
            obj.appendChild(divAppend);
          }
        }
      }
    }
  }
})


$('#search_input2').on("keydown", function(e){
  if(e.keyCode === 13){
    var dataJSON = {"board_id": 2, "keyword": $("#search_input2").val()}
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
          var obj = document.getElementById("table2");
          obj.innerHTML = "";
          for (var i in result) {
            var elem_id1 = result[i].id;
            var title = result[i].title;
            var writer = result[i].nickname;
            var string_data = result[i].created_at.split("T");
            var date = string_data[0];
            var tag = result[i].tag_text;
            var divAppend = document.createElement("tr");
            divAppend.innerHTML = "<td onclick='detail2("+elem_id1+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
            obj.appendChild(divAppend);
          }
        }
      }
    }
  }
})


$('#search_input3').on("keydown", function(e){
  if(e.keyCode === 13){
    var dataJSON = {"board_id": 3, "keyword": $("#search_input3").val()}
    var data = JSON.stringify(dataJSON);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "/board/search/anonym", true);  //*******************should modify************** */
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(data);
    xmlHttp.onreadystatechange = function() {
      console.log("success");
      if (xmlHttp.readyState == XMLHttpRequest.DONE) {
        var result = JSON.parse(xmlHttp.responseText);
        console.log(result.length);
        if(result.length != undefined){
          var obj = document.getElementById("table3");
          obj.innerHTML = "";
          for (var i in result) {
            var elem_id1 = result[i].id;
            var title = result[i].title;
            var writer = result[i].user_name;
            var string_data = result[i].created_at.split("T");
            var date = string_data[0];
            var tag = result[i].tag_text;
            var divAppend = document.createElement("tr");
            divAppend.innerHTML = "<td onclick='detail3("+elem_id1+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
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
    else if (string.endsWith('뭐야') || string.endsWith('누구야') || string.endsWith('넌 누구야') || string.endsWith('너 누구야') || string.endsWith('넌 누 구 야') || string.endsWith('너 누 구 야')) {
      response.innerHTML = "안녕하세요 저는 Xiri에요";
      textToSpeech($('#response').text());
    }
    else if (string.endsWith('사랑해') || string.endsWith('사 랑 해') || string.endsWith('사랑 해') || string.endsWith('사 랑 해')) {
        response.innerHTML = "아...감사해요";
        textToSpeech($('#response').text());
      }
      else if (string.endsWith('비트박스 해줘') || string.endsWith('비트박스') || string.endsWith('비 트 박 스') || string.endsWith('비트박스 해 줘')) {
        response.innerHTML = "연습중인 비트박스에요.";
        textToSpeech("연습 중인 비트박스에요. 북치기 박치기 북치기 박치기 북치기 박치기. 전 이거 하루종일 할 수 있어요.");
      }
    else if (string.endsWith('터미널') || string.endsWith('터미널 켜줘') || string.endsWith('터 미 널 켜 줘')) {
      $('#xiri_div').hide();
      $('#terminal_div').show();
    }
    else if (string.endsWith('꺼져') || string.endsWith('꺼 져') || string.endsWith('저리가')|| string.endsWith('저리 가')|| string.endsWith('저 리 가')) {
      $('#xiri_div').hide();
     }
     else if (string.endsWith('자유게시판') || string.endsWith('자유 게시판') || string.endsWith('자 유 게 시 판')) {
        $('#xiri_div').hide();
        $('#freeBoard_div').show();
      }
      else if (string.endsWith('익명게시판') || string.endsWith('익명 게시판') || string.endsWith('익 명 게 시 판')) {
        $('#xiri_div').hide();
        $('#anonymous_div').show();
      }
      else if (string.endsWith('질문게시판') || string.endsWith('질문 게시판') || string.endsWith('질 문 게 시 판')) {
        $('#xiri_div').hide();
        $('#question_div').show();
      }
      else if (string.endsWith('블루홀') || string.endsWith('블루홀 어때') || string.endsWith('블루홀 좋아') || string.endsWith('펍지 좋아') || string.endsWith('펍지')) {
        response.innerHTML = "배그는 갓겜이죠.";
        textToSpeech($('#response').text());
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

window.addEventListener('DOMContentLoaded', function () {
  freetagsarray = new Taggle('freetags');
  questiontagsarray = new Taggle('question_tags');
  anomtagsarray = new Taggle('anomtags');
})


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
    let foldertextnode = document.createTextNode("apple-ui-MacBook-Pro:~ "+user_name+"$"+room.join(' '));
    console.log(room);
    foldernode.appendChild(foldertextnode);
    document.getElementById("TerminalList").appendChild(foldernode);
  }
  if (split_query[0] === "vim") {
    console.log(split_query[1]);
    room_id = split_query[1];
    console.log(room_id);
    socket = io.connect('https://sambong.koreacentral.cloudapp.azure.com:443');
    socket.connect();
    socket.on('connect', function(){
      socket.emit('join:room', {roomId: room_id});
      $('#terminal_div').hide();
      $('#terminal_chat_div').css({top:300, left: 600, 'z-index': ++z_index_increment});
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
    })
  }
  if (split_query[0] === "mkdir") {
    room.push(split_query[1]);
}
if (split_query[0] === "exit") {
  $('#terminal_div').hide();
}
if (split_query[0] === "xiri") {
  $('#xiri_div').show('slide', {
    direction : "right"
  }, 1000);
}
if (split_query[0]=== "quit") {
  $('#terminal_div').hide();
}
  if (split_query[0] === "cd") {
    console.log(split_query[1]);
    folder_id = split_query[1];
    if (folder_id === 'free') {
      $('#terminal_div').hide();
      show_freeboard();
      show_freecomments();
    }
    else if (folder_id === 'anonymous') {
      $('#terminal_div').hide();
      //$('#anonymous_div').show();
      show_anomboard();
    }
    else if (folder_id === 'question') {
      $('#terminal_div').hide();
      //$('#anonymous_div').show();
      show_question();
    }
  }
}

function chat_submit() {
  let chat_query = document.getElementById("ChatQuery").value;
  console.log(document.getElementById("ChatQuery").value);
  if (chat_query === ':wq') {
    socket.disconnect();
    document.getElementById("ChatList").innerHTML = "";
    $('#terminal_chat_div').hide();
    $('#terminal_div').show(function(){
      $(this).css({'z-index': ++z_index_increment});
      $('#TerminalQuery').focus();
    });
  }
  socket.emit('send:message', {roomId: room_id, message: chat_query});
  document.getElementById("ChatQuery").value = "";
}

function add_free() {
  //$('#freeBoard_div').hide();
  free_flag = 1;

  $('#freeBoard_add_div').show(function(){
    $(this).css({'z-index': ++z_index_increment});
    Detail_Date();
  });
}

function add_question() {
  console.log("aaaaaaaaa");
  question_flag = 1;
  $('#question_add_div').show(function(){
    $(this).css({'z-index': ++z_index_increment});
    Detail_Date();
  });
}

function add_anom() {
  console.log("aaaaaaaaa");
  anom_flag = 1;
  $('#anomBoard_add_div').show(function(){
    $(this).css({'z-index' : ++z_index_increment});
    Detail_Date();
  });
}

//------------------------------------for free board
function send_free_two() {
  if (free_flag == 1) {
    send_free_add();
  }
  else if (free_flag == 2) {
    send_free_modify();
  }

}
function send_free_add () {
  console.log(freetagsarray.getTagValues());
  var dataJSON = {"user_id" : user_id, "board_id" : 1, "title" : document.name_form.free_name.value, "contents_text" : document.contents_form.free_contents.value, "tags" : freetagsarray.getTagValues().toString()};
  var data = JSON.stringify(dataJSON);
  console.log(dataJSON);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/board/contents", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
  $('#freeBoard_add_div').hide();
  document.name_form.free_name.value = "";
  document.contents_form.free_contents.value = "";
  freetagsarray.removeAll();
  show_freeboard();
  show_freecomments();

}

function detail1(elem_id1) {
  //$('#freeBoard_div').hide();
  $('#freeBoard_detail_div').show( function(){
    $(this).css({'z-index': ++z_index_increment});
  });
  free_id = elem_id1;
  console.log(elem_id1);
  var dataJSON = {"board_id" : 1, "contents_id" : elem_id1};
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
        var detail1_time = result_obj.created_at;
        var a = detail1_time.split("T");
        var split_date = a[0].split("-");
        var splited_string = split_date[0]+"년 "+split_date[1]+"월 "+split_date[2]+"일";
        $("#detail_time_free").text(splited_string);
    }
    show_free_side(function(){
      $("#detail_"+elem_id1).css({'background-color':'rgb(248,225,152)'})
    });
  }
  show_freecomments();
}

function delete_free() {
  var dataJSON = {"contents_id" : free_id, "user_id" : user_id};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", "/board/contents/delete", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr1.response;
      result_obj = JSON.parse(resultJSON);
      console.log(resultJSON);
      if (result_obj.message !== 'Deleting failed') {
      $('#freeBoard_detail_div').hide();
      show_freeboard();
      show_freecomments();
      show_free_side();
    } else {
      alert("Failed To Delete!");
    }
    }
  }
}

function modify_free() {
  free_flag = 2;
  modify_free_title = $("#freetitle").text();
  modify_free_user = $("#freeuser").text();
  modify_free_content = $("#freecontent").text();
  modify_free_tag =  $("#freetag").text();
  //$('#freeBoard_detail_div').hide();
  document.name_form.free_name.value = modify_free_title;
  document.contents_form.free_contents.value = modify_free_content;
  free_tags_array = modify_free_tag.split(',');
  freetagsarray.add(free_tags_array);
  $('#freeBoard_add_div').show(function(){
    $(this).css({'z-index': ++z_index_increment});
  });
}

function send_free_modify () {
  var dataJSON = {"contents_id" : free_id, "user_id" : user_id, "title" : document.name_form.free_name.value, "contents_text": document.contents_form.free_contents.value, "tags":  freetagsarray.getTagValues().toString()};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", "/board/contents/edit", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr1.response;
      result_obj = JSON.parse(resultJSON);
      console.log(resultJSON);
      if (result_obj.message !== 'Editing failed') {
      $('#freeBoard_add_div').hide();
      document.name_form.free_name.value = "";
      document.contents_form.free_contents.value = "";
      freetagsarray.removeAll();
      detail1(free_id);
      show_freeboard();
      show_freecomments();
    } else {
      alert("Failed To Edit!");
    }
    }
  }
}

function send_free_comment () {
  var dataJSON = {"contents_id" : free_id, "user_id" : user_id, "comment_text" : document.getElementById("free_comments").value};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", "/board/comments/free", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  document.getElementById("free_comments").value = "";
  show_freecomments();
}

function Delete_free_comments(comment_id1) {
  var dataJSON = {"comment_id" : comment_id1, "user_id" : user_id};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", "/board/comments/free/delete", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState == XMLHttpRequest.DONE) {
    document.getElementById("free_comments").value = "";
    var resultJSON = xhr1.response;
    result_obj = JSON.parse(resultJSON);
    show_freecomments();
    //$('#freeBoard_detail_div').hide();
    //$('#freeBoard_detail_div').show(function(){
      //$(this).css({'z-index': ++z_index_increment});
    //});
    //show_free_side();
  }
}
}

// -------------------------------------------------------------------------------for question board
function send_question_two() {
  console.log("send question");
  if (question_flag == 1) {
    send_question_add();
  }
  else if (question_flag == 2) {
    send_question_modify();
  }
}
function send_question_add () {
  var dataJSON = {"user_id" : user_id, "board_id" : 2, "title" : document.question_name_form.question_name.value, "contents_text" : document.question_contents_form.question_contents.value, "tags" : questiontagsarray.getTagValues().toString()};
  var data = JSON.stringify(dataJSON);
  console.log(dataJSON);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/board/contents", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
  $('#question_add_div').hide();
  document.question_name_form.question_name.value = "";
  document.question_contents_form.question_contents.value = "";
  questiontagsarray.removeAll();
  show_question();
}

function detail2(elem_id2) {
  $('#questionBoard_detail_div').show(function(){
    $(this).css({'z-index': ++z_index_increment});
  });
  question_id = elem_id2;
  console.log(elem_id2);
  var dataJSON = {"board_id" : 2, "contents_id" : elem_id2};
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
        $("#questiontitle").text(result_obj.title);
        $("#questionuser").text(result_obj.nickname);
        $("#questioncontent").text(result_obj.contents_text);
        $("#questiontag").text(result_obj.tag_text);
        var detail1_time = result_obj.created_at;
        var a = detail1_time.split("T");
        var split_date = a[0].split("-");
        var splited_string = split_date[0]+"년 "+split_date[1]+"월 "+split_date[2]+"일";
        $("#detail_time_question").text(splited_string);
    }
    show_question_side(function(){
      $("#question_detail_"+elem_id2).css({'background-color':'rgb(248,225,152)'})
    });
  }
  show_questioncomments();
}

function delete_question() {
  var dataJSON = {"contents_id" : question_id, "user_id" : user_id};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  console.log(question_id);
  xhr1.open("POST", "/board/contents/delete", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr1.response;
      result_obj = JSON.parse(resultJSON);
      console.log(resultJSON);
      if (result_obj.message !== 'Deleting failed') {
      $('#questionBoard_detail_div').hide();
      show_question();
      show_question_side();
      show_questioncomments();
    } else {
      alert("Failed To Delete!");
    }
    }
  }
}

function modify_question() {
  console.log("modifyy");
  question_flag = 2;
  modify_question_title = $("#questiontitle").text();
  modify_question_user = $("#questionuser").text();
  modify_question_content = $("#questioncontent").text();
  modify_question_tag =  $("#questiontag").text();
  //$('#questionBoard_detail_div').hide();
  document.question_name_form.question_name.value = modify_question_title;
  document.question_contents_form.question_contents.value = modify_question_content;
  split_question_tag = modify_question_tag.split(",");
  questiontagsarray.add(split_question_tag);
  $('#question_add_div').show(function(){
    $(this).css({'z-index': ++z_index_increment});
  });
}

function send_question_modify () {
  var dataJSON = {"contents_id" : question_id, "user_id" : user_id, "title" : document.question_name_form.question_name.value, "contents_text": document.question_contents_form.question_contents.value, "tags":  questiontagsarray.getTagValues().toString()};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", "/board/contents/edit", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr1.response;
      result_obj = JSON.parse(resultJSON);
      console.log(resultJSON);
      if (result_obj.message !== 'Editing failed') {
      $('#question_add_div').hide();
      document.question_name_form.question_name.value = "";
      document.question_contents_form.question_contents.value = "";
      questiontagsarray.removeAll();
      show_question_side();
      show_question();
      show_questioncomments();
      detail2(question_id);
    } else {
      alert("Failed To Edit!");
    }
    }
  }
}

function send_question_comment () {
  var dataJSON = {"contents_id" : question_id, "user_id" : user_id, "comment_text" : document.getElementById("question_comments").value, "title" : document.getElementById("question_comments_title").value};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", "/board/comments/prob", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  document.getElementById("question_comments").value = "";
  document.getElementById("question_comments_title").value = "";
  show_questioncomments();
}


function Delete_question_comments(comment_id2) {
  var dataJSON = {"comment_id" : comment_id2, "user_id" : user_id};
  var data = JSON.stringify(dataJSON);
  var xhr1 = new XMLHttpRequest();
  xhr1.open("POST", "/board/comments/prob/delete", true);
  xhr1.setRequestHeader("Content-Type", "application/json");
  xhr1.send(data);
  xhr1.onreadystatechange = function() {
    if (xhr1.readyState == XMLHttpRequest.DONE) {
    document.getElementById("question_comments").value = "";
    var resultJSON = xhr1.response;
    result_obj = JSON.parse(resultJSON);
    show_questioncomments();
    //$('#questionBoard_detail_div').hide();
    /*$('#questionBoard_detail_div').show(function(){
      $(this).css({'z-index': ++z_index_increment});
    });*/
    show_question_side();
  }
}
}


//-----------------for anom board

function send_anom_two () {
  if (anom_flag == 1) {
    send_anom_add();
  }
  else if (anom_flag == 2) {
    send_anom_modify();
  }

}

function send_anom_add () {
  var dataJSON = {"user_name" : document.anom_nickname_form.anom_nickname.value, "board_id" : 3, "title" : document.anom_name_form.anom_name.value, "contents_text" : document.anom_contents_form.anom_contents.value, "tags" : anomtagsarray.getTagValues().toString(), "password" : document.anompw.anom_pw.value};
  var data = JSON.stringify(dataJSON);
  console.log(dataJSON);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/board/contents/anonym", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
  $('#anomBoard_add_div').hide();
  document.anom_name_form.anom_name.value = "";
  document.anom_nickname_form.anom_nickname.value = "";
  document.anom_contents_form.anom_contents.value = "";
  anomtagsarray.removeAll();
  document.anompw.anom_pw.value = "";
  show_anomboard();
  show_anomcomments();
}

function detail3(elem_id3) {
  //$('#anonymous_div').hide();
  $('#anomBoard_detail_div').show(function(){
    $(this).css({'z-index' : ++z_index_increment});
  });
  anom_id = elem_id3;
  var dataJSON = {"contents_id" : elem_id3};
  var data = JSON.stringify(dataJSON);
  var xhr3 = new XMLHttpRequest();
  xhr3.open("POST", "/board/detail/anonym", true);
  xhr3.setRequestHeader("Content-Type", "application/json");
  xhr3.send(data);
  xhr3.onreadystatechange = function() {
    if (xhr3.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr3.response;
      result_obj = JSON.parse(resultJSON);
      $("#anomtitle").text(result_obj.title);
      $("#anomuser").text(result_obj.user_name);
      $("#anomcontent").text(result_obj.contents_text);
      $("#anomtag").text(result_obj.tag_text);
      var detail1_time = result_obj.created_at;
      var a = detail1_time.split("T");
      var split_date = a[0].split("-");
      var splited_string = split_date[0]+"년 "+split_date[1]+"월 "+split_date[2]+"일";
      $("#detail_time_anom").text(splited_string);
    }
    show_anom_side(function(){
      $("#anom_detail_"+elem_id3).css({'background-color':'rgb(248,225,152)'})
    });
  }
  show_anomcomments();
}



function delete_anom() {
  var dataJSON = {"contents_id" : anom_id};
  var data = JSON.stringify(dataJSON);
  var xhr3 = new XMLHttpRequest();
  xhr3.open("POST", "/board/contents/anonym/delete", true);
  xhr3.setRequestHeader("Content-Type", "application/json");
  xhr3.send(data);
  xhr3.onreadystatechange = function() {
    if (xhr3.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr3.response;
      result_obj = JSON.parse(resultJSON);
      console.log(resultJSON);
      if (result_obj.message !== 'Deleting failed') {
      $('#anomBoard_detail_div').hide();
      show_anomboard();
      show_anomcomments();
      show_anom_side();
      }
      else {
      alert("Failed To Delete!");
      }
    }
  }
}

function check_pw(option) {
  var pw = prompt("비밀번호 확인", "");
  var dataJSON = {"password" : pw, "contents_id" : anom_id};
  var data = JSON.stringify(dataJSON);
  var xhr3 = new XMLHttpRequest();
  xhr3.open("POST", "/board/contents/anonym/confirm", true);
  xhr3.setRequestHeader("Content-Type", "application/json");
  xhr3.send(data);
  xhr3.onreadystatechange = function() {
    if (xhr3.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr3.response;
      console.log(resultJSON);
      result_obj = JSON.parse(resultJSON);
      if (result_obj.message !== 'Wrong password') {
        if (option === 1)
          modify_anom();
        else if (option === 2)
          delete_anom();
      }
      else {
        alert("Wrong password");
      }
    }
  }
}

function check_com_pw(comment_id3) {
  var pw = prompt("비밀번호 확인", "");
  var dataJSON = {"password" : pw, "comments_id" : comment_id3};
  var data = JSON.stringify(dataJSON);
  var xhr3 = new XMLHttpRequest();
  xhr3.open("POST", "/board/comments/anonym/confirm", true);
  xhr3.setRequestHeader("Content-Type", "application/json");
  xhr3.send(data);
  xhr3.onreadystatechange = function() {
    if (xhr3.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr3.response;
      result_obj = JSON.parse(resultJSON);
      if (result_obj.message !== 'Wrong password') {
        Delete_anom_comments(comment_id3);
      }
      else {
        alert("Wrong password");
      }
    }
  }
}

function modify_anom() {
  anom_flag = 2;
  modify_anom_title = $("#anomtitle").text();
  modify_anom_user = $("#anomuser").text();
  modify_anom_content = $("#anomcontent").text();
  modify_anom_tag = $("#anomtag").text();
  //$("#anomBoard_detail_div").hide();
  document.anom_name_form.anom_name.value = modify_anom_title;
  document.anom_nickname_form.anom_nickname.value = modify_anom_user;
  document.anom_contents_form.anom_contents.value = modify_anom_content;
  split_anom_tag = modify_anom_tag.split(",");
  anomtagsarray.add(split_anom_tag);
  document.anompw.anom_pw = "";
  $('#anomBoard_add_div').show(function(){
    $(this).css({'z-index' : ++z_index_increment});
  });
}

function send_anom_modify() {
  var dataJSON = {"contents_id" : anom_id, "password" : document.anompw.anom_pw.value, "title" : document.anom_name_form.anom_name.value, "contents_text": document.anom_contents_form.anom_contents.value, "tags":  anomtagsarray.getTagValues().toString()};
  var data = JSON.stringify(dataJSON);
  var xhr3 = new XMLHttpRequest();
  xhr3.open("POST", "/board/contents/anonym/edit", true);
  xhr3.setRequestHeader("Content-Type", "application/json");
  xhr3.send(data);
  xhr3.onreadystatechange = function() {
    if (xhr3.readyState == XMLHttpRequest.DONE) {
      var resultJSON = xhr3.response;
      result_obj = JSON.parse(resultJSON);
      console.log(resultJSON);
      if (result_obj.message !== 'Editing failed') {
        $('#anomBoard_add_div').hide();
        document.anom_name_form.anom_name.value = "";
        document.anom_nickname_form.anom_nickname = "";
        document.anom_contents_form.anom_contents.value = "";
        anomtagsarray.removeAll();
        document.anompw.anom_pw.value = "";
        detail3(anom_id);
        show_anomboard();
        show_anomcomments();
      }
      else {
        alert("Failed To Edit!");
      }
    }
  }
}

function send_anom_comment() {
  var dataJSON = {"contents_id" : anom_id, "user_name" : document.getElementById("anom_username").value, "comment_text" : document.getElementById("anom_comments").value, "password" : document.getElementById("anom_password").value};
  var data = JSON.stringify(dataJSON);
  var xhr3 = new XMLHttpRequest();
  xhr3.open("POST", "/board/comments/anonym", true);
  xhr3.setRequestHeader("Content-Type", "application/json");
  xhr3.send(data);
  document.getElementById("anom_username").value = "";
  document.getElementById("anom_comments").value = "";
  document.getElementById("anom_password").value = "";
  show_anomcomments();
}

function Delete_anom_comments(comment_id3) {
  var dataJSON = {"comment_id" : comment_id3};
  var data = JSON.stringify(dataJSON);
  var xhr3 = new XMLHttpRequest();
  xhr3.open("POST", "/board/comments/anonym/delete", true);
  xhr3.setRequestHeader("Content-Type", "application/json");
  xhr3.send(data);
  xhr3.onreadystatechange = function() {
    if (xhr3.readyState == XMLHttpRequest.DONE) {
      document.getElementById("anom_username").value = "";
      document.getElementById("anom_comments").value = "";
      document.getElementById("anom_password").value = "";
      var resultJSON = xhr3.response;
      result_obj = JSON.parse(resultJSON);
      show_anomcomments();
      //$('#anomBoard_detail_div').hide();
      //$('#anomBoard_detail_div').show(function(){
       // $(this).css({'z-index' : ++z_index_increment});
      //});
      //show_anom_side();
  }
  }
}
