var express = require('express');
var router = express.Router();
var db = require('../database')

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);
}

router.post('/load', asyncMiddleware(async function(req, res, next) {
  var board_id = req.body.board_id;
  var ret = await db.LoadBoard(board_id);
  res.json(ret);
}));

router.post('/load/anonym', asyncMiddleware(async function(req, res, next) {
  var board_id = req.body.board_id;
  var ret = await db.loadAnonymBoard(board_id);
  res.json(ret);
}))

router.post('/search', asyncMiddleware(async function(req, res, next) {
  var board_id = req.body.board_id;
  var keyword = req.body.keyword;
  var ret = await db.LoadBoardSearch(board_id, keyword);
  res.json(ret);
}));

router.post('/search/anonym', asyncMiddleware(async function(req, res, next) {
  var keyword = req.body.keyword;
  console.log('before');
  var ret = await db.loadAnonymBoardSearch(keyword);
  console.log('after');
  res.json(ret);
}));

router.post('/contents', asyncMiddleware(async function(req, res, next) {
  var board_id = req.body.board_id;
  var user_id = req.body.user_id;
  var title = req.body.title;
  var contents_text = req.body.contents_text;
  var tag_text = req.body.tags;
  var ret = await db.newContent(board_id, user_id, title, contents_text, tag_text);
  res.json(ret);
}));

router.post('/contetns/anonym', asyncMiddleware(async function(req, res, next) {
  var board_id = req.body.board_id;
  var user_name = req.body.user_name;
  var title = req.body.title;
  var contents_text = req.body.contents_text;
  var password = req.body.password;
  var tag_text = req.body.tag_text;
  var ret = await db.newAnonymContent(board_id, user_name, title, contents_text, password, tag_text);
  res.json(ret);
}));

router.post('/contents/edit', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var user_id = req.body.user_id;
  var title = req.body.title;
  var contents_text = req.body.contents_text;
  var tag_text = req.body.tags;
  var ret = await db.editContent(contents_id, user_id, title, contents_text, tag_text);
  res.json(ret);
}));

router.post('/contents/delete', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var user_id = req.body.user_id;
  console.log('hello');
  var ret = await db.deleteContent(contents_id, user_id);
  console.log('what?');
  res.json(ret);
}));

router.post('/contents/anonym/confirm', asyncMiddleware(async function(req, res, next) {
  var password = req.body.password;
  var contents_id = req.body.contents_id;
  var ret = await db.pwConfirm(password, contents_id);
  res.json(ret);
}));

router.post('/contents/anonym/edit', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var password = req.body.password;
  var title = req.body.title;
  var contents_text = req.body.contents_text;
  var tag_text = req.body.tags;
  var ret = await db.editAnonymContent(contents_id, password, title, contents_text, tag_text);
  res.json(ret);
}));

router.post('/contents/anonym/delete', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var ret = await db.deleteAnonymContent(contents_id);
  res.json(ret);
}));

router.post('/detail', asyncMiddleware(async function(req, res, next) {
 var contents_id = req.body.contents_id;
 var board_id = req.body.board_id;
 var ret = await db.showDetail(contents_id, board_id);
 res.json(ret);
}));

router.post('/detail/anonym', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var ret = await db.showAnonymDetail(contents_id);
  res.json(ret);
}));

router.post('/comments/free/load', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var ret = await db.loadFreeComment(contents_id);
  res.json(ret);
}));

router.post('/comments/free', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var user_id = req.body.user_id;
  var comment_text = req.body.comment_text;
  var ret = await db.newFreeComment(contents_id, user_id, comment_text);
  res.json(ret);
}));

router.post('/comments/free/edit', asyncMiddleware(async function(req, res, next) {
  var comment_id = req.body.comment_id;
  var user_id = req.body.user_id;
  var comment_text = req.body.comment_text;
  var ret = await db.editFreeComment(comment_id, user_id, comment_text);
  res.json(ret);
}));

router.post('/comments/free/delete', asyncMiddleware(async function(req, res, next) {
  var comment_id = req.body.comment_id;
  var user_id = req.body.user_id;
  var ret = await db.deleteFreeComment(comment_id, user_id);
  res.json(ret);
}));

router.post('/comments/prob/load', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var ret = await db.loadProbComment(contents_id);
  res.json(ret);
}));

router.post('/comments/prob', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var user_id = req.body.user_id;
  var comment_text = req.body.comment_text;
  var title = req.body.title;
  var ret = await db.newProbComment(contents_id, user_id, comment_text, title);
  res.json(ret);
}));

router.post('/comments/prob/delete', asyncMiddleware(async function(req, res, next) {
  var comment_id = req.body.comment_id;
  var user_id = req.body.user_id;
  var ret = await db.deleteProbComment(comment_id, user_id);
  res.json(ret);
}));

router.post('/comments/anonym/load', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var ret = await db.loadAnonymComment(contents_id);
  res.json(ret);
}));

router.post('/comments/anonym', asyncMiddleware(async function(req, res, next) {
  var contents_id = req.body.contents_id;
  var user_name = req.body.user_name;
  var comment_text = req.body.comment_text;
  var password = req.body.password;
  var ret = await db.newAnonymComment(contents_id, user_name, comment_text, password);
  res.json(ret);
}));

router.post('/comments/anonym/delete', asyncMiddleware(async function(req, res, next) {
  var comment_id = req.body.comment_id;
  var ret = await db.deleteAnonymComment(comment_id);
  res.json(ret);
}));

router.post('/comments/anonym/confirm', asyncMiddleware(async function(req, res, next) {
  var password = req.body.password;
  var comments_id = req.body.comments_id;
  var ret = await db.pwAnonymConfirm(password, comments_id);
  res.json(ret);
}))

module.exports = router;
