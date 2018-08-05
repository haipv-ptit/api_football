'use strict';
const BASE_MEDIA_URL = 'https://footballlivenews.com';

module.exports = {
    formatComments: (results) => {
        if(!results) {
            return [];
        }
        let n = results.length;
        let data = [];
        for(let i = 0; i < n; i++) {
            let avatar_path = (results[i]['path'])? `${BASE_MEDIA_URL}${results[i]['path']}` : '';
            let small_path = avatar_path;
            let medium_path = avatar_path;
            if(small_path != '') {
                small_path = small_path.replace(`.${results[i]['extension']}`, `_smallThumb.${results[i]['extension']}`);
            }
            if(medium_path != '') {
                medium_path = medium_path.replace(`.${results[i]['extension']}`, `_mediumThumb.${results[i]['extension']}`);
            }
            data.push({
                "id": results[i]['id'],
                "user_id": results[i]['user_id'],
                "content": results[i]['content'],
                "object_type": results[i]['object_type'],
                "object_id": results[i]['object_id'],
                "sofa_id": results[i]['sofa_id'],
                "created_at": Date.parse(`${results[i]['created_at']}`)/1000 - 25200, // GMT+7
                "user": {
                    "id": results[i]['user_id'],
                    "email": results[i]['email'],
                    "first_name": results[i]['first_name'],
                    "last_name": results[i]['last_name'],
                    "fullname": `${results[i]['first_name']} ${results[i]['last_name']}`,
                },
                "user_profile": {
                    "address": results[i]['address'],
                    "avatar": {
                        "path": avatar_path,
                        "small_thumb": small_path,
                        "medium_thumb": medium_path
                    }
                }
            });
        }
        return data;
    }
}