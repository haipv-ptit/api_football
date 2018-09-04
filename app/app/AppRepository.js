'use strict';
const db = require('../../db');

class AppRepository {

    static async getConfigByKey(app_key) {
        let key = `:football_api:app_config:app_key_${app_key}`; 
        let resCached = await _findCachedByKey(key);
        if(resCached) {
            return resCached;
        }
        let resDb = await _getConfigByKey(app_key);
        if(resDb) {
            redisCache.set(key, resDb, {ttl: 3600}); // 60 mins
            return resDb;
        }
        return null;
    }

    static async getConfigById(app_id) {
        let key = `:football_api:app_config:app_id_${app_id}`; 
        let resCached = await _findCachedByKey(key);
        if(resCached) {
            return resCached;
        }
        let resDb = await _getConfigById(app_id);
        if(resDb) {
            redisCache.set(key, resDb, {ttl: 3600}); // 60 mins
            return resDb;
        }
        return null;
    }

    static async getConfig(type, id) {
        if(type === 'key') {
            return await this.getConfigByKey(id);
        }
        return await this.getConfigById(id);
    }
}

const _getConfigByKey = async (app_key) => {
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

const _getConfigById = async (app_id) => {
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

module.exports = AppRepository;