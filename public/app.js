// React-based SPA with simple view routing
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [view, setView] = useState(token ? 'accomplishments' : 'login');

  const login = async (email, password) => {
    const res = await fetch('/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setView(data.user.role === 'admin' ? 'admin' : 'accomplishments');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  const register = async (email, password, name) => {
    const res = await fetch('/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password, name }) });
    const data = await res.json();
    if (data.id) {
      alert('Registered! Please login.');
      setView('login');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setView('login');
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Team Metrics</h1>
      {token && (
        <nav className="mb-3">
          <button className="btn btn-outline-primary me-2" onClick={() => setView('accomplishments')}>Accomplishments</button>
          <button className="btn btn-outline-primary me-2" onClick={() => setView('dashboard')}>Dashboard</button>
          {user?.role === 'admin' && <button className="btn btn-outline-warning me-2" onClick={() => setView('admin')}>Admin</button>}
          <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
        </nav>
      )}
      {view === 'login' && <Login onLogin={login} onSwitch={() => setView('register')} />}
      {view === 'register' && <Register onRegister={register} onSwitch={() => setView('login')} />}
      {token && view === 'accomplishments' && <Accomplishments token={token} user={user} />}
      {token && view === 'dashboard' && <Dashboard token={token} user={user} />}
      {token && user?.role === 'admin' && view === 'admin' && <AdminPanel token={token} />}
    </div>
  );
}

function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={() => onLogin(email, password)}>Login</button>
      <p>
        No account? <button onClick={onSwitch}>Register</button>
      </p>
    </div>
  );
}

