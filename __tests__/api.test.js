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
                expect(Object.keys(body[key]).length).toBe(3)              
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
