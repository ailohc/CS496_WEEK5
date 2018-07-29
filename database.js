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
        resolve({ messages: "Bad" })
      } else {
        console.log("Create User Successfully")
        resolve({messages : "Good"})
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
