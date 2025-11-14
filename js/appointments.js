let currentUser = null;

// Carregar dados iniciais
async function initAppointments() {
    currentUser = await checkAuth();

    if (!currentUser) {
        document.getElementById('authRequired').classList.remove('hidden');
        document.getElementById('submitBtn').disabled = true;
    } else {
        document.getElementById('authRequired').classList.add('hidden');
        document.getElementById('submitBtn').disabled = false;
        loadMyAppointments();
    }

    loadServices();
    loadDoctors();
}

// Carregar serviços
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/appointments/services/all`);
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('service');
            select.innerHTML = '<option value="">Selecione um serviço</option>' +
                data.services.map(s => 
                    `<option value="${s.id}">${s.name} - €${s.price}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
    }
}

// Carregar médicos
async function loadDoctors() {
    try {
        const response = await fetch(`${API_URL}/users/doctors`);
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('doctor');
            select.innerHTML = '<option value="">Selecione um médico</option>' +
                data.doctors.map(d => 
                    `<option value="${d.id}">${d.name} - ${d.specialty}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
    }
}

// Submeter marcação
document.getElementById('appointmentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
        showAlert('appointmentAlert', 'É necessário fazer login para marcar uma consulta.', 'error');
        return;
    }

    const formData = {
        service_id: document.getElementById('service').value,
        doctor_id: document.getElementById('doctor').value,
        appointment_date: document.getElementById('date').value,
        appointment_time: document.getElementById('time').value,
        notes: document.getElementById('notes').value
    };

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'A processar...';

    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showAlert('appointmentAlert', 'Consulta marcada com sucesso!', 'success');
            document.getElementById('appointmentForm').reset();
            loadMyAppointments();
        } else {
            showAlert('appointmentAlert', data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao marcar consulta:', error);
        showAlert('appointmentAlert', 'Erro ao marcar consulta. Tente novamente.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmar Marcação';
    }
});

// Carregar minhas consultas
async function loadMyAppointments() {
    try {
        const response = await fetch(`${API_URL}/appointments`, {
            headers: authHeaders()
        });

        const data = await response.json();

        if (data.success) {
            displayAppointments(data.appointments);
        }
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
    }
}

// Exibir consultas
function displayAppointments(appointments) {
    const container = document.getElementById('appointmentsList');
    const section = document.getElementById('myAppointments');

    if (!container || appointments.length === 0) return;

    section.classList.remove('hidden');

    container.innerHTML = `
        <div class="cards-grid">
            ${appointments.map(apt => `
                <div class="card">
                    <h3>${apt.service_name || 'Consulta'}</h3>
                    <p><strong>Médico:</strong> ${apt.doctor_name}</p>
                    <p><strong>Data:</strong> ${new Date(apt.appointment_date).toLocaleDateString('pt-PT')}</p>
                    <p><strong>Hora:</strong> ${apt.appointment_time}</p>
                    <p><strong>Status:</strong> 
                        <span class="badge badge-${apt.status}">
                            ${getStatusLabel(apt.status)}
                        </span>
                    </p>
                    ${apt.notes ? `<p><strong>Observações:</strong> ${apt.notes}</p>` : ''}
                    ${apt.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="cancelAppointment(${apt.id})" 
                                style="margin-top: 1rem; background: #dc2626;">
                            Cancelar Consulta
                        </button>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Cancelar consulta
async function cancelAppointment(id) {
    if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;

    try {
        const response = await fetch(`${API_URL}/appointments/${id}/cancel`, {
            method: 'PATCH',
            headers: authHeaders()
        });

        const data = await response.json();

        if (data.success) {
            showAlert('appointmentAlert', 'Consulta cancelada com sucesso.', 'success');
            loadMyAppointments();
        } else {
            showAlert('appointmentAlert', data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao cancelar consulta:', error);
        showAlert('appointmentAlert', 'Erro ao cancelar consulta.', 'error');
    }
}

// Obter label do status
function getStatusLabel(status) {
    const labels = {
        'pending': 'Pendente',
        'confirmed': 'Confirmada',
        'completed': 'Completada',
        'cancelled': 'Cancelada'
    };
    return labels[status] || status;
}

// Inicializar
document.addEventListener('DOMContentLoaded', initAppointments);
