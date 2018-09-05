var express = require('express');
var router = express.Router();
var CommentRepository = require('./CommentRepository');
var auth = require('../../middleware/auth');

router.get('/', function(req, res, next) {
	CommentRepository.getComments(req.query).then(results => {
		res.json({'data': results});
	});
});

router.post('/', auth, function(req, res, next) {
	let content = req.body.content? req.body.content : '';
	let object_type = req.body.object_type? req.body.object_type : '';
	let object_id = req.body.object_id? req.body.object_id : 0;
	let sofa_id = req.body.sofa_id? req.body.sofa_id : 0;
	if(content.trim() === '' || !object_type) {
		return res.status(400).json({errors: true, message: 'Tham số truyền vào không hợp lệ'});
	}
	let repository = new CommentRepository();
	repository.saveComment(req.user_id, content, object_type, object_id, sofa_id).then(results => {
		res.json({'data': results});
	});
});

router.post('/report', auth, function(req, res, next) {
	let content = req.body.content? req.body.content : '';
	let comment_id = req.body.comment_id? req.body.comment_id : 0;
	if(content.trim() === '' || comment_id <= 0) {
		return res.status(400).json({errors: true, message: 'Tham số truyền vào không hợp lệ'});
	}
	let repository = new CommentRepository();
	repository.reportComment(req.user_id, content, comment_id).then(results => {
		res.json({'data': results});
	});
});

module.exports = router;