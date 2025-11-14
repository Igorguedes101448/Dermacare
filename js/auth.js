// Switch entre login e registo
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        tabs[1].classList.add('active');
    }
}

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            setToken(data.token);
            setUser(data.user);
            showAlert('alertMessage', 'Login efetuado com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            showAlert('alertMessage', data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showAlert('alertMessage', 'Erro ao fazer login. Tente novamente.', 'error');
    }
});

// Registo
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    // Validar senhas
    if (password !== passwordConfirm) {
        showAlert('alertMessage', 'As senhas não coincidem.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password, role: 'patient' })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('alertMessage', 'Registo efetuado com sucesso! Pode agora fazer login.', 'success');
            
            setTimeout(() => {
                switchTab('login');
                document.getElementById('registerForm').reset();
            }, 2000);
        } else {
            showAlert('alertMessage', data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao registar:', error);
        showAlert('alertMessage', 'Erro ao registar. Tente novamente.', 'error');
    }
});

// Verificar se já está autenticado
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuth();
    if (user) {
        window.location.href = '/dashboard.html';
    }
});
