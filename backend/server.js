const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config(); // Sin ruta, porque ahora está en la misma carpeta

// Ejemplo de uso:
//console.log(process.env.EMAIL_USER); // Verifica que funcione

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Almacenamiento temporal de códigos (en producción usa una base de datos)
const verificationCodes = {};

// Configuración del transporter para nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes usar otro servicio como SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER || 'tu_correo@gmail.com', // Usa variables de entorno en producción
        pass: process.env.EMAIL_PASS || 'tu_contraseña' // Usa variables de entorno en producción
    }
});

// Endpoint para enviar código de verificación
app.post('/api/send-verification-code', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email es requerido' });
    }

    // Generar código aleatorio de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar el código temporalmente (en producción usa una DB con tiempo de expiración)
    verificationCodes[email] = verificationCode;

    // Configurar el correo electrónico
    const mailOptions = {
        from: 'tu_correo@gmail.com',
        to: email,
        subject: 'Código de Verificación',
        text: `Tu código de verificación es: ${verificationCode}`,
        html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>`
    };

    try {
        // Enviar el correo
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Código enviado correctamente' });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({ error: 'Error al enviar el código de verificación' });
    }
});

// Endpoint para verificar el código
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'Email y código son requeridos' });
    }

    if (verificationCodes[email] === code) {
        // Código válido
        delete verificationCodes[email]; // Eliminar el código usado
        res.json({ success: true, message: 'Código verificado correctamente' });
    } else {
        res.status(400).json({ error: 'Código inválido o expirado' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});