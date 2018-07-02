const db = require('../../db');

module.exports = {
    getNewsDetail: (newsId, callback) => {
        let conn = db.getDb();
        let sql = 'SELECT * FROM news__news WHERE id = '+newsId;
        conn.query(sql, (err, results)=> {
            if(err) {
                callback(null);
            } else {
                let data = null;
                if(results && results.length > 0) {
                    data = results[0];
                }
                callback(data);
            }
        })
    }
}
