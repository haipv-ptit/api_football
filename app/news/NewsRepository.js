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

    getNewsDetail(newsId, callback) {
        let conn = db.getDb();
        let sql =  `SELECT * FROM news__news WHERE id = ${newsId} LIMIT 1`;
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
            callback(data);
        });
    }

    getNewsBy(params, callback) {
        let conn = db.getDb();
        let where = ` WHERE 1 `;
        let order_by = ``;
        let sql =  `SELECT t1.id, vid, type, title, thumbnail, description, source, url, order_time, layout_type, object_type, t1.created_at FROM news__news AS t1 `;
        if(params.type) {
            where += ` AND type = '${params.type}' `;
        }
        if(params.is_active) {
            where += ` AND is_active = ${params.is_active} `;
        }
        if(params.language) {
            where += ` AND language IN ('all', '${params.language}') `;
        }
        if(params.layout_type) {
            where += ` AND layout_type = ${params.layout_type} `;
        }
        if(params.sofa_id) {
            //TODO
        } else {
            if(params.object_type) {
                where += ` AND object_type = '${params.object_type}' `;
            }
            if(params.object_id) {
                where += ` AND object_id = ${params.object_id} `;
            }
        }
        // Category
        if(params.term_id) {
            sql += ` INNER JOIN taxonomy__termables t2 ON t1.id = t2.termable_id `;
            where += ` AND t2.term_id = ${params.term_id} `;
        }
        // Order by
        if (params.order_by && params.order) {
            let _order = params.order === 'ascending' ? 'asc' : 'desc';
            order_by = ` ORDER BY t1.${params.order_by} ${_order} `;
        } else {
            order_by = ` ORDER BY t1.created_at DESC `;
        }
        // Paging
        let per_page = (params.per_page)? params.per_page : 10;
        let page = (params.page)? params.page : 1;
        let limit = ` LIMIT ${1+(page-1)*per_page}, ${per_page} `;
        sql += ` ${where} ${order_by} ${limit} `;
        //console.log(sql);
        conn.query(sql, (err, results) => {
            let data = null;
            if(results) {
                let n = results.length;
                for(let i = 0; i < n; i++) {
                    results[i]['created_at'] = Date.parse(`${results[i]['created_at']}`)/1000 - 25200; // GMT+7;
                }
                data = results;
            }
            callback(data);
        });
    }
}

module.exports = NewsRepository;