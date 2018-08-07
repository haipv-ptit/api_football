var express = require('express');
var router = express.Router();
var CommentRepository = require('./CommentRepository');
var auth = require('../../middleware/auth');

router.get('/', function(req, res, next) {
	let repository = new CommentRepository();
	repository.getComments(req.query).then(results => {
		res.json({'data': results});
	});
});

router.post('/', auth, function(req, res, next) {
	let content = req.body.content? req.body.content : '';
	let object_type = req.body.object_type? req.body.object_type : '';
	let object_id = req.body.object_id? req.body.object_id : '';
	let sofa_id = req.body.sofa_id? req.body.sofa_id : '';
	if(content.trim() === '' || !object_type) {
		return res.status(400).send(JSON.stringify({'errors': true, 'message': 'Tham số truyền vào không hợp lệ'}));
	}
	let repository = new CommentRepository();
	repository.saveComment(req.user_id, content, object_type, object_id, sofa_id).then(results => {
		res.json({'data': results});
	});
});

module.exports = router;