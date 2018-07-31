var express = require('express');
var router = express.Router();
var db = require('../database')

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
}

router.get('/', function(req, res, next) {
  res.render('index');
});


/* GET users listing. */
router.post('/signup', asyncMiddleware(async function(req, res, next) {
  var id = req.body.id;
  var password = req.body.password;
  var nickname = req.body.nickname;

  var ret = await db.SignUp(id, password, nickname);
  console.log(ret);
  res.json(ret);
}));

router.post('/signin', asyncMiddleware(async function(req, res, next) {
  console.log(req.body);
  var username = req.body.id;
  var password = req.body.password;
  var id = (await db.SignIn(username, password)).result.id;
  console.log(id)
  if(id != null){
    var sess = req.session
    sess.loginInfo = {
      _id: id,
      username: username
    }

    return res.json({ success: true })
      // RETURN SUCCESS
  } else {
  return res.json({ success: false })
  }
}))


router.post('/logout', (req, res) => {
  //TODO: 로그아웃 구현
  return res.json({ success: true })
})


module.exports = router;
