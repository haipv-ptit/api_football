var express = require('express');
var router = express.Router();
var repository = require('./NewsRepository');

router.get('/get/:id', function(req, res, next) {
	repository.getNewsDetail(req.params.id, (result)=> {
		if(result) {
			let data = {'data': result};
			res.json(data);
		} else {
			res.json(null);
		}
	});
});

module.exports = router;