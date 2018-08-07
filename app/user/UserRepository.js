'use strict';

const db = require('../../db');

class UserRepository {

    async validateAccessToken(access_token) {
        let conn = db.getDb();
        let sql =  `SELECT t.user_id `
        + ` FROM football.user_tokens AS t ` 
        + ` WHERE t.access_token = '${access_token}' LIMIT 1 `;

        return await new Promise(resolve => {
            conn.query(sql, (err, results) => {
                if(err) {
                    resolve(null);
                    return;
                }
                if(results) {
                    let n = results.length;
                    if(n >= 1) {
                        resolve({"user_id": results[0]['user_id']});
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
}

module.exports = UserRepository;