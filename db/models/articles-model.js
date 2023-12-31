const db = require('../connection')
const format = require('pg-format')

exports.fetchArticles = (topic) => {
    return db
    .query(`
        SELECT * FROM topics
        WHERE topics.slug = $1;
    `, [topic])
    .then((result) => {
        console.log(result.rows)
        if(topic && result.rows.length === 0) {
            console.log('here')
            return Promise.reject ({
                status: 404, message: 'topic doesnt exist'
            })
        } else {
        const value = []
        let whereString = ""
        if(topic) {
            whereString = `WHERE topic = $1`
            value.push(topic)
        }
        const query = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments. article_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            ${whereString}
            GROUP BY articles.article_id
            ORDER BY created_at DESC;`
        return db
        .query(query, value)
    }
    })
    .then((result)=> {
        return result.rows;
    })   
}

exports.fetchArticlesById = (article_id) => {
    return db
    .query(
        `SELECT articles.*, COUNT(comment_id) AS comment_count
         FROM articles
         LEFT JOIN comments ON articles.article_id = comments.article_id
         WHERE articles.article_id = $1
         GROUP BY articles.article_id`, [article_id]
    )
    .then((result) => {
        const { rows } = result
        if (rows.length === 0) {
            return Promise.reject({ 
                status: 404, message: 'article_id does not exist'
        })
        } else {
            return {article: result.rows[0]};
        }
    })   
};

exports.fetchAllArticleComments = (article_id) => {
    return db
    .query(
        `SELECT * FROM comments
         WHERE article_id = $1
         ORDER BY created_at DESC;`, [article_id])
    .then((result)=> {
        const { rows } = result
            return {comments: rows};  
    })   
};
exports.createArticleComment = (article_id, username, body) => {
    if(isNaN(article_id)) {
        return Promise.reject({
            status: 400, message: 'article_id must be a number'
        })
    }
    return db
    .query(
        `SELECT article_id FROM articles
         WHERE article_id = $1`, [article_id])
    .then((result)=> {
        const { rows } = result
        if (rows.length === 0) {
            return Promise.reject({ 
                status: 404, message: 'article_id does not exist'
        })
    }
    }
    ).then(() => {
    return db.query('SELECT username FROM users')
    }
    ).then((usernames) => {
        const users = usernames.rows
        let validUsername = false
        users.forEach((user) => {
        if(username === user.username) {
            return validUsername = true
        }
        }) 
        if (username === undefined || body === undefined) {
            return Promise.reject ({
                status: 400, message: 'both username and comment body is required'
            })
        } else if (typeof username !== 'string' || typeof body !== 'string') {
            return Promise.reject ({
                status: 400, message: 'invalid data type'
            })
        } else if (validUsername === false) {
            return Promise.reject ({
                status: 404, message: 'user name does not exist'
            })
        } else { 
            return db.query(`
            INSERT INTO comments(article_id, author, body)
            VALUES ($1, $2, $3)
            RETURNING *;`
            , [article_id, username, body])
            .then((result) => {
                return result.rows[0];
            })
        }  
    })
}
exports.updateArticleById =(votes_inc, article_id) => {  
       return db
       .query(
        `UPDATE articles
        SET
        votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `, [votes_inc, article_id]
       ) .then((result) => {
        return result.rows[0]
       })    
    }

exports.removeCommentById = (comment_id) => {
    return db
    .query(
        `DELETE FROM comments
            WHERE comment_id = $1
            RETURNING *;
        `, [comment_id]               
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ 
                status: 404, message: 'comment_id does not exist'
            })    
        } else
            return result.rows
    })
   
}
exports.fetchAllUsers = () => {
    return db
    .query(
        `SELECT *
         FROM users
         ` 
    )
    .then((result)=> {
        return result.rows;
    })   
}
