'use strict';
const db = require('../../db');

class AppRepository {

    async getConfigByKey(app_key) {
        let conn = db.getDb();
        let sql =  `SELECT t1.id, t1.app_id, t1.key, t1.value FROM fbc__appconfigs AS t1 INNER JOIN fbc__appclients AS t2 ON t1.app_id = t2.id WHERE t2.app_key = '${app_key}'`;
        return await new Promise(resolve => {
            conn.query(sql, (err, results) => {
                if(err) {
                    resolve(null);
                    return;
                }
                if(results) {
                    resolve(results);
                }
            });
        });
    }

    async getConfigById(app_id) {
        let conn = db.getDb();
        let sql =  `SELECT t.id, t.app_id, t.key, t.value FROM fbc__appconfigs AS t WHERE t.app_id = ${app_id}`;
        return await new Promise(resolve => {
            conn.query(sql, (err, results) => {
                if(err) {
                    resolve(null);
                    return;
                }
                if(results) {
                    resolve(results);
                }
            });
        });
    }

    async getConfig(type, id) {
        if(type === 'key') {
            return await this.getConfigByKey(id);
        }
        return await this.getConfigById(id);
    }
}

module.exports = AppRepository;