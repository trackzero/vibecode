const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { readData, writeData } = require('./data');
const { generateToken, authenticate, authorize } = require('./auth');

const app = express();
app.use(express.json());

// Register user
app.post('/register', async (req, res) => {
  const { email, password, name, role = 'user', teamId = null } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  const data = readData();
  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: uuid(), email, passwordHash, name, role, teamId };
  data.users.push(user);
  writeData(data);
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, teamId: user.teamId });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const data = readData();
  const user = data.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token });
});

// List users (admin or team lead)
app.get('/users', authenticate, authorize(['admin', 'lead']), (req, res) => {
  const data = readData();
  res.json(data.users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, teamId: u.teamId })));
});

// Create team
app.post('/teams', authenticate, authorize(['admin', 'lead']), (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const data = readData();
  const team = { id: uuid(), name, members: [] };
  data.teams.push(team);
  writeData(data);
  res.json(team);
});

// Add accomplishment
app.post('/accomplishments', authenticate, (req, res) => {
  const { title, description = '', type = 'Project', date = new Date().toISOString(), tags = [], metrics = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const data = readData();
  const acc = { id: uuid(), userId: req.user.id, teamId: req.user.teamId, title, description, type, date, tags, metrics };
  data.accomplishments.push(acc);
  writeData(data);
  res.json(acc);
});

// List accomplishments
app.get('/accomplishments', authenticate, (req, res) => {
  const { type, tag, q, start, end } = req.query;
  let data = readData().accomplishments;
  if (req.user.role === 'user') {
    data = data.filter(a => a.userId === req.user.id);
  } else if (req.user.role === 'lead') {
    data = data.filter(a => a.teamId === req.user.teamId);
  }
  if (type) data = data.filter(a => a.type === type);
  if (tag) data = data.filter(a => a.tags.includes(tag));
  if (q) data = data.filter(a => a.title.includes(q) || a.description.includes(q));
  if (start) data = data.filter(a => new Date(a.date) >= new Date(start));
  if (end) data = data.filter(a => new Date(a.date) <= new Date(end));
  res.json(data);
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

module.exports = app;
