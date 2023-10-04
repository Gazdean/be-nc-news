\c nc_news_test  

INSERT INTO comments (body, author, article_id)
VALUES ('jhdfgjhdsagfjf', 'butter_bridge', 2)
RETURNING *;