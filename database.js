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

let loadAnonymBoard = (board_id) => {
  return new Promise((resolve, reject) => {
    console.log('hi')
    var q = 'SELECT * FROM anonym_contents;'
    console.log(q);
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

exports.loadAnonymBoard = async function loadAnonymBoard_(board_id) {
  var result;
  await loadAnonymBoard(board_id).then(function(data) {
    result = data;
  })
  return result;
}

let LoadBoardSearch = (board_id, keyword) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM users JOIN (SELECT * FROM contents WHERE board_id=' + board_id + ' AND (title LIKE \"%' + keyword + '%\" OR tag_text LIKE \"%' + keyword + '%\")) AS sub WHERE users.id=sub.user_id;'
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

let loadAnonymBoardSearch = (keyword) => {
  return new Promise((resolve, reject) => {
    console.log('hi');
    var q = 'SELECT * FROM anonym_contents WHERE title LIKE \"%' + keyword + '%\" OR tag_text LIKE \"%' + keyword + '%\";'
    console.log(q);
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

exports.loadAnonymBoardSearch = async function loadAnonymBoardSearch_(keyword) {
  var result;
  await loadAnonymBoardSearch(keyword).then(function(data) {
    result = data;
  })
  return result;
}

let newContent = (board_id, user_id, title, contents_text, tag_text) => {
  return new Promise((resolve, reject) => {
    var q = 'INSERT INTO contents (board_id, user_id, title, contents_text, created_at, tag_text) values (' + board_id + ', \"' + user_id + '\", \"' + title + '\", \"' + contents_text + '\", NOW(), \"' + tag_text + '\");'

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

let newAnonymContent = (board_id, user_name, title, contents_text, password, tag_text) => {
  return new Promise((resolve, reject) => {
    var q = 'INSERT INTO anonym_contents (board_id, user_name, title, contents_text, created_at, password, tag_text) values (' + board_id + ', \"' + user_name + '\", \"' + title + '\", \"' + contents_text + '\", NOW(), \"' + password + '\", \"' + tag_text + '\");'
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
    var q = 'UPDATE contents SET title=\"' + title + '\", contents_text=\"' + contents_text + '\", tag_text=\"' + tag_text + '\",  created_at=NOW() WHERE user_id=\"' + user_id + '\" AND id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.affectedRows < 1) {
          resolve({'message' : 'Editing failed'});
        }
        else {
          resolve(result);
        }
      }
    })
  })
}

exports.editContent = async function editContent_(contents_id, user_id, title, contents_text, tag_text) {
  var result;
  await editContent(contents_id, user_id, title, contents_text, tag_text).then(function(data) {
    result = data;
  })
  return result;
}

let deleteContent = (contents_id, user_id) => {
  return new Promise((resolve, reject) => {
    console.log('wow');
    var q = 'DELETE FROM contents WHERE id=' + contents_id + ' AND user_id=\"' + user_id + '\";'
    console.log(q);
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.affectedRows < 1) {
          resolve({'message' : 'Deleting failed'});
        }
        else {
          resolve(result);
        }
      }
    })
  })
}

exports.deleteContent = async function deleteContent_(contents_id, user_id) {
  var result;
  await deleteContent(contents_id, user_id).then(function(data) {
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
          resolve({'message' : 'Wrong password'});
        }
      }
    })
  })
}

exports.pwConfirm = async function pwConfirm_(password, contents_id) {
  var result;
  await pwConfirm(password, contents_id).then(function(data) {
    result = data;
  })
  return result;
}

let editAnonymContent = (contents_id, password, title, contents_text, tag_text) => {
  return new Promise((resolve, reject) => {
    var q = 'UPDATE anonym_contents SET title=\"' + title + '\", contents_text=\"' + contents_text + '\", password=\"' + password + '\", tag_text=\"' + tag_text + '\", created_at=NOW() WHERE id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.affectedRows < 1) {
          resolve({'message' : 'Editing failed'});
        }
        else {
          resolve(result);
        }
      }
    })
  })
}

exports.editAnonymContent = async function editAnonymContent_(contents_id, password, title, contents_text, tag_text) {
  var result;
  await editAnonymContent(contents_id, password, title, contents_text, tag_text).then(function(data) {
    result = data;
  })
  return result;
}

let deleteAnonymContent = (contents_id) => {
  return new Promise((resolve, reject) => {
    var q = 'DELETE FROM anonym_contents WHERE id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.affectedRows < 1) {
          resolve({'message' : 'Deleting failed'});
        }
        else {
          resolve(result);
        }
      }
    })
  })
}

exports.deleteAnonymContent = async function deleteAnonymContent_(contents_id) {
  var result;
  await deleteAnonymContent(contents_id).then(function(data) {
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
          resolve({'message' : 'There is no content'});
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

let showAnonymDetail = (contents_id) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM anonym_contents WHERE id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result[0]);
        }
        else {
          resolve({'message' : 'There is no content'});
        }
      }
    })
  })
}

exports.showAnonymDetail = async function showAnonymDetail_(contents_id) {
  var result;
  await showAnonymDetail(contents_id).then(function(data) {
    result = data;
  })
  return result;
}

let loadFreeComment = (contents_id) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM free_comments WHERE contents_id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'There are no comments'});
        }
      }
    })
  })
}

exports.loadFreeComment = async function loadFreeComment_(contents_id) {
  var result;
  await loadFreeComment(contents_id).then(function(data) {
    result = data;
  })
  return result;
}

let loadProbComment = (contents_id) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM prob_comments WHERE contents_id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'There are no comments'});
        }
      }
    })
  })
}

