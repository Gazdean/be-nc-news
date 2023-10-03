const db = require('../db/connection');
const data = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const request = require("supertest");
const app = require('../db/app');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('Responds with status code 200 and with response an object of all topics', () => {
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
        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug', expect.any(String));            
            expect(topic).toHaveProperty('description', expect.any(String));            
        });
        });
     }); 
    test('reponds with a status code 404 and the messages invaid path', () => {
        return request(app)
        .get('/api/notapath')
        .expect(404)
        .then(({ body }) => {
            expect(body).toEqual({mess: 'not found'});
            });
    })
})
describe('GET /api/articles/:article_id', () => {
    test('when queried with an article id, Responds with status code 200 and with response object with correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveProperty('article');
            });
    })
})