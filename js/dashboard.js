let currentUser = null;

// Inicializar dashboard
async function initDashboard() {
    currentUser = await checkAuth();

    if (!currentUser) {
        window.location.href = '/login.html';
        return;
    }

    // Ocultar seção de mensagens se não for admin
    if (currentUser.role !== 'admin') {
        document.getElementById('messagesLink')?.classList.add('hidden');
    }

    displayWelcome();
    loadStats();
    loadAppointments();

    // Event listeners
    setupEventListeners();
}

// Exibir boas-vindas
function displayWelcome() {
    const welcomeEl = document.getElementById('userWelcome');
    if (welcomeEl) {
        welcomeEl.innerHTML = `
            <div class="card" style="margin-bottom: 2rem;">
                <h2>Olá, ${currentUser.name}! 👋</h2>
                <p>Tipo de conta: <strong>${getRoleLabel(currentUser.role)}</strong></p>
                ${currentUser.specialty ? `<p>Especialidade: <strong>${currentUser.specialty}</strong></p>` : ''}
            </div>
        `;
    }
}

// Carregar estatísticas
async function loadStats() {
    if (currentUser.role === 'patient') return;

    try {
        const response = await fetch(`${API_URL}/appointments/stats/overview`, {
            headers: authHeaders()
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('totalAppointments').textContent = data.stats.total;
            document.getElementById('pendingAppointments').textContent = data.stats.pending;
            document.getElementById('confirmedAppointments').textContent = data.stats.confirmed;
            document.getElementById('completedAppointments').textContent = data.stats.completed;
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carregar consultas
async function loadAppointments(status = '') {
    try {
        const url = status ? `${API_URL}/appointments?status=${status}` : `${API_URL}/appointments`;
        const response = await fetch(url, {
            headers: authHeaders()
        });

        const data = await response.json();

        if (data.success) {
            displayAppointmentsTable(data.appointments);
        }
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
    }
}

// Exibir tabela de consultas
function displayAppointmentsTable(appointments) {
    const container = document.getElementById('appointmentsTable');
    if (!container) return;

    if (appointments.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center;">Nenhuma consulta encontrada.</p>';
        return;
    }

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Serviço</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${appointments.map(apt => `
                    <tr>
                        <td>#${apt.id}</td>
                        <td>${apt.patient_name}</td>
                        <td>${apt.doctor_name}</td>
                        <td>${apt.service_name || '-'}</td>
                        <td>${new Date(apt.appointment_date).toLocaleDateString('pt-PT')}</td>
                        <td>${apt.appointment_time}</td>
                        <td><span class="badge badge-${apt.status}">${getStatusLabel(apt.status)}</span></td>
                        <td>
                            <div class="action-buttons">
                                ${apt.status === 'pending' && (currentUser.role === 'admin' || currentUser.role === 'doctor') ? 
                                    `<button class="btn btn-sm btn-primary" onclick="confirmAppointment(${apt.id})">Confirmar</button>` : ''}
                                ${apt.status === 'confirmed' && (currentUser.role === 'admin' || currentUser.role === 'doctor') ? 
                                    `<button class="btn btn-sm" onclick="completeAppointment(${apt.id})" style="background: var(--secondary-color);">Completar</button>` : ''}
                                ${apt.status === 'pending' ? 
                                    `<button class="btn btn-sm" onclick="cancelAppointment(${apt.id})" style="background: #dc2626;">Cancelar</button>` : ''}
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Carregar pacientes
async function loadPatients() {
    if (currentUser.role !== 'admin') return;

    try {
        const response = await fetch(`${API_URL}/users?role=patient`, {
            headers: authHeaders()
        });

        const data = await response.json();

        if (data.success) {
            displayPatientsTable(data.users);
        }
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

// Exibir tabela de pacientes
function displayPatientsTable(patients) {
    const container = document.getElementById('patientsTable');
    if (!container) return;

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Data de Registo</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(patient => `
                    <tr>
                        <td>#${patient.id}</td>
                        <td>${patient.name}</td>
                        <td>${patient.email}</td>
                        <td>${patient.phone || '-'}</td>
                        <td>${new Date(patient.created_at).toLocaleDateString('pt-PT')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Carregar mensagens
async function loadMessages() {
    if (currentUser.role !== 'admin') return;

    try {
        const response = await fetch(`${API_URL}/contact`, {
            headers: authHeaders()
        });

        const data = await response.json();

        if (data.success) {
            displayMessagesTable(data.messages);
        }
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
    }
}

// Exibir tabela de mensagens
function displayMessagesTable(messages) {
    const container = document.getElementById('messagesTable');
    if (!container) return;

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Assunto</th>
                    <th>Data</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${messages.map(msg => `
                    <tr>
                        <td>#${msg.id}</td>
                        <td>${msg.name}</td>
                        <td>${msg.email}</td>
                        <td>${msg.subject || 'Sem assunto'}</td>
                        <td>${new Date(msg.created_at).toLocaleDateString('pt-PT')}</td>
                        <td><span class="badge badge-${msg.status}">${msg.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Ações de consulta
async function confirmAppointment(id) {
    try {
        const response = await fetch(`${API_URL}/appointments/${id}/confirm`, {
            method: 'PATCH',
            headers: authHeaders()
        });

        const data = await response.json();
        if (data.success) {
            alert('Consulta confirmada!');
            loadAppointments();
            loadStats();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function completeAppointment(id) {
    try {
        const response = await fetch(`${API_URL}/appointments/${id}/complete`, {
            method: 'PATCH',
            headers: authHeaders()
        });

        const data = await response.json();
        if (data.success) {
            alert('Consulta completada!');
            loadAppointments();
            loadStats();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function cancelAppointment(id) {
    if (!confirm('Tem certeza?')) return;

    try {
        const response = await fetch(`${API_URL}/appointments/${id}/cancel`, {
            method: 'PATCH',
            headers: authHeaders()
        });

        const data = await response.json();
        if (data.success) {
            alert('Consulta cancelada!');
            loadAppointments();
            loadStats();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navegação sidebar
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            showSection(section);
        });
    });

    // Filtro de status
    document.getElementById('statusFilter')?.addEventListener('change', (e) => {
        loadAppointments(e.target.value);
    });
}

// Mostrar seção
function showSection(sectionId) {
    // Atualizar links ativos
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    // Atualizar seções ativas
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId)?.classList.add('active');

    // Carregar dados da seção
    if (sectionId === 'patients') loadPatients();
    if (sectionId === 'messages') loadMessages();
}

// Utilitários
function getRoleLabel(role) {
    const labels = {
        'admin': 'Administrador',
        'doctor': 'Médico',
        'patient': 'Paciente'
    };
    return labels[role] || role;
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Pendente',
        'confirmed': 'Confirmada',
        'completed': 'Completada',
        'cancelled': 'Cancelada',
        'new': 'Nova',
        'read': 'Lida',
        'replied': 'Respondida'
    };
    return labels[status] || status;
}

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', initDashboard);
