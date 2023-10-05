\c nc_news_test  

UPDATE articles
SET
votes = 10
WHERE article_id = 1;

SELECT * FROM articles