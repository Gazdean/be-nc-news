\c nc_news_test  


SELECT * FROM articles
WHERE article_id = 1;


SELECT count(comment_id) AS Comment_count
FROM comments
WHERE article_id = 1;

SELECT articles.*, COUNT(comment_id) AS commment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = 1
GROUP BY articles.article_id