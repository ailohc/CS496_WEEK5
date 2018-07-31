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
  // printClock();
  $('.window').draggable();
  $(".dropdown").hide();

  $( "form" ).submit(function( event ) {
    event.preventDefault();
  });


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
          divAppend.innerHTML = "<td id="+elem_id+" onclick='detail("+elem_id+");'>" + title + "</td><td>" + writer + "</td><td>" + date + "</td><td>" + tag + "</td>";
          obj.appendChild(divAppend);
        }
      }
    }
  });
});
var z_index_increment = 10;
$('.window').on("click", function(e){
  e.preventDefault();
  $(this).css('z-index', z_index_increment++);
})
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
//---------------------------------------------------------------------------------------------
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
      });;
  }
  if (split_query[0] === "cd") {
    console.log(split_query[1]);
    folder_id = split_query[1];
    if (folder_id === 'free') {
      $('#terminal_div').hide();
      //$('#terminal_chat_div').show();
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
    $('#terminal_div').show();
  }
  socket.emit('send:message', {roomId: room_id, message: chat_query});
  document.getElementById("ChatQuery").value = "";
}

function add_free() {
  $('#freeBoard_div').hide();
  $('#freeBoard_add_div').show();
}

// -------------------------------------------------------------------------------
