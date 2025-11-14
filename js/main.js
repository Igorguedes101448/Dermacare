// Configuração da API
const API_URL = 'http://localhost:3000/api';

// Gerenciamento de token
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const removeUser = () => localStorage.removeItem('user');

// Headers para requisições autenticadas
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

// Mostrar/ocultar elementos baseado na autenticação
function updateAuthUI() {
    const user = getUser();
    const loginLink = document.getElementById('loginLink');
    
    if (user && loginLink) {
        loginLink.textContent = user.name;
        loginLink.href = '/dashboard.html';
    }
}

// Verificar autenticação
async function checkAuth() {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            headers: authHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            return data.user;
        } else {
            removeToken();
            removeUser();
            return null;
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return null;
    }
}

// Logout
function logout() {
    removeToken();
    removeUser();
    window.location.href = '/';
}

// Mostrar alerta
function showAlert(elementId, message, type = 'success') {
    const alertElement = document.getElementById(elementId);
    if (!alertElement) return;

    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    alertElement.classList.remove('hidden');

    setTimeout(() => {
        alertElement.classList.add('hidden');
    }, 5000);
}

// Menu mobile toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Atualizar UI de autenticação
    updateAuthUI();

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Definir data mínima para hoje
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });
});
