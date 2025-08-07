let token = null;

// Event listeners
window.addEventListener('load', () => {
  document.getElementById('login-btn').onclick = login;
  document.getElementById('register-btn').onclick = register;
  document.getElementById('logout-btn').onclick = logout;
  document.getElementById('tab-accomplishments').onclick = showAccomplishments;
  document.getElementById('tab-dashboard').onclick = showDashboard;
});

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  fetch('/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    .then(r => r.json())
    .then(data => {
      if (data.token) {
        token = data.token;
        showDashboard();
      } else {
        alert(data.error || 'Login failed');
      }
    });
}

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = prompt('Enter your name:');
  fetch('/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password, name }) })
    .then(r => r.json())
    .then(data => {
      if (data.id) {
        alert('Registered. Please login.');
      } else {
        alert(data.error || 'Registration failed');
      }
    });
}

function logout() {
  token = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}

function showDashboard() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  showAccomplishments();
}

  const content = document.getElementById('content');
  content.innerHTML = '';
  // Form
  const form = document.createElement('div');
  form.innerHTML = `
    <h3>New Accomplishment</h3>
    <input id="ac-title" placeholder="Title">
    <textarea id="ac-desc" placeholder="Description"></textarea>
    <select id="ac-type">
      <option>Project</option>
      <option>Goal</option>
      <option>KPI</option>
    </select>
    <button id="ac-add">Add</button>
  `;
  content.appendChild(form);
  document.getElementById('ac-add').onclick = () => {
    const title = document.getElementById('ac-title').value;
    const description = document.getElementById('ac-desc').value;
    const type = document.getElementById('ac-type').value;
    fetch('/accomplishments', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': token }, body: JSON.stringify({ title, description, type }) })
      .then(r => r.json())
      .then(() => showAccomplishments());
  };
  // List
  fetch('/accomplishments', { headers: { 'Authorization': token } })
    .then(r => r.json())
    .then(list => {
      const ul = document.createElement('ul');
      list.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${a.date.substr(0,10)} [${a.type}] ${a.title}`;
        ul.appendChild(li);
      });
      content.appendChild(ul);
    });
}

function showDashboard() {
  const content = document.getElementById('content');
  content.innerHTML = '';
  const canvas = document.createElement('canvas');
  content.appendChild(canvas);
  fetch('/accomplishments', { headers: { 'Authorization': token } })
    .then(r => r.json())
    .then(list => {
      const counts = list.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {});
      new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(counts),
          datasets: [{ data: Object.values(counts), backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'] }]
        }
      });
      const btn = document.createElement('button');
      btn.textContent = 'Export PDF';
      btn.onclick = () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text('Team Metrics Report', 10, 10);
        pdf.addImage(canvas.toDataURL(), 'PNG', 10, 20, 180, 100);
        pdf.save('report.pdf');
      };
      content.appendChild(btn);
    });
}
let token = null;

function authHeaders(headers = {}) {
  if (token) headers['Authorization'] = token;
  return headers;
}

window.addEventListener('load', () => {
  document.getElementById('login-btn').onclick = login;
  document.getElementById('register-btn').onclick = register;
  document.getElementById('logout-btn').onclick = logout;
  document.getElementById('tab-accomplishments').onclick = showAccomplishments;
  document.getElementById('tab-dashboard').onclick = showAnalytics;
});

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  fetch('/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, password }) })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        token = data.token;
        showMain();
      } else {
        alert(data.error || 'Login failed');
      }
    });
}

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = prompt('Enter your name:');
  fetch('/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, password, name }) })
    .then(res => res.json())
    .then(data => {
      if (data.id) alert('Registered. Please login.');
      else alert(data.error || 'Registration failed');
    });
}

function logout() {
  token = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}

function showMain() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  showAccomplishments();
}

function showAccomplishments() {
  const content = document.getElementById('content');
  content.innerHTML = '';
  // New accomplishment form
  const form = document.createElement('div');
  form.innerHTML = `
    <h3>New Accomplishment</h3>
    <input id="ac-title" placeholder="Title">
    <textarea id="ac-desc" placeholder="Description"></textarea>
    <select id="ac-type">
      <option>Project</option>
      <option>Goal</option>
      <option>KPI</option>
    </select>
    <button id="ac-add">Add</button>
  `;
  content.appendChild(form);
  document.getElementById('ac-add').onclick = () => {
    const title = document.getElementById('ac-title').value;
    const description = document.getElementById('ac-desc').value;
    const type = document.getElementById('ac-type').value;
    fetch('/accomplishments', { method: 'POST', headers: authHeaders({'Content-Type': 'application/json'}), body: JSON.stringify({ title, description, type }) })
      .then(res => res.json())
      .then(() => showAccomplishments());
  };
  // List existing accomplishments
  fetch('/accomplishments', { headers: authHeaders() })
    .then(res => res.json())
    .then(list => {
      const ul = document.createElement('ul');
      list.forEach(a => {
        const li = document.createElement('li');
        li.textContent = `${a.date.substr(0,10)} [${a.type}] ${a.title}`;
        ul.appendChild(li);
      });
      content.appendChild(ul);
    });
}

function showAnalytics() {
  const content = document.getElementById('content');
  content.innerHTML = '';
  const canvas = document.createElement('canvas');
  content.appendChild(canvas);
  fetch('/accomplishments', { headers: authHeaders() })
    .then(res => res.json())
    .then(list => {
      const counts = list.reduce((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {});
      new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: { labels: Object.keys(counts), datasets: [{ data: Object.values(counts), backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'] }] }
      });
      const btn = document.createElement('button');
      btn.textContent = 'Export PDF';
      btn.onclick = () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text('Team Metrics Report', 10, 10);
        pdf.addImage(canvas.toDataURL(), 'PNG', 10, 20, 180, 100);
        pdf.save('report.pdf');
      };
      content.appendChild(btn);
    });
}
