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

    static async getNewsDetail(newsId) {
        let key = `:football_api:news:id_${newsId}`;
        let resCached = await _findCachedByKey(key);
        if(resCached) {
            return resCached;
        }
        let resDb = await _findDbById(newsId);
        if(resDb) {
            redisCache.set(key, resDb, {ttl: 1800}); // 30 mins
            return resDb;
        }
        return null;

    }

    static async getNewsBy(params) {
        let _type = params.type? params.type : '';
        let _active = params.is_active? params.is_active: '';
        let _language = params.language? params.language: '';
        let _layout_type = params.layout_type? params.layout_type: '';
        let _object_type = params.object_type? params.object_type : '';
        let _object_id = params.object_id? params.object_id : '';
        let _term_id = params.term_id? params.term_id : '';
        let _order_by = '';
        if (params.order_by && params.order) {
            let _order = params.order === 'ascending' ? 'asc' : 'desc';
            _order_by = `${params.order_by}_${_order}`;
        } else {
            _order_by = `created_at_DESC`;
        }
        let _per_page = (params.per_page)? params.per_page : 10;
        let _page = (params.page)? parseInt(params.page) : 1;
        let key = `:football_api:list_news:_type${_type}_active${_active}_language${_language}`
        key += `_layout_type${_layout_type}_object_type${_object_type}_object_id${_object_id}_term_id${_term_id}_order_by${_order_by}_per_page${_per_page}_page${_page}`;
        let resCached = await _findCachedByKey(key);
        if(resCached) {
            return resCached;
        }
        let resDb = await _getNewsBy(params);
        if(resDb) {
            let _ttl = _page == 1? 180 : 600;
            redisCache.set(key, resDb, {ttl: _ttl}); // 10 mins
            return resDb;
        }
        return null;
    }
}

const _findDbById = async (newsId) => {
    let conn = db.getDb();
    let sql =  `SELECT * FROM news__news WHERE id = ${newsId} LIMIT 1`;
    return new Promise((resolve, reject) => {
        conn.query(sql, async (err, results) => {
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

const _getNewsBy = async (params) => {
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
    let limit = ` LIMIT ${(page-1)*per_page}, ${per_page} `;
    sql += ` ${where} ${order_by} ${limit} `;
    return new Promise((resolve, reject) => {
        conn.query(sql, async (err, results) => {
            let data = null;
            if(results) {
                let n = results.length;
                for(let i = 0; i < n; i++) {
                    results[i]['created_at'] = Date.parse(`${results[i]['created_at']}`)/1000 - 25200; // GMT+7;
                }
                data = results;
            }
            resolve(data);
        });
    });
}

module.exports = NewsRepository;