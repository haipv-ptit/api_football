const db = require('../../db');

const REPOSITORY_TEMPLATE = '<html>'+
'	<head>'+
'		<meta charset="utf-8">'+
'		<meta name="viewport" content="width=device-width, inital-scale=1">'+
'		<style type="text/css">'+
'			body {'+
'				margin: 0 !important;'+
'				padding: 0 !important;'+
'               font-family: serif !important;'+
'				font-size: 18px !important;'+
'               color: #1f1f1f!important;'+
'			}'+
'			img {'+
'				max-width: 100% !important;'+
'			}'+
'		</style>'+
'	</head>'+
'	<body>'+
'		{$content}'+
'	</body>'+
'</html>';

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
                    data['created_at'] = Date.parse(data['created_at'])/1000;
                    let content = data['content'];
                    if(content !== null && content !== "") {
                        data['content'] = REPOSITORY_TEMPLATE.replace("{$content}", content);
                    }
                }
                callback(data);
            }
        })
    }
}
