
/**
 * ARCHIVO: registro.js
 * DESCRIPCIÓN: Maneja la lógica del formulario de registro incluyendo validaciones,
 *              interacciones de usuario y preparación de datos para envío.
 */

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
  // Agrega al inicio del archivo (después del DOMContentLoaded)
  const sendCodeBtn = document.getElementById('sendCodeBtn');
  const emailInput = document.getElementById('email');

  // Función para enviar el código de verificación
  async function sendVerificationCode() {
    const email = emailInput.value.trim();

    if (!email) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Deshabilitar el botón para evitar múltiples envíos
    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = 'Enviando...';

    try {
      const response = await fetch('http://localhost:3000/api/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Código de verificación enviado. Revisa tu correo electrónico.');
      } else {
        throw new Error(data.error || 'Error al enviar el código');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      // Restaurar el botón después de 60 segundos
      setTimeout(() => {
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = 'Enviar código';
      }, 60000);
    }
  }

  // Agrega el event listener al botón
  sendCodeBtn.addEventListener('click', sendVerificationCode);

  // Modifica el event listener del formulario para verificar el código
  document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validar coincidencia de contraseñas
    if (!validatePasswordMatch()) {
      confirmPasswordInput.focus();
      return;
    }

    // Obtener datos del formulario
    const formData = {
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
      genero: document.getElementById('genero').value,
      ciudad: document.getElementById('ciudad').value,
      pais: document.getElementById('pais').value,
      verification_code: document.getElementById('verification_code').value.trim()
    };

    try {
      // Primero verificar el código
      const verifyResponse = await fetch('http://localhost:3000/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verification_code
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Código de verificación inválido');
      }

      // Si el código es válido, proceder con el registro
      const registerResponse = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        alert('Registro exitoso! Serás redirigido para iniciar sesión.');
        window.location.href = 'iniciar_sesion.html';
      } else {
        throw new Error(registerData.error || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  });

  // ========== TOGGLE VISIBILIDAD DE CONTRASEÑA ==========
  /**
   * Configura el toggle de visibilidad para campos de contraseña
   * @param {HTMLElement} icon - Elemento del ícono que activa el toggle
   * @param {string} inputId - ID del campo de contraseña asociado
   */
  function setupPasswordToggle(icon, inputId) {
    const input = document.getElementById(inputId);
    icon.addEventListener('click', function () {
      // Alterna entre tipo 'password' y 'text'
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      // Cambia el ícono visualmente
      this.classList.toggle('bx-show-alt');
      this.classList.toggle('bx-hide');
    });
  }

  // Aplica el toggle a ambos campos de contraseña
  const passwordIcons = document.querySelectorAll('.bx-show-alt, .toggle-password');
  if (passwordIcons[0]) setupPasswordToggle(passwordIcons[0], 'password');
  if (passwordIcons[1]) setupPasswordToggle(passwordIcons[1], 'confirm_password');

  // ========== VALIDACIÓN DE FORTALEZA DE CONTRASEÑA ==========
  const passwordInput = document.getElementById('password');
  const passwordMessage = document.getElementById('message') || document.getElementById('password-strength-message');

  passwordInput.addEventListener('input', function () {
    const password = this.value;
    let message = '';
    let strength = 0;

    // Validación básica de longitud
    if (password.length === 0) {
      message = '';
    } else if (password.length < 8) {
      message = 'La contraseña debe tener al menos 8 caracteres';
    } else {
      // Cálculo de fortaleza basado en criterios:
      if (/[a-z]/.test(password)) strength++; // Letras minúsculas
      if (/[A-Z]/.test(password)) strength++; // Letras mayúsculas
      if (/[0-9]/.test(password)) strength++;  // Números
      if (/[$@#%&/*]/.test(password)) strength++; // Caracteres especiales

      // Asignación de mensajes según nivel de fortaleza
      switch (strength) {
        case 0: case 1: message = 'Muy débil'; break;
        case 2: message = 'Débil'; break;
        case 3: message = 'Media'; break;
        case 4: case 5: message = 'Fuerte'; break;
      }
    }

    // Actualización visual
    passwordMessage.textContent = message;
    if (password.length > 0) {
      if (password.length < 8) {
        passwordMessage.style.color = '#ff0000';
        passwordMessage.className = 'validation-message error';
      } else {
        // Color según fortaleza:
        passwordMessage.style.color =
          strength < 2 ? '#ff0000' :    // Rojo
            strength === 2 ? '#ff6c00' :  // Naranja
              strength === 3 ? '#ffe000' :  // Amarillo
                '#20c500';                   // Verde
        passwordMessage.className =
          strength < 3 ? 'validation-message error' : 'validation-message success';
      }
    }
  });

  // ========== VALIDACIÓN DE COINCIDENCIA DE CONTRASEÑAS ==========
  const confirmPasswordInput = document.getElementById('confirm_password');
  const matchMessage = document.getElementById('error_mensaje') || document.getElementById('password-match-message');

  /**
   * Valida que ambas contraseñas coincidan
   * @returns {boolean} True si coinciden, False si no
   */
  function validatePasswordMatch() {
    if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
      matchMessage.textContent = 'Las contraseñas no coinciden';
      matchMessage.style.color = 'rgb(87, 7, 73)';
      matchMessage.classList.add('error');
      return false;
    } else {
      matchMessage.textContent = '';
      matchMessage.classList.remove('error');
      return true;
    }
  }

  // Eventos para validación en tiempo real
  confirmPasswordInput.addEventListener('input', validatePasswordMatch);
  confirmPasswordInput.addEventListener('blur', validatePasswordMatch);

  // ========== RELACIÓN PAÍS-CIUDAD ==========
  const countrySelect = document.getElementById('pais');
  const citySelect = document.getElementById('ciudad');

  // Mapeo de ciudades por país
  const citiesByCountry = {
    alemania: ["Berlín", "Colonia", "Fráncfort", "Hamburgo", "Múnich"],
    argentina: ["Buenos Aires", "Córdoba", "La Plata", "Mendoza", "Rosario"],
    australia: ["Adelaida", "Brisbane", "Melbourne", "Perth", "Sídney"],
    bolivia: ["Beni", "Chuquisaca", "Cochabamba", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"],
    brasil: ["Brasilia", "Fortaleza", "Río de Janeiro", "Salvador", "São Paulo"],
    canada: ["Calgary", "Montreal", "Ottawa", "Toronto", "Vancouver"],
    chile: ["Antofagasta", "Concepción", "La Serena", "Santiago", "Valparaíso"],
    china: ["Cantón", "Hangzhou", "Pekín", "Shanghái", "Shenzhen"],
    colombia: ["Barranquilla", "Bogotá", "Cali", "Cartagena", "Medellín"],
    españa: ["Barcelona", "Bilbao", "Madrid", "Sevilla", "Valencia"],
    estados_unidos: ["Chicago", "Houston", "Los Ángeles", "Miami", "Nueva York"],
    francia: ["Lyon", "Marsella", "Niza", "París", "Toulouse"],
    italia: ["Milán", "Nápoles", "Palermo", "Roma", "Turín"],
    japon: ["Kioto", "Nagoya", "Osaka", "Tokio", "Yokohama"],
    mexico: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana"],
    peru: ["Arequipa", "Chiclayo", "Cusco", "Lima", "Trujillo"],
    reino_unido: ["Birmingham", "Glasgow", "Liverpool", "Londres", "Mánchester"]
    // ... (otros países)
  };

  // Actualiza las ciudades según el país seleccionado
  countrySelect.addEventListener('change', function () {
    const country = this.value;
    citySelect.innerHTML = '<option value=""></option>';

    if (country && citiesByCountry[country]) {
      citiesByCountry[country].forEach(ciudad => {
        const option = document.createElement('option');
        option.value = ciudad.toLowerCase().replace(/ /g, '-'); // Formato: ciudad => ciudad
        option.textContent = ciudad;
        citySelect.appendChild(option);
      });
    }
  });

  // ========== ENVÍO DEL FORMULARIO ==========
  document.getElementById('registerForm').addEventListener('submit', function (e) {
    // Previene el envío si las contraseñas no coinciden
    if (!validatePasswordMatch()) {
      e.preventDefault();
      confirmPasswordInput.focus();
    }
    // Otras validaciones podrían agregarse aquí
  });

  // Inicializa ciudades si hay un país pre-seleccionado
  if (countrySelect.value) {
    countrySelect.dispatchEvent(new Event('change'));
  }


});

// Agrega al inicio del archivo (después del DOMContentLoaded)
const sendCodeBtn = document.getElementById('sendCodeBtn');
const emailInput = document.getElementById('email');