const { expect } = require('chai');
const request = require('supertest');
const app = require('../../app');
const initDb = require('../../src/config/initDB');
const pool = require('../../src/config/db');

describe('Integration: aquatic-resources endpoints', function() {
  this.timeout(20000);

  before(async function() {
    this.timeout(30000);
    await initDb();
  });

  after(async () => {
    try {
      // Clean up the table after tests and keep the pool open for other files
      await pool.query('DELETE FROM aquatic_resources');
    } catch (err) {
      console.warn('Error during DB teardown:', err.message);
    }
  });

  it('GET /api/swim returns health status', async () => {
    const res = await request(app).get('/api/swim').expect(200);
    expect(res.body).to.have.property('status');
  });

  it('GET /api/aquatic-resources returns the seeded array', async () => {
    const res = await request(app).get('/api/aquatic-resources').expect(200);
    expect(res.body).to.be.an('array');

    expect(res.body.length).to.equal(2);
  });

  it('POST /api/aquatic-resources creates a resource', async () => {
    const payload = {
      title: 'Test Resource',
      resource_type: 'Video',
      difficulty_level: 1,
      description: 'Test description',
      url: 'https://example.com'
    };

    const postRes = await request(app).post('/api/aquatic-resources').send(payload).expect(201);
    expect(postRes.body).to.include({
      title: payload.title,
      resource_type: payload.resource_type,
      difficulty_level: payload.difficulty_level,
      description: payload.description,
      url: payload.url
    });
    expect(postRes.body).to.have.property('id');

    const getRes = await request(app).get('/api/aquatic-resources').expect(200);
    expect(getRes.body).to.be.an('array');
    // Changed from 1 to 3 (2 seeds + 1 new item)
    expect(getRes.body.length).to.equal(3);
    
    // Verify the new item is actually there
    const item = getRes.body.find(r => r.title === 'Test Resource');
    expect(item).to.exist;
    expect(item.resource_type).to.equal('Video');
  });
});