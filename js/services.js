// Carregar serviços
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/appointments/services/all`);
        const data = await response.json();

        if (data.success) {
            displayServices(data.services);
        }
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
    }
}

// Exibir serviços
function displayServices(services) {
    const container = document.getElementById('servicesContainer');
    if (!container) return;

    if (services.length === 0) {
        container.innerHTML = '<p class="text-center">Nenhum serviço disponível no momento.</p>';
        return;
    }

    container.innerHTML = services.map(service => `
        <div class="card">
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <p style="color: var(--text-light); font-size: 0.875rem;">
                    ⏱️ Duração: ${service.duration} minutos
                </p>
                <p style="color: var(--primary-color); font-weight: bold; font-size: 1.25rem; margin-top: 0.5rem;">
                    €${service.price}
                </p>
            </div>
            <a href="/appointments.html" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">
                Marcar Consulta
            </a>
        </div>
    `).join('');
}

// Carregar serviços ao carregar a página
document.addEventListener('DOMContentLoaded', loadServices);
