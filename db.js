const mysql = require('mysql');

var _dbConn;

module.exports = {
    connectToDb: () => {
        _dbConn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "football"
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
