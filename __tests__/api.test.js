const db = require('../db/connection');
const data = require('../db/data/test-data');
const fs = require('fs/promises');
const seed = require('../db/seeds/seed');
const request = require("supertest");
const app = require('../db/app');
const endpoints = require('../endpoints.json')


beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('Responds with status code 200 and with response message of all topics', () => {
    return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveProperty('topics');
            });
    });  
    test("Data is in the correct format", () => {
        return request(app)
        .get('/api/topics')
        .then(({ body }) => {
        const topics = body.topics;

        expect(Array.isArray(topics)).toBe(true);

        topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string');
            expect(typeof topic.description).toBe('string');            
        });
        });
     }); 
})
describe('GET /api sends an object with all apis available', () => {
    test('responds with a status code of 200 and sends an object with all endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints);
        })
    })
    test('the response contains the correct keys and is of correct length', () => {
        return request(app)
        .get('/api')
        .then(({body}) => {
            for(const key in body) {
                expect(body[key]).toHaveProperty('description');
                expect(body[key]).toHaveProperty('queries');
                expect(body[key]).toHaveProperty('exampleResponse');
                expect(Object.keys(body[key]).length).toBe(4)              
            }   
        })
    })
   })
describe('GET /api/articles', () => {
    test('Responds with status code 200 and with response object with correct properties', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            const articles = body.articles

            expect(Array.isArray(articles)).toBe(true);
            expect(articles.length).toBe(13)
            
            articles.forEach((article) => {
                expect(article).toMatchObject({ 
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
                expect(article).not.toHaveProperty("body")         
            });
        })
    })
    test('the articles are sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            const articles = body.articles
            expect(articles).toBeSortedBy('created_at', {descending: true})
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('when queried with an article id, Responds with status code 200 and with response object with correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({ 
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })          
        });
    })
    test('when client uses a valid but non existant article_id responds with status code 404 and an error message', () => {
        return request(app)
          .get('/api/articles/99999')
          .expect(404)        
          .then(({body}) => {
            expect(body.message).toBe('article_id does not exist');
          });
      });
    test("when client uses an invalid article_id responds with status code 400 and an error message ", () => {
        return request(app)
        .get("/api/articles/notANumber")
        .expect(400)
        .then(({ body }) => {
        expect(body.message).toBe('bad request');
        });
    })
    test('the response objects has a comment_count property, which is the total number of comments for that article', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            const commentCount = body.article.comment_count
            expect(commentCount).toBe("11")
            expect(body.article).toMatchObject({ 
                article_id: 1,
                comment_count: "11",
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })                 
        });
    })
})
describe('GET /api/articles/:article_id/comments', () => {
    test('when queried with a valid article id, Responds with status code 200 and with response object with correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            const comments = body.comments
            comments.forEach((comment) => {
                expect(Object.keys(comment).length).toBe(6) 
                expect(comment).toMatchObject({ 
                    article_id: 1,
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                })
            })          
        });
    })
    test('the most recent comments are served first ', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            const comments = body.comments
            expect(comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('when client uses a valid but non existant article_id responds with status code 404 and an error message', () => {
        return request(app)
          .get('/api/articles/99999/comments')
          .expect(404)        
          .then(({body}) => {
            expect(body.message).toBe('article_id does not exist');
          });
      });
    test("when client uses an invalid article_id responds with status code 400 and an error message ", () => {
        return request(app)
        .get("/api/articles/notANumber/comments")
        .expect(400)
        .then(({ body }) => {
        expect(body.message).toBe('bad request');
        });
    })
    test('when queried with a valid article id, but article has no comments it responds with status code 200 and with responds with empty array', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            const comments = body.comments
            expect(comments.length).toBe(0)               
        });
    })
})
describe('POST /api/articles/:article_id/comments', () => {
    test("returns the new comment that has been created along with 201 status", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            username: "butter_bridge",
            body: "well well well"
        })
        .expect(201)
        .then(({body}) => {    
            const comment = body.comment;
            expect(comment).toMatchObject({ 
                body: "well well well",
                votes: expect.any(Number),
                article_id: 2,
                author: "butter_bridge",
                comment_id:  expect.any(Number)
            });
        });
    })
    test('if client doesnt supply required fields return status code 400 and a helpful error messge', () =>{
        return request(app)
        .post('/api/articles/2/comments')
        .send({
        username: "butter_bridge"     
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('both username and comment body is required')
        })
    })
    test('if client supplies extra fields they are ignored', () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            username: "butter_bridge",
            body: "well well well",
            extrsProp: "extra value"
        })
        .expect(201)
        .then(({body}) => {       
            const comment = body.comment;
            expect(comment).toMatchObject({ 
                body: "well well well",
                votes: expect.any(Number),
                article_id: 2,
                author: "butter_bridge",
                comment_id:  expect.any(Number)
            });
        });
    }) 
    test('if user name doesnt exist in database return error code 404 and helpful message', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
        username: 'herbert_sherbert', 
        body: 'hello great'
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('user name does not exist')
        })
    })
    test('if client sends incorrect data in either property sends a 400 error message and helpful message',() => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
        username: 9, 
        body: 9
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('invalid data type')
        })
    })
    test("when client uses an invalid article_id responds with status code 400 and an error message ", () => {
        return request(app)
        .post("/api/articles/notANumber/comments")
        .expect(400)
        .then(({ body }) => {
        expect(body.message).toBe('article_id must be a number');
        });
    })
})
describe('error handling for all invalid paths', () => {
    test('reponds with a status code 404 and the message invaid path', () => {
        return request(app)
        .get('/notapath')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('not found')
            });
    })
})
describe('PATCH /api/articles/:article_id', () => {
    test("when passed a positive vote_inc value it returns an updated article object along with 201 status", () => {
        return request(app)
        .patch("/api/articles/1")
        .send( {inc_votes: 10} )
        .expect(201)
        .then(({body}) => {    
            const article = body.article;
            expect(article).toMatchObject({ 
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: 110,
                article_img_url: expect.any(String)
            });
        });
    })
    test("when passed a negative vote_inc value it returns an updated article object along with 201 status", () => {
        return request(app)
        .patch("/api/articles/1")
        .send( {inc_votes: -10} )
        .expect(201)
        .then(({body}) => {    
            const article = body.article;
            expect(article).toMatchObject({ 
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: 90,
                article_img_url: expect.any(String)
            });
        });
    })
    test("'if client supplies extra fields they are ignored'", () => {
        return request(app)
        .patch("/api/articles/1")
        .send( {
            inc_votes: 10,
            extraProp: "value"
                } )
        .expect(201)
        .then(({body}) => {    
            const article = body.article;
            expect(article).toMatchObject({ 
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: 110,
                article_img_url: expect.any(String)
            });
        });
    })
    test('if client sends incorrect data sends a 400 error message and helpful message',() => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: "notANumber"})
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('bad request')
        })
    }) 
     test("when client uses an invalid article_id responds with status code 400 and an error message ", () => {
         return request(app)
         .patch("/api/articles/notANumber")
         .send({inc_votes: -10})
         .expect(400)
         .then(({ body }) => {
         expect(body.message).toBe('bad request');
         });
    })
    test('when client uses a valid but non existant article_id responds with status code 404 and an error message', () => {
        return request(app)
          .patch('/api/articles/99999')
          .send({inc_votes: -10})
          .expect(404)        
          .then(({body}) => {
            expect(body.message).toBe('article_id does not exist');
          });
      });

})
describe('GET /api/users', () => {
    test('Responds with status code 200 and with response message of all users', () => {
    return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveProperty('users');
            });
    });  
    test("Data is in the correct format", () => {
        return request(app)
        .get('/api/users')
        .then(({ body }) => {
        const users = body.users;

        expect(Array.isArray(users)).toBe(true);
            users.forEach((user) => {
            expect(Object.keys(user).length).toBe(3) 
            expect(typeof user.username).toBe('string');
            expect(typeof user.name).toBe('string');            
            expect(typeof user.avatar_url).toBe('string');            
        });
        });
     }); 
})
describe('DELETE /api/comments/:comment_id', () => {
    test('when client uses a valid but non existant comment_id responds with status code 404 and an error message', () => {
        return request(app)
          .delete('/api/comments/99999')
          .expect(404)        
          .then(({body}) => {
            expect(body.message).toBe('comment_id does not exist');
          });
      });
    test("when client uses an invalid comment_id responds with status code 400 and an error message ", () => {
        return request(app)
        .delete("/api/comments/notANumber")
        .expect(400)
        .then(({ body }) => {
        expect(body.message).toBe('bad request');
        });
    })
})