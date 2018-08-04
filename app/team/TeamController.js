var express = require('express');
var router = express.Router();
var TeamRepository = require('./TeamRepository');

router.get('/season_league', function(req, res, next) {
	if (!req.query.team_id && !req.query.season_id) {
		return res.json({'message': 'Thiếu tham số team_id và season_id', 'errors': true});
	}
	let repository = new TeamRepository();
	repository.getSeasonLeague(req.query.team_id, req.query.season_id).then(results => {
		res.json({'leagueSeasons': results});
	});
});

module.exports = router;