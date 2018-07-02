var express = require('express');
var router = express.Router();
var repository = require('./NewsRepository');

router.get('/get/:id', function(req, res, next) {
	repository.getNewsDetail(req.params.id, (result)=> {
		if(result) {
			result['created_at'] = Date.parse(result['created_at'])/1000;
			let data = {'data': result};
			res.json(data);
		} else {
			res.json(null);
		}
	});
});

module.exports = router;