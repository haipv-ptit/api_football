'use strict';
const db = require('../../db');

const REPOSITORY_TEMPLATE = '<html>'+
'	<head>'+
'		<meta charset="utf-8">'+
'		<meta name="viewport" content="width=device-width, inital-scale=1">'+
'		<style type="text/css">'+
'			body {'+
'				margin: 0 !important;'+
'				padding: 0 !important;'+
'               font-family: arial !important;'+
'				font-size: 14px !important;'+
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

class NewsRepository {

    async getNewsDetail(newsId) {
        let conn = db.getDb();
        let sql =  `SELECT * FROM news__news WHERE id = ${newsId} LIMIT 1`;
        return await new Promise(resolve => {
            conn.query(sql, (err, results) => {
                let data = null;
                if(results && results.length > 0) {
                    data = results[0];
                    data['created_at'] = Date.parse(`${data['created_at']}`)/1000 - 25200; // GMT+7
                    let content = data['content'];
                    if(content !== null && content !== "") {
                        data['content'] = REPOSITORY_TEMPLATE.replace("{$content}", content);
                    }
                }
                resolve(data);
            });
        });
    }
}

module.exports = NewsRepository;