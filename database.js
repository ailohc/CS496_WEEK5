var mysql_dbc = require('./db/db_con')();
var connection = mysql_dbc.init();
var bcrypt = require('bcryptjs');
mysql_dbc.test_open(connection);

let SignUp = (username, password, nickname) => {
  return new Promise((resolve, reject) => {
    var passHash = bcrypt.hashSync(password, 8);
    var q = 'INSERT INTO users values(\"' + username + '\", \"' + passHash + '\", \"' + nickname + '\");'
    connection.query(q, function(err, result) {
      if(err){
        console.error(err);
        resolve({ success: false })
      } else {
        console.log("Create User Successfully")
        resolve({ success : true})
      }
    })
  })
}

exports.SignUp = async function Signup_(username, password, nickname) {
  var result;
  await SignUp(username, password, nickname).then(function(data) {
    result = data;
  })
  return { 'result' : result };
}


let SignIn = (username, password) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM users WHERE id=\"'+username + '\";'
    connection.query(q, function(err, result) {
      if(err){
        console.error(err);
      } else {
        if(result.length) {
          bcrypt.compare(password, result[0].password, function(err, res){
            if(res){
              console.log("SignIn Success")
              resolve({ 'id' : result[0].id });
            } else {
              resolve( {'message' : 'Your password is incorrect'});
            }
          })
        } else {
          resolve({'message' : 'Your login info is not found'})
        }
      }
    })
  })
}

exports.SignIn = async function Signin_(username, password) {
  var result;
  await SignIn(username, password).then(function(data) {
    result = data;
  })
  return { 'result' : result };
}

let LoadBoard = (board_id) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM users JOIN (SELECT * FROM contents WHERE board_id=' + board_id + ') AS sub WHERE users.id=sub.user_id;'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'No contents in this board'});
        }
      }
    })
  })
}

exports.LoadBoard = async function LoadBoard_(board_id) {
  var result;
  await LoadBoard(board_id).then(function(data) {
    result = data;
  })
  return result;
}

let LoadBoardSearch = (board_id, keyword) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM users JOIN (SELECT * FROM contents WHERE board_id=' + board_id + ' AND (title LIKE \"%' + keyword + '%\" OR tag_text like \"%' + keyword + '%\")) AS sub WHERE users.id=sub.user_id;'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'No contents in this board with keyword'});
        }
      }
    })
  })
}

exports.LoadBoardSearch = async function LoadBoardSearch_(board_id, keyword) {
  var result;
  await LoadBoardSearch(board_id, keyword).then(function(data) {
    result = data;
  })
  return result;
}

let newContent = (board_id, user_id, title, contents_text, tag_text) => {
  return new Promise((resolve, reject) => {
    var q = 'INSERT INTO contents (board_id, user_id, title, contents_text, created_at, tag_text) values (' + board_id + ', \"' + user_id + '\", \"' + title + '\", \"' + contents_text + '\", NOW(), \"' + tag_text + '\");'
    console.log("after query");
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'Your post failed'});
        }
      }
    })
  })
}

exports.newContent = async function newContent_(board_id, user_id, title, contents_text, tag_text) {
  var result;
  await newContent(board_id, user_id, title, contents_text, tag_text).then(function(data) {
    result = data;
  })
  return result;
}

let newAnonymContent(board_id, user_name, title, contents_text, password, tag_text) => {
  return new Promise((resolve, reject) => {
    var q = 'INSERT INTO anonym_contents (board_id, user_name, title, contents_text, created_at, password, tag_text) values (' + board_id + ', \"' + user_name + '\", \"' + title + '\", \"' + contents_text + '\", \"' + password + '\", \"' + tag_text + '\");'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(reslt);
        }
        else {
          resolve({'message' : 'Your post failed'});
        }
      }
    })
  })
}

exports.newAnonymContent = async function newAnonymContent_(board_id, user_name, title, contents_text, password, tag_text) {
  var result;
  await newAnonymContent(board_id, user_name, title, contents_text, password, tag_text).then(function(data) {
    result = data;
  })
  return result;
}

let editContent = (contents_id, user_id, title, contents_text, tag_text) => {
  return new Promise((resolve, reject) => {
    var q = 'UPDATE contents SET title=\"' + title + '\", contents_text=\"' + contents_text + '\", tag_text=\"' + tag_text + '\",  created_at=NOW(), WHERE user_id=\"' + user_id + '\" AND id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'Editing failed'});
        }
      }
    })
  })
}

exports.editContent = async function editContent_(contents_id, user_id, title, contents_text, tag_text) {
  var result;
  await newContent(contents_id, user_id, title, contents_text, tag_text).then(function(data) {
    result = data;
  })
  return result;
}

let pwConfirm = (password, contents_id) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM anonym_contents WHERE id=' + contents_id + ' AND password=\"' + password + '\";'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          reolve({'message' : 'Wrong password'});
        }
      }
    })
  })
}

exports.pwConfirm = async function pwConfirm_(password, contents_id) {
  var result;
  await pwConfirm(password, contents_id).then(function(data) {
    result data;
  })
  return result;
}

let editAnonymContent = (contents_id, password, title, contents_text, tag_text) => {
  return new Promise((resolve, reject) => {
    var q = 'UPDATE anoym_contents SET title=\"' + title + '\", contents_text=\"' + contents_text + '\", password=\"' + password + '\", tag_text=\"' + tag_text + '\", created_at=NOW(), WHERE id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'Editing failed'});
        }
      }
    })
  })
}

exports.editAnonymContent = async function editAnonymContent_(contents_id, password, title, contents_text, tag_text) => {
  var result;
  await editAnonymContent(contents_id, password, title, contents_text, tag_text).then(function(data) {
    result = data;
  })
  return result;
}

let showDetail = (contents_id, board_id) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM users JOIN (SELECT * FROM contents WHERE board_id=' + board_id + ' AND id=' + contents_id+') AS sub WHERE users.id=sub.user_id;'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          console.log(result);
          resolve(result[0]);
        }
        else {
          resolve({'message' : 'There is no contents'});
        }
      }
    })
  })
}

exports.showDetail = async function showDetail_(contents_id, board_id) {
  var result;
  await showDetail(contents_id, board_id).then(function(data) {
    result = data;
  })
  return result;
}
