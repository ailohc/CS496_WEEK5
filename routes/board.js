var express = require('express');
var router = express.Router();
var db = require('../database')

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
}

router.get('/', asyncMiddleware(async function(req, res, next) {
  var board_id = req.body.board_id;
  var ret = await db.LoadBoard(board_id);
  console.log(ret);
}));

router.post('/search', asyncMiddleware(async function(req, res, next) {
  var board_id = req.body.board_id;
  var keyword = req.body.keyword;
  var ret = await db.LoadBoardSearch(board_id, keyword);
  console.log(ret);
}));

module.exports = router;
