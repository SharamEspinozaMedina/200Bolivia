const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const { query } = require('./db'); // Importa la conexión a la DB

const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config(); // Sin ruta, porque ahora está en la misma carpeta

// Ejemplo de uso:
//console.log(process.env.EMAIL_USER); // Verifica que funcione

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend')); // Ajusta la ruta según tu estructura

// Almacenamiento temporal de códigos
const verificationCodes = {};

// Configuración del transporter para nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Endpoint para enviar código de verificación
app.post('/api/send-verification-code', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email es requerido' });
    }

    // Verificar si el email ya está registrado
    try {
        const result = await query('SELECT * FROM USUARIO WHERE correo = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'Este correo ya está registrado' });
        }
    } catch (error) {
        console.error('Error verificando email:', error);
        return res.status(500).json({ error: 'Error al verificar el correo' });
    }

    // Generar código aleatorio de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = verificationCode;

    // Configurar el correo electrónico
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Verificación',
        text: `Tu código de verificación es: ${verificationCode}`,
        html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Código enviado correctamente' });
    } catch (error) {
        console.error('Error enviando correo:', error);
        res.status(500).json({ error: 'Error al enviar el código de verificación' });
    }
});

// Endpoint para verificar el código y registrar usuario
app.post('/api/register', async (req, res) => {
    const { nombre, email, password, genero, ciudad, pais, verification_code } = req.body;

    // Validaciones
    if (!nombre || !email || !password || !verification_code || !ciudad || !pais) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar código
    if (verificationCodes[email] !== verification_code) {
        return res.status(400).json({ error: 'Código inválido o expirado' });
    }

    try {
        // 1. Generar ID (solución temporal)
        const idResult = await query('SELECT COALESCE(MAX(id), 0) + 1 as new_id FROM USUARIO');
        const newId = idResult.rows[0].new_id;

        // 2. Insertar usuario con rol 2 (Usuario normal)
        const result = await query(
            `INSERT INTO USUARIO (id, nombre, correo, contrasena, genero, ciudad, pais, id_rol) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 2) 
         RETURNING id, nombre, correo`,
            [newId, nombre, email, password, genero, ciudad, pais]
        );

        delete verificationCodes[email];
        res.json({ success: true, message: 'Registro exitoso!', user: result.rows[0] });

    } catch (error) {
        console.error('Error registrando usuario:', error);

        // Manejo específico de errores
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        if (error.code === '23503') {
            return res.status(400).json({
                error: 'Error de configuración: No existe el rol de usuario',
                detail: 'Contacta al administrador del sistema'
            });
        }

        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Endpoint para verificar el código (sin registrar)
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'Email y código son requeridos' });
    }

    if (verificationCodes[email] === code) {
        res.json({ success: true, message: 'Código verificado correctamente' });
    } else {
        res.status(400).json({ error: 'Código inválido o expirado' });
    }
});

// Agrega esto al final de server.js, antes de app.listen()

// Almacén temporal para tokens de recuperación (en producción usa DB)
const resetTokens = {};

// Endpoint para solicitar recuperación de contraseña
app.post('/api/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Verificar si el email existe
        const result = await query('SELECT * FROM USUARIO WHERE correo = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Email no registrado' });
        }

        // 2. Generar token único
        const token = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora de expiración

        // 3. Guardar token (en producción usa una tabla en DB)
        resetTokens[token] = {
            email,
            expiresAt
        };

        // 4. Enviar email con enlace

        //const resetLink = `http://localhost:3000/frontend/cambiar_contrasenia.html?token=${token}`;
        const resetLink = `file:///D:/user/Escritorio/200Bolivia/frontend/cambiar_contrasenia.html?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña',
            html: `
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Este enlace expirará en 1 hora.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Enlace de recuperación enviado' });

    } catch (error) {
        console.error('Error en recuperación:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Endpoint para actualizar contraseña
app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 1. Verificar token válido y no expirado
        const tokenData = resetTokens[token];
        if (!tokenData || new Date() > new Date(tokenData.expiresAt)) {
            return res.status(400).json({ error: 'Enlace inválido o expirado' });
        }

        // 2. Actualizar contraseña en BD (deberías hashearla en producción)
        await query(
            'UPDATE USUARIO SET contrasena = $1 WHERE correo = $2',
            [newPassword, tokenData.email]
        );

        // 3. Eliminar token usado
        delete resetTokens[token];

        res.json({ success: true, message: 'Contraseña actualizada' });

    } catch (error) {
        console.error('Error actualizando contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar contraseña' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});