function sendResetLink() {
    const email = document.getElementById("email").value;
    if (email) {
        alert("Se ha enviado un enlace de recuperación a " + email);
    } else {
        alert("Por favor, ingresa tu correo electrónico.");
    }
}
