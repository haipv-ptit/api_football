'use strict';
const db = require('../../db');

class TeamRepository {

    async getSeasonLeague(team_id, season_id) {
        let conn = db.getDb();
        let sql =  `SELECT t3.id AS leage_id, t3.name AS name, t3.logo_src AS logo_src, t3.sofa_id AS league_sofa_id, t2.sofa_id AS season_sofa_id `
        + ` FROM football.fbc__teamleagueseasons AS t1 ` 
        + ` INNER JOIN football.fbc__league_seasons AS t2 ON t1.league_season_id = t2.id `
        + ` INNER JOIN football.fbc__leagues AS t3 ON t2.league_id = t3.id `
        + ` WHERE t1.team_id = ${team_id} AND t2.season_id = ${season_id} ORDER BY t1.priority DESC `;

        return await new Promise(resolve => {
            conn.query(sql, (err, results) => {
                if(err) {
                    resolve(null);
                    return;
                }
                if(results) {
                    let n = results.length;
                    let data = [];
                    for(let i = 0; i < n; i++) {
                        data.push({
                            "sofa_id": results[i]['season_sofa_id'],
                            "league": {
                                "id": results[i]['leage_id'],
                                "name": results[i]['name'],
                                "logo_src": results[i]['logo_src'],
                                "sofa_id": results[i]['league_sofa_id'],
                            }
                        });
                    }
                    resolve(data);
                }
            });
        });
    }
}

module.exports = TeamRepository;