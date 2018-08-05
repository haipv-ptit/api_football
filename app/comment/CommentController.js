var express = require('express');
var router = express.Router();
var CommentRepository = require('./CommentRepository');

router.get('/', function(req, res, next) {
	let repository = new CommentRepository();
	repository.getComments(req.query).then(results => {
		res.json({'data': results});
	});
});

module.exports = router;