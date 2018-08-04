var express = require('express');
var router = express.Router();
var AppRepository = require('./AppRepository');

router.get('/config', function(req, res, next) {
	if (!req.query.app_key && !req.query.app_id) {
		return res.json({'message': 'Chưa có tham số ứng dụng (app_id hoặc app_key)', 'errors': true});
	}
	let repository = new AppRepository();
	let type = (req.query.app_key) ? 'key' : 'id';
	let id = (req.query.app_key) ? req.query.app_key : req.query.app_id;
	repository.getConfig(type, id).then(results => {
		res.json({'data': results});
	});
});

module.exports = router;