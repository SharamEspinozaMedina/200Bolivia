function changePassword() {
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

    // Aquí se enviaría la nueva contraseña al servidor (esto es solo una simulación)
    alert("Tu contraseña ha sido cambiada exitosamente.");
    window.location.href = "iniciar_sesion.html";  // Redirige a la página de inicio de sesión
}
