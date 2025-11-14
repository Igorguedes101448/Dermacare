// Enviar mensagem de contacto
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'A enviar...';

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            showAlert('messageAlert', data.message, 'success');
            document.getElementById('contactForm').reset();
        } else {
            showAlert('messageAlert', data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        showAlert('messageAlert', 'Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensagem';
    }
});
