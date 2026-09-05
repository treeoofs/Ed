// ===== Mobile menu toggle =====
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('show');
}

// ===== Quiz / Practice logic =====
function selectOption(qIndex, optIndex, correct) {
  const card = document.querySelectorAll('.question-card')[qIndex];
  if (!card) return;
  const opts = card.querySelectorAll('.option');
  if (card.dataset.answered === 'true') return;
  card.dataset.answered = 'true';

  opts.forEach((o, i) => {
    o.classList.remove('selected');
    if (i === correct) o.classList.add('correct');
    if (i === optIndex && optIndex !== correct) o.classList.add('incorrect');
  });

  const fb = card.querySelector('.feedback');
  if (fb) {
    fb.classList.add('show');
    fb.classList.add(optIndex === correct ? 'right' : 'wrong');
    fb.querySelector('.fb-status').textContent =
      optIndex === correct ? '✅ Correct!' : '❌ Incorrect.';
  }

  // Track score
  if (!window.examScore) window.examScore = { correct: 0, total: 0 };
  window.examScore.total++;
  if (optIndex === correct) window.examScore.correct++;
  updateScore();
}

function updateScore() {
  const el = document.getElementById('scoreDisplay');
  if (el && window.examScore) {
    const pct = Math.round((window.examScore.correct / window.examScore.total) * 100);
    el.textContent = `Score: ${window.examScore.correct}/${window.examScore.total} (${pct}%)`;
  }
}

function toggleSolution(btn) {
  const sol = btn.nextElementSibling;
  if (sol.style.display === 'block') {
    sol.style.display = 'none';
    btn.innerHTML = '<i class="fas fa-eye"></i> Show Solution';
  } else {
    sol.style.display = 'block';
    btn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Solution';
  }
}

// ===== Auth tab switching =====
function switchTab(tab) {
  document.querySelectorAll('.tab-buttons button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
  event.target.classList.add('active');
  document.getElementById(tab).style.display = 'block';
}

// ===== Mock auth =====
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  if (email && pass) {
    localStorage.setItem('examAceUser', JSON.stringify({ email, name: email.split('@')[0], joined: new Date().toISOString() }));
    alert('Login successful! Welcome back.');
    window.location.href = 'index.html';
  }
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const pass = document.getElementById('signupPass').value;
  if (name && email && pass) {
    const users = JSON.parse(localStorage.getItem('examAceUsers') || '[]');
    users.push({ name, email, joined: new Date().toISOString(), status: 'active' });
    localStorage.setItem('examAceUsers', JSON.stringify(users));
    localStorage.setItem('examAceUser', JSON.stringify({ name, email }));
    alert('Account created! Welcome to ExamAce.');
    window.location.href = 'index.html';
  }
}

// ===== Admin Login =====
function handleAdminLogin(e) {
  e.preventDefault();
  const u = document.getElementById('adminUser').value;
  const p = document.getElementById('adminPass').value;
  // Demo credentials: admin / admin123
  if (u === 'admin' && p === 'admin123') {
    sessionStorage.setItem('examAceAdmin', 'true');
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('adminError').textContent = 'Invalid credentials. Try admin / admin123';
  }
}

function adminLogout() {
  sessionStorage.removeItem('examAceAdmin');
  window.location.href = 'login.html';
}

function checkAdminAuth() {
  if (sessionStorage.getItem('examAceAdmin') !== 'true') {
    window.location.href = 'login.html';
  }
}

// ===== Admin user management =====
function loadUsers() {
  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;
  let users = JSON.parse(localStorage.getItem('examAceUsers') || '[]');
  if (users.length === 0) {
    // Seed demo users
    users = [
      { name: 'Chinedu Okafor', email: 'chinedu@email.com', joined: '2025-09-12', status: 'active', subjects: 8 },
      { name: 'Ama Sefa', email: 'ama@email.com', joined: '2025-10-03', status: 'active', subjects: 6 },
      { name: 'Tunde Bello', email: 'tunde@email.com', joined: '2025-11-21', status: 'pending', subjects: 4 },
      { name: 'Fatima Sani', email: 'fatima@email.com', joined: '2026-01-05', status: 'active', subjects: 9 },
      { name: 'Kwame Asare', email: 'kwame@email.com', joined: '2026-02-18', status: 'suspended', subjects: 2 },
      { name: 'Ngozi Eze', email: 'ngozi@email.com', joined: '2026-03-10', status: 'active', subjects: 7 },
    ];
    localStorage.setItem('examAceUsers', JSON.stringify(users));
  }
  tbody.innerHTML = users.map((u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td>${u.joined}</td>
      <td>${u.subjects || 0}</td>
      <td><span class="status ${u.status}">${u.status}</span></td>
      <td>
        <button class="action-btn view" onclick="viewUser(${i})"><i class="fas fa-eye"></i></button>
        <button class="action-btn edit" onclick="editUser(${i})"><i class="fas fa-edit"></i></button>
        <button class="action-btn delete" onclick="deleteUser(${i})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function viewUser(i) {
  const users = JSON.parse(localStorage.getItem('examAceUsers') || '[]');
  const u = users[i];
  alert(`User Profile:\n\nName: ${u.name}\nEmail: ${u.email}\nJoined: ${u.joined}\nSubjects Enrolled: ${u.subjects || 0}\nStatus: ${u.status}`);
}

function editUser(i) {
  const users = JSON.parse(localStorage.getItem('examAceUsers') || '[]');
  const u = users[i];
  const newStatus = prompt(`Edit status for ${u.name} (active / suspended / pending):`, u.status);
  if (newStatus && ['active','suspended','pending'].includes(newStatus)) {
    users[i].status = newStatus;
    localStorage.setItem('examAceUsers', JSON.stringify(users));
    loadUsers();
  }
}

function deleteUser(i) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  const users = JSON.parse(localStorage.getItem('examAceUsers') || '[]');
  users.splice(i, 1);
  localStorage.setItem('examAceUsers', JSON.stringify(users));
  loadUsers();
}

function addUser() {
  const name = prompt('Full name:');
  const email = prompt('Email:');
  if (!name || !email) return;
  const users = JSON.parse(localStorage.getItem('examAceUsers') || '[]');
  users.push({
    name, email,
    joined: new Date().toISOString().split('T')[0],
    status: 'active', subjects: 0
  });
  localStorage.setItem('examAceUsers', JSON.stringify(users));
  loadUsers();
}

// ===== Subject sidebar nav =====
function showTopic(id) {
  document.querySelectorAll('.topic-section').forEach(t => t.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
  document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
  event.target.classList.add('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('userTableBody')) loadUsers();
  if (document.querySelector('.admin-main')) checkAdminAuth();
});
