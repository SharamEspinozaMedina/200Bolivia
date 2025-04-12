async function sendResetLink() {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Por favor, ingresa tu correo electrónico.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/request-password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Se ha enviado un enlace de recuperación a tu correo.");
        } else {
            throw new Error(data.error || 'Error al enviar el enlace');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}