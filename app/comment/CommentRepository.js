'use strict';
const db = require('../../db');
const commentTransfomer = require('./CommentTransformer');

class CommentRepository {

    async saveComment(user_id, content, object_type, object_id, sofa_id) {
        let conn = db.getDb();
        let created_at = conn.escape(new Date());
        let sql = `INSERT INTO football.fbc__comments (user_id, content, object_type, object_id, sofa_id, created_at, updated_at) `
        + ` VALUES (${user_id}, '${content}', '${object_type}', ${object_id}, ${sofa_id}, ${created_at}, ${created_at} )`;

        return await new Promise(resolve => {
            conn.query(sql, (err, result) => {
                if(err) {
                    resolve(null);
                    return;
                }
                resolve({"id": result.insertId});
            });
        });
    }

    async getComments(params) {
        let conn = db.getDb();
        let sql =  `SELECT t1.id, t1.content, t1.created_at, t1.object_id, t1.object_type, t1.user_id, t1.sofa_id, `
        + ` t2.email, t2.first_name, t2.last_name, t3.address, `
        + ` t5.path, t5.extension `
        + ` FROM football.fbc__comments AS t1 ` 
        + ` INNER JOIN football.users AS t2 ON t1.user_id = t2.id `
        + ` INNER JOIN football.fbc__user_profile AS t3 ON t3.user_id = t1.user_id `
        + ` LEFT JOIN football.media__imageables AS t4 ON (t4.imageable_id = t3.id AND t4.zone = 'avatar') `
        + ` LEFT JOIN football.media__files AS t5 ON t5.id = t4.file_id `;

        let where = ` WHERE 1 `;
        let order_by = ``;

        if(params.sofa_id) {
            where += ` AND t1.sofa_id = ${params.sofa_id} `;
        }
        if(params.object_id) {
            where += ` AND t1.object_id = ${params.object_id} `;
        }
        if(params.object_type) {
            where += ` AND t1.object_type = '${params.object_type}' `;
        }
        // Order by
        if (params.order_by && params.order) {
            let _order = params.order === 'ascending' ? 'ASC' : 'DESC';
            order_by = ` ORDER BY t1.${params.order_by} ${_order} `;
        } else {
            order_by = ` ORDER BY t1.created_at DESC `;
        }
        // Paging
        let per_page = (params.per_page)? params.per_page : 10;
        let page = (params.page)? params.page : 1;
        let limit = ` LIMIT ${1+(page-1)*per_page}, ${per_page} `;
        sql += ` ${where} ${order_by} ${limit} `;


        return await new Promise(resolve => {
            conn.query(sql, (err, results) => {
                if(err) {
                    resolve(null);
                    return;
                }
                resolve(commentTransfomer.formatComments(results));
            });
        });
    }
}

module.exports = CommentRepository;