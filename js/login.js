/**
 * ARCHIVO: login.js
 * DESCRIPCIÓN: Controla la funcionalidad del formulario de inicio de sesión,
 *               incluyendo manejo de contraseña, validaciones básicas y
 *               eventos para login social.
 */

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {

    // ========== TOGGLE VISIBILIDAD DE CONTRASEÑA ==========
    /**
     * Configura el toggle para mostrar/ocultar la contraseña
     * @type {HTMLElement} togglePassword - Icono de ojo para toggle
     * @type {HTMLInputElement} passwordInput - Campo de contraseña
     */
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            // Alterna entre tipo 'password' y 'text'
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Cambia el ícono visualmente
            this.classList.toggle('bx-show-alt');
            this.classList.toggle('bx-hide');
        });
    }

    // ========== VALIDACIÓN DE FORMULARIO ==========
    /**
     * Valida los campos requeridos antes del envío del formulario
     * @type {HTMLFormElement} loginForm - Formulario de login
     */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Verifica campos vacíos
            if (!email || !password) {
                e.preventDefault(); // Detiene el envío
                alert('Por favor complete todos los campos');
            }

            // Aquí podrían agregarse más validaciones (formato email, etc.)
        });
    }

    // ========== MANEJO DE LOGIN SOCIAL ==========
    /**
     * Configura los botones de login con redes sociales
     * @type {NodeList} socialButtons - Lista de botones sociales
     */
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Extrae el nombre del servicio del texto del botón
            const service = this.textContent.replace('Usar ', '').toLowerCase();
            console.log(`Iniciar sesión con ${service}`);

            // Lógica para cada servicio:
            switch (service) {
                case 'google':
                    // window.location.href = '/auth/google';
                    break;
                case 'facebook':
                    // window.location.href = '/auth/facebook';
                    break;
                case 'correo electrónico':
                    // Redirige al formulario estándar
                    document.getElementById('email').focus();
                    break;
            }
        });
    });

    // ========== FUNCIONALIDAD ADICIONAL PODRÍA INCLUIR ==========
    /*
    - Validación de formato de email
    - Recordar credenciales (localStorage)
    - Spinner durante el envío
    - Manejo de errores del servidor
    */
});