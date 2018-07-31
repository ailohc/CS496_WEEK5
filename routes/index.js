var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.loginInfo){
    return res.render('main');
  }
  res.redirect('/users')
});

router.get('/test', function(req,res,next){
  res.render('main2')
})

router.get('/test2', function(req,res,next){
  res.render('main3')
})

router.get('/chat', function(req, res){
  res.render('chat')
});

router.get('/getInfo', function(req, res){
  res.json({user: req.session.loginInfo.username, id: req.session.loginInfo._id})
})

module.exports = router;
