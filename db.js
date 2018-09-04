const mysql = require('mysql');
const config = require('./config');

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