function Register({ onRegister, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  return (
    <div>
      <h2>Register</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={() => onRegister(email, password, name)}>Register</button>
      <p>
        Have an account? <button onClick={onSwitch}>Login</button>
      </p>
    </div>
  );
}

function Accomplishments({ token, user }) {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [users, setUsers] = useState({});
  const [teams, setTeams] = useState({});
  useEffect(() => {
    if (!token) return;
    fetch('/accomplishments', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]));
    fetch('/users', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(us => setUsers(Object.fromEntries(us.map(u => [u.id, u.name]))));
    fetch('/teams', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(ts => setTeams(Object.fromEntries(ts.map(t => [t.id, t.name]))));
  }, [token]);
  const add = async () => {
    // Auto-prefix a random celebratory emoji
    const emojis = ['🎉', '🚀', '✅', '🌟', '👏'];
    const t = emojis[Math.floor(Math.random() * emojis.length)] + ' ' + title;
    await fetch('/accomplishments', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: t }) });
    const r = await fetch('/accomplishments', { headers: { 'Authorization': `Bearer ${token}` } });
    setList(await r.json()); setTitle('');
  };
  const edit = async (id) => {
    const newTitle = prompt('New title:');
    if (newTitle) {
      await fetch(`/accomplishments/${id}`, { method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: newTitle }) });
      const r = await fetch('/accomplishments', { headers: { 'Authorization': `Bearer ${token}` } });
      setList(await r.json());
    }
  };
  const remove = async (id) => {
    if (confirm('Delete this accomplishment?')) {
      await fetch(`/accomplishments/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const r = await fetch('/accomplishments', { headers: { 'Authorization': `Bearer ${token}` } });
      setList(await r.json());
    }
  };
  return (
    <div>
      <h2>Accomplishments</h2>
      <div className="input-group mb-3">
        <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <button className="btn btn-primary" onClick={add}>Add</button>
      </div>
      {list.length === 0 ? (
        <div className="alert alert-info">No accomplishments yet.</div>
      ) : (
        <ul className="list-group">
          {list.map(a => (
            <li key={a.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{a.date.substr(0,10)}</strong> {a.title}<br/>
                  <small className="text-muted">
                    by {users[a.userId] || 'Unknown'}
                    {a.teamId && <> in {teams[a.teamId] || 'Unknown Team'}</>}
                  </small>
                </div>
                <div>
                  {(a.userId === user.id || user.role === 'admin') && <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => edit(a.id)}>✏️</button>}
                  {(a.userId === user.id || user.role === 'admin') && <button className="btn btn-sm btn-outline-danger" onClick={() => remove(a.id)}>🗑️</button>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Dashboard({ token, user }) {
  const [countsByType, setCountsByType] = useState({});
  const [countsByTeam, setCountsByTeam] = useState({});
  const [teams, setTeams] = useState({});
  useEffect(() => {
    if (!token) return;
    // Load teams and accomplishments together
    Promise.all([
      fetch('/teams', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch('/accomplishments', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
    ]).then(([ts, list]) => {
      const teamMap = Object.fromEntries(ts.map(t => [t.id, t.name]));
      setTeams(teamMap);
      const byType = {}, byTeam = {};
      (Array.isArray(list) ? list : []).forEach(a => {
        byType[a.type] = (byType[a.type]||0) + 1;
        const name = teamMap[a.teamId] || 'No Team';
        byTeam[name] = (byTeam[name]||0) + 1;
      });
      setCountsByType(byType);
      setCountsByTeam(byTeam);
    }).catch(() => {
      setTeams({});
      setCountsByType({});
      setCountsByTeam({});
    });
  }, [token]);
  const typeRef = useRef();
  const teamRef = useRef();
  const typeChartRef = useRef();
  const teamChartRef = useRef();
  useEffect(() => {
    // Render/update charts; destroy previous instances first
    if (typeRef.current) {
      if (typeChartRef.current) typeChartRef.current.destroy();
      typeChartRef.current = new Chart(typeRef.current.getContext('2d'), {
        type: 'doughnut',
        data: { labels: Object.keys(countsByType), datasets: [{ data: Object.values(countsByType), backgroundColor: ['#4e73df','#1cc88a','#36b9cc','#f6c23e','#e74a3b'] }] },
        options: { plugins: { legend: { position: 'bottom' } } }
      });
    }
    if (teamRef.current) {
      if (teamChartRef.current) teamChartRef.current.destroy();
      teamChartRef.current = new Chart(teamRef.current.getContext('2d'), {
        type: 'bar',
        data: { labels: Object.keys(countsByTeam), datasets: [{ label: 'By Team', data: Object.values(countsByTeam), backgroundColor: '#858796' }] },
        options: { plugins: { legend: { display: false } } }
      });
    }
  }, [countsByType, countsByTeam]);
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <h5>By Type</h5>
          <canvas ref={typeRef}></canvas>
        </div>
        <div className="col-md-6 mb-4">
          <h5>By Team</h5>
          <canvas ref={teamRef}></canvas>
        </div>
      </div>
      <div className="alert alert-secondary">
        Total: {Object.values(countsByType).reduce((a,b) => a + b, 0)} accomplishments
      </div>
    </div>
  );
}

function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newUserTeam, setNewUserTeam] = useState('');
  useEffect(() => {
    fetch('/users', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(setUsers);
    fetch('/teams', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(setTeams);
  }, []);
  const updateUser = async (id, role, teamId) => {
    await fetch(`/users/${id}`, { method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ role, teamId }) });
    const r = await fetch('/users', { headers: { 'Authorization': `Bearer ${token}` } });
    setUsers(await r.json());
  };
  const createTeam = async () => {
    await fetch('/teams', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ name: newTeam }) });
    const r = await fetch('/teams', { headers: { 'Authorization': `Bearer ${token}` } });
    setTeams(await r.json()); setNewTeam('');
  };
  return (
    <div>
      <h2>Admin Panel</h2>
      <h4>Create New User</h4>
      <div className="row g-2 mb-4">
        <div className="col-md-2"><input className="form-control" placeholder="Name" value={newUserName} onChange={e=>setNewUserName(e.target.value)} /></div>
        <div className="col-md-3"><input className="form-control" placeholder="Email" value={newUserEmail} onChange={e=>setNewUserEmail(e.target.value)} /></div>
        <div className="col-md-2"><input type="password" className="form-control" placeholder="Password" value={newUserPassword} onChange={e=>setNewUserPassword(e.target.value)} /></div>
        <div className="col-md-2">
          <select className="form-select" value={newUserRole} onChange={e=>setNewUserRole(e.target.value)}>
            <option value="user">User</option>
            <option value="lead">Lead</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={newUserTeam} onChange={e=>setNewUserTeam(e.target.value)}>
            <option value="">None</option>
            {teams.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-success w-100" onClick={async ()=>{
            await fetch('/register', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ name:newUserName, email:newUserEmail, password:newUserPassword, role:newUserRole, teamId:newUserTeam||null }) });
            setNewUserName(''); setNewUserEmail(''); setNewUserPassword(''); setNewUserRole('user'); setNewUserTeam('');
            const ures = await fetch('/users',{ headers:{ 'Authorization':`Bearer ${token}` } }); setUsers(await ures.json());
          }}>Add</button>
        </div>
      </div>
      <h4>Teams</h4>
      <div className="mb-2">
        <input className="form-control d-inline-block w-auto me-2" value={newTeam} onChange={e=>setNewTeam(e.target.value)} placeholder="Team name" />
        <button className="btn btn-primary" onClick={createTeam}>Create Team</button>
      </div>
      <ul className="list-group mb-4">
        {teams.map(t => <li key={t.id} className="list-group-item">{t.name}</li>)}
      </ul>
      <h4>Users</h4>
      <table className="table">
        <thead><tr><th>Name</th><th>Role</th><th>Team</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>
                <select className="form-select" value={u.role} onChange={e=>updateUser(u.id, e.target.value, u.teamId)}>
                  <option value="user">User</option>
                  <option value="lead">Lead</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <select className="form-select" value={u.teamId||''} onChange={e=>updateUser(u.id, u.role, e.target.value||null)}>
                  <option value="">None</option>
                  {teams.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </td>
              <td><button className="btn btn-sm btn-secondary" onClick={()=>updateUser(u.id, u.role, u.teamId)}>Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Render the SPA
createRoot(document.getElementById('app')).render(<App />);
