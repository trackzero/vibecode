const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { readData, writeData } = require('./data');
const { generateToken, authenticate, authorize } = require('./auth');

const app = express();
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Register user
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  let { role = 'user', teamId = null } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  const data = readData();
  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  // First registered user becomes admin
  if (data.users.length === 0) {
    role = 'admin';
  }
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
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, teamId: user.teamId } });
});

// List users (admin or team lead)
app.get('/users', authenticate, authorize(['admin', 'lead']), (req, res) => {
  const data = readData();
  res.json(data.users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, teamId: u.teamId })));
});

// Update user (admin only)
app.put('/users/:id', authenticate, authorize(['admin']), (req, res) => {
  const { role, teamId } = req.body;
  const data = readData();
  const user = data.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (role) user.role = role;
  if (teamId !== undefined) user.teamId = teamId;
  writeData(data);
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role, teamId: user.teamId });
});

// List teams (admin or team lead)
app.get('/teams', authenticate, authorize(['admin', 'lead']), (req, res) => {
  const data = readData();
  res.json(data.teams);
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

// Reset all data to empty arrays (for development/debug only; not linked in UI)
app.post('/reset', (req, res) => {
  const empty = { users: [], teams: [], accomplishments: [] };
  writeData(empty);
  res.json({ success: true, message: 'Data reset' });
});

// Reset page UI
app.get('/reset', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset.html'));
});

// Update an accomplishment (owner or admin)
app.put('/accomplishments/:id', authenticate, (req, res) => {
  const { title, description, type, tags, metrics } = req.body;
  const data = readData();
  const acc = data.accomplishments.find(a => a.id === req.params.id);
  if (!acc) return res.status(404).json({ error: 'Accomplishment not found' });
  if (req.user.role !== 'admin' && acc.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (title) acc.title = title;
  if (description !== undefined) acc.description = description;
  if (type) acc.type = type;
  if (tags) acc.tags = tags;
  if (metrics !== undefined) acc.metrics = metrics;
  writeData(data);
  res.json(acc);
});

// Delete an accomplishment (owner or admin)
app.delete('/accomplishments/:id', authenticate, (req, res) => {
  const data = readData();
  const idx = data.accomplishments.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Accomplishment not found' });
  const acc = data.accomplishments[idx];
  if (req.user.role !== 'admin' && acc.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  data.accomplishments.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

// Fallback: serve frontend for any unmatched route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  // Bind to all network interfaces by default so container can be reached externally
  const HOST = process.env.HOST || '0.0.0.0';
  app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));
}

module.exports = app;
