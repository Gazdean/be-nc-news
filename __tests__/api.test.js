const db = require('../db/connection');
const data = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const request = require("supertest");
const app = require('../db/app');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe.only('GET /api/topics', () => {
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
    test('reponds with a status code 404 and the messages invaid path', () => {
        return request(app)
        .get('/api/notapath')
        .expect(404)
        .then(({ body }) => {
            expect(body.mess).toBe('not found');
            });
    })
})