exports.loadProbComment = async function loadProbComment_(contents_id) {
  var result;
  await loadProbComment(contents_id).then(function(data) {
    result = data;
  })
  return result;
}

let loadAnonymComment = (contents_id) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM anonym_comments WHERE contents_id=' + contents_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'There are no comments'});
        }
      }
    })
  })
}

exports.loadAnonymComment = async function loadAnonymComment_(contents_id) {
  var result;
  await loadAnonymComment(contents_id).then(function(data) {
    result = data;
  })
  return result;
}

let newFreeComment = (contents_id, user_id, comment_text) => {
  return new Promise((resolve, reject) => {
    var q = 'INSERT INTO free_comments (contents_id, user_id, comment_text, created_at) values (' + contents_id + ', \"' + user_id + '\", \"' + comment_text + '\", NOw());'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'Posting comment failed'});
        }
      }
    })
  })
}

exports.newFreeComment = async function newFreeComment_(contents_id, user_id, comment_text) {
  var result;
  await newFreeComment(contents_id, user_id, comment_text).then(function(data) {
    result = data;
  })
  return result;
}

let newProbComment = (contents_id, user_id, comment_text, title) => {
  return new Promise((resolve, reject) => {
    var q = 'INSERT INTO prob_comments (contents_id, user_id, comment_text, title, created_at) values (' + contents_id + ', \"' + user_id + '\", \"' + comment_text + '\", \"' + title + '\", NOW());'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'Posting comment failed'});
        }
      }
    })
  })
}

exports.newProbComment = async function newProbComment_(contents_id, user_id, comment_text, title) {
  var result;
  await newProbComment(contents_id, user_id, comment_text, title).then(function(data) {
    result = data;
  })
  return result;
}

let newAnonymComment = (contents_id, user_name, comment_text, password) => {
  return new Promise((resolve, reject) => {
    var q = 'INSERT INTO anonym_comments (contents_id, user_name, comment_text, created_at, password) values (' + contents_id +', \"' + user_name + '\", \"' + comment_text + '\", NOW(), \"' + password + '\");'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'Posting comment failed'});
        }
      }
    })
  })
}

exports.newAnonymComment = async function newAnonymComment_(contents_id, user_name, comment_text, password) {
  var result;
  await newAnonymComment(contents_id, user_name, comment_text, password).then(function(data) {
    result = data;
  })
  return result;
}

let editFreeComment = (comment_id, user_id, comment_text) => {
  return new Promise((resolve, reject) => {
    var q = 'UPDATE free_comments SET comment_text=\"' + comment_text + '\", created_at=NOW() WHERE id=' + comment_id + ' AND user_id=\"' + user_id + '\";'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve(result);
        }
        else {
          resolve({'message' : 'Editing comments failed'});
        }
      }
    })
  })
}

exports.editFreeComment = async function editFreeComment_(comment_id, user_id, comment_text) {
  var result;
  await editFreeComment(comment_id, user_id, comment_text).then(function(data) {
    result = data;
  })
  return result;
}


let deleteFreeComment = (comment_id, user_id) => {
  return new Promise((resolve, reject) => {
    var q = 'DELETE FROM free_comments WHERE id=' + comment_id + ' AND user_id=\"' + user_id +'\";'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.affectedRows < 1) {
          resolve({'message' : 'Deleting comment failed'});
        }
        else {
          resolve({'message' : 'Delete Success'});
        }
      }
    })
  })
}

exports.deleteFreeComment = async function deleteFreeComment_(comment_id, user_id) {
  var result;
  await deleteFreeComment(comment_id, user_id).then(function(data) {
    result = data;
  })
  return result;
}

let deleteProbComment = (comment_id, user_id) => {
  return new Promise((resolve, reject) => {
    var q = 'DELETE FROM prob_comments WHERE id=' + comment_id + ' AND user_id=\"' + user_id + '\";'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.affectedRows < 1) {
          resolve ({'message' : 'Deleting comment failed'});
        }
        else {
          resolve({'message' : 'Delete Success'});
        }
      }
    })
  })
}

exports.deleteProbComment = async function deleteProbComment_(comment_id, user_id) {
  var result;
  await deleteProbComment(comment_id, user_id).then(function(data) {
    result = data;
  })
  return result;
}

let deleteAnonymComment = (comment_id) => {
  return new Promise((resolve, reject) => {
    var q = 'DELETE FROM anonym_comments WHERE id=' + comment_id + ';'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.affectedRows < 1) {
          resolve ({'message' : 'Deleteing comment failed'});
        }
        else {
          resolve ({'message' : 'Delete Success'});
        }
      }
    })
  })
}

exports.deleteAnonymComment = async function deleteAnonymComment_(comment_id) {
  var result;
  await deleteAnonymComment(comment_id).then(function(data) {
    result = data;
  })
  return result;
}

let pwAnonymConfirm = (password, comments_id) => {
  return new Promise((resolve, reject) => {
    var q = 'SELECT * FROM anonym_comments WHERE id=' + comments_id + ' AND password=\"' + password + '\";'
    connection.query(q, function(err, result) {
      if (err) {
        console.error(err);
      }
      else {
        if (result.length) {
          resolve (result);
        }
        else {
          resolve ({'message' : 'Wrong password'});
        }
      }
    })
  })
}

exports.pwAnonymConfirm = async function pwAnonymConfirm_(password, comments_id) {
  var result;
  await pwAnonymConfirm(password, comments_id).then(function(data) {
    result = data;
  })
  return result;
}
