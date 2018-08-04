var express = require('express');
var router = express.Router();
const NewsRepository = require('./NewsRepository');

router.get('/get/:id', function(req, res, next) {
	let repository = new NewsRepository();
	repository.getNewsDetail(req.params.id).then(result => {
		res.json({'data': result});
	});
});

module.exports = router;