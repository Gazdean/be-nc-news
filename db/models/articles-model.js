const db = require('../connection')

exports.fetchArticles = () => {
    
    return db
    .query(
        `SELECT articles.article_id, articles.author, articles.title, articles.topic,  articles.created_at, articles.votes, articles.article_img_url, COUNT(comments. article_id) AS comment_count
         FROM articles 
         LEFT JOIN comments ON comments.article_id = articles.article_id
         GROUP BY articles.article_id
         ORDER BY created_at DESC;`  
    )
    .then((result)=> {
        return result.rows;
    })   
}

exports.fetchArticlesById = (article_id) => {
    return db
    .query(
        `SELECT * FROM articles
         WHERE article_id = $1`, [article_id]
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
// exports.updateArticleById =() => {

// }