// Données initiales
let teamMembers = [
    { id: 1, name: "Alice Martin", role: "Chef de projet" },
    { id: 2, name: "Bob Dubois", role: "Développeur" }
];

let tasks = [
    { id: 1, title: "Maquette Figma", assignee: "Alice Martin", completed: false },
    { id: 2, title: "Base de données", assignee: "Bob Dubois", completed: false }
];

let comments = [
    { id: 1, text: "Bienvenue à tous sur TeamBoard ! 🚀", date: new Date().toLocaleString() }
];

// Éléments DOM
const membersList = document.getElementById('membersList');
const tasksList = document.getElementById('tasksList');
const commentsList = document.getElementById('commentsList');
const memberCount = document.getElementById('memberCount');
const taskCount = document.getElementById('taskCount');
const completedCount = document.getElementById('completedCount');
const themeToggle = document.getElementById('themeToggle');
const addMemberBtn = document.getElementById('addMemberBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const addCommentBtn = document.getElementById('addCommentBtn');
const commentInput = document.getElementById('commentInput');
const memberModal = document.getElementById('memberModal');
const taskModal = document.getElementById('taskModal');
const saveMemberBtn = document.getElementById('saveMemberBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const taskAssignee = document.getElementById('taskAssignee');

// Initialisation
function init() {
    renderAll();
    attachEventListeners();
    loadFromLocalStorage();
}

// Sauvegarde locale
function saveToLocalStorage() {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('comments', JSON.stringify(comments));
}

function loadFromLocalStorage() {
    const savedMembers = localStorage.getItem('teamMembers');
    const savedTasks = localStorage.getItem('tasks');
    const savedComments = localStorage.getItem('comments');
    
    if (savedMembers) teamMembers = JSON.parse(savedMembers);
    if (savedTasks) tasks = JSON.parse(savedTasks);
    if (savedComments) comments = JSON.parse(savedComments);
    renderAll();
}

// Rendu principal
function renderAll() {
    renderMembers();
    renderTasks();
    renderComments();
    updateStats();
    updateTaskAssigneeSelect();
    saveToLocalStorage();
}

function renderMembers() {
    membersList.innerHTML = teamMembers.map(member => `
        <div class="member-item">
            <div class="member-info">
                <h4>${escapeHtml(member.name)}</h4>
                <p>${escapeHtml(member.role)}</p>
            </div>
            <button class="btn-danger" onclick="deleteMember(${member.id})">Supprimer</button>
        </div>
    `).join('');
}

function renderTasks() {
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-header">
                <span class="task-title" style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                    ${escapeHtml(task.title)}
                </span>
                <span class="task-assignee">👤 ${escapeHtml(task.assignee || 'Non assignée')}</span>
            </div>
            <div class="task-actions">
                ${!task.completed ? `<button class="btn-success" onclick="toggleTask(${task.id})">✅ Terminer</button>` : 
                                    `<button class="btn-secondary" onclick="toggleTask(${task.id})">🔄 Réactiver</button>`}
                <button class="btn-danger" onclick="deleteTask(${task.id})">🗑️ Supprimer</button>
            </div>
        </div>
    `).join('');
}

function renderComments() {
    commentsList.innerHTML = comments.slice().reverse().map(comment => `
        <div class="comment-item">
            <div class="comment-text">💬 ${escapeHtml(comment.text)}</div>
            <div class="comment-date">📅 ${comment.date}</div>
        </div>
    `).join('');
}

function updateStats() {
    memberCount.textContent = teamMembers.length;
    taskCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
}

function updateTaskAssigneeSelect() {
    taskAssignee.innerHTML = '<option value="">Non assignée</option>' + 
        teamMembers.map(m => `<option value="${escapeHtml(m.name)}">${escapeHtml(m.name)}</option>`).join('');
}

// Actions
window.deleteMember = function(id) {
    if (confirm('Supprimer ce membre ?')) {
        teamMembers = teamMembers.filter(m => m.id !== id);
        // Réassigner les tâches sans assignation
        tasks = tasks.map(t => t.assignee === teamMembers.find(m => m.id === id)?.name ? 
            { ...t, assignee: '' } : t);
        renderAll();
    }
}

window.deleteTask = function(id) {
    if (confirm('Supprimer cette tâche ?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderAll();
    }
}

window.toggleTask = function(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    renderAll();
}

function addMember() {
    const name = document.getElementById('memberName').value.trim();
    const role = document.getElementById('memberRole').value.trim();
    
    if (name && role) {
        teamMembers.push({
            id: Date.now(),
            name: name,
            role: role
        });
        renderAll();
        closeModals();
        document.getElementById('memberName').value = '';
        document.getElementById('memberRole').value = '';
    } else {
        alert('Veuillez remplir tous les champs');
    }
}

function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const assignee = taskAssignee.value;
    
    if (title) {
        tasks.push({
            id: Date.now(),
            title: title,
            assignee: assignee,
            completed: false
        });
        renderAll();
        closeModals();
        document.getElementById('taskTitle').value = '';
    } else {
        alert('Veuillez entrer un titre de tâche');
    }
}

function addComment() {
    const text = commentInput.value.trim();
    if (text) {
        comments.push({
            id: Date.now(),
            text: text,
            date: new Date().toLocaleString()
        });
        renderAll();
        commentInput.value = '';
    }
}

// Utilitaires
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function closeModals() {
    memberModal.style.display = 'none';
    taskModal.style.display = 'none';
}

// Gestion du thème
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️ Mode clair' : '🌙 Mode sombre';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️ Mode clair';
    }
}

// Événements
function attachEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    addMemberBtn.addEventListener('click', () => memberModal.style.display = 'block');
    addTaskBtn.addEventListener('click', () => taskModal.style.display = 'block');
    addCommentBtn.addEventListener('click', addComment);
    saveMemberBtn.addEventListener('click', addMember);
    saveTaskBtn.addEventListener('click', addTask);
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === memberModal || e.target === taskModal) closeModals();
    });
    
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addComment();
    });
}

// Démarrage
init();
loadTheme();