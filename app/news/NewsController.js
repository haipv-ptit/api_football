var express = require('express');
var router = express.Router();
var NewsRepository = require('./NewsRepository');

router.get('/get/:id', function(req, res, next) {
	NewsRepository.getNewsDetail(req.params.id).then(result => {
		res.json({'data': result});
	});
});

router.get('/', function(req, res, next) {
	NewsRepository.getNewsBy(req.query).then(result => {
		res.json({'data': result});
	});
});

module.exports = router;