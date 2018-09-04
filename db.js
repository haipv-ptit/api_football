const mysql = require('mysql');

const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-redis-store');

global.redisCache = cacheManager.caching({
    store: redisStore,
    host: config.redis.host, // default value
    port: config.redis.port, // default value
    auth_pass: config.redis.pass,
    db: config.redis.db,
    ttl: config.redis.ttl
});

const redisClient = redisCache.store.getClient();
redisClient.on('error', (error) => {
    // handle error here
    console.log(error);
});

global._findCachedByKey = async (key) => {
    return new Promise( (resolve, reject) => {
        redisCache.get(key, async (err, data) => {
            if(data) {
                resolve(data);
            } else {
                resolve(null);
            }
        });
    });
};

var _dbConn;

module.exports = {
    connectToDb: () => {
        _dbConn = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database
        });
        _dbConn.connect((err) => {
            if(err) {
                console.log(err);
                return false;
            }
            console.log("DB Connected!");
            return true;
        });
    },

    getDb: () => {
        return _dbConn;
    }
}
