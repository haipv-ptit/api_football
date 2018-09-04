'use strict';
require('dotenv').config()

const config = {
    mysql: {
        host: process.env.DB_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
    }
};

module.exports = config;