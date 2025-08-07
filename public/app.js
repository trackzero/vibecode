// React-based SPA with simple view routing
const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState(token ? 'accomplishments' : 'login');

  const login = async (email, password) => {
    const res = await fetch('/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setView('accomplishments');
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
    setToken(null);
    setView('login');
  };

  return (
    <div>
      <h1>Team Metrics</h1>
      {token && (
        <nav>
          <button onClick={() => setView('accomplishments')}>Accomplishments</button>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={logout}>Logout</button>
        </nav>
      )}
      {view === 'login' && <Login onLogin={login} onSwitch={() => setView('register')} />}
      {view === 'register' && <Register onRegister={register} onSwitch={() => setView('login')} />}
      {token && view === 'accomplishments' && <Accomplishments token={token} />}
      {token && view === 'dashboard' && <Dashboard token={token} />}
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

function Accomplishments({ token }) {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  useEffect(() => {
    fetch('/accomplishments', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(setList);
  }, []);
  const add = async () => {
    await fetch('/accomplishments', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title }) });
    const r = await fetch('/accomplishments', { headers: { 'Authorization': `Bearer ${token}` } });
    setList(await r.json()); setTitle('');
  };
  return (
    <div>
      <h2>Accomplishments</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <button onClick={add}>Add</button>
      <ul>{list.map(a => <li key={a.id}>{a.date.substr(0,10)} - {a.title}</li>)}</ul>
    </div>
  );
}

function Dashboard({ token }) {
  const [counts, setCounts] = useState({});
  useEffect(() => {
    fetch('/accomplishments', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(list => {
        const c = {};
        list.forEach(a => c[a.type] = (c[a.type]||0) + 1);
        setCounts(c);
      });
  }, []);
  return (
    <div>
      <h2>Dashboard</h2>
      <ul>{Object.entries(counts).map(([t,n]) => <li key={t}>{t}: {n}</li>)}</ul>
    </div>
  );
}

// Render the SPA
createRoot(document.getElementById('app')).render(<App />);
