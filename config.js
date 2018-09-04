'use strict';
require('dotenv').config()

const config = {
    mysql: {
        host: process.env.DB_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: process.env.REDIS_TTL,
        pass: process.env.REDIS_PASS,
        database: process.env.REDIS_DB
    }
};

global.config = config;