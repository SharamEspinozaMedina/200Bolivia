document.addEventListener('DOMContentLoaded', function () {
    // Obtener token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        alert('Enlace inválido. Por favor solicita un nuevo enlace de recuperación.');
        window.location.href = 'recuperar_contrasenia.html';
        return;
    }

    document.getElementById('changePasswordBtn').addEventListener('click', async function () {
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!newPassword || !confirmPassword) {
            alert("Por favor, completa ambos campos.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Contraseña cambiada exitosamente.");
                window.location.href = 'iniciar_sesion.html';
            } else {
                throw new Error(data.error || 'Error al cambiar la contraseña');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
            window.location.href = 'recuperar_contrasenia.html';
        }
    });
});