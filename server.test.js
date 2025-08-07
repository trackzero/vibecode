const request = require('supertest');
const fs = require('fs');
const app = require('./server');

beforeEach(() => {
  fs.writeFileSync('data.json', JSON.stringify({ users: [], teams: [], accomplishments: [] }));
});

describe('Team Metrics API', () => {
  test('user can register, login, and create accomplishment', async () => {
    const reg = await request(app).post('/register').send({ email: 'u@example.com', password: 'pass', name: 'User' });
    expect(reg.status).toBe(200);
    const login = await request(app).post('/login').send({ email: 'u@example.com', password: 'pass' });
    const token = login.body.token;
    const acc = await request(app)
      .post('/accomplishments')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Complete project', type: 'Project' });
    expect(acc.status).toBe(200);
    const list = await request(app)
      .get('/accomplishments')
      .set('Authorization', `Bearer ${token}`);
    expect(list.body.length).toBe(1);
    expect(list.body[0].title).toBe('Complete project');
  });

  test('admin can list users', async () => {
    await request(app).post('/register').send({ email: 'a@example.com', password: 'pass', name: 'Admin', role: 'admin' });
    const login = await request(app).post('/login').send({ email: 'a@example.com', password: 'pass' });
    const token = login.body.token;
    const users = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);
    expect(users.body.length).toBe(1);
  });

  test('regular user cannot list users', async () => {
    await request(app).post('/register').send({ email: 'u2@example.com', password: 'pass', name: 'User2' });
    const login = await request(app).post('/login').send({ email: 'u2@example.com', password: 'pass' });
    const token = login.body.token;
    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
