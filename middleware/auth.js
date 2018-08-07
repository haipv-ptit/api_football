'use strict';
const UserRepository = require('../app/user/UserRepository');

module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    let access_token = req.get('Authorization');

    if (access_token === undefined) {
        return res.status(401).send(JSON.stringify({}));
    }
    access_token = access_token.replace('Bearer ', '');
    let repository = new UserRepository();
    repository.validateAccessToken(access_token)
    .then(function(data) {
        if (!data || !data.user_id) {
            return res.status(403).send(JSON.stringify({}));
        }
        req.user_id = data.user_id;
        return next();
    }).catch(function() {
        return res.status(403).send(JSON.stringify({}));
    });
};
