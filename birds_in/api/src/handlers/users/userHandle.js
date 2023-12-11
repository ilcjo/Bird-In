const { saveRegister, getAllUsersDb } = require("../../controllers/users/userController")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { generateToken } = require("../../utils/passport");
const { sendWelcomeEmail, sendApprovalEmail } = require("../../utils/emailService");
const axios = require('axios')
require('dotenv').config();
const { APIKEY_VERIFY } = process.env;

const registerUser = async (req, res) => {
    const { email, name, pais, pass } = req.body
    try {
        const hashedPassword = await bcrypt.hash(pass, 10)
        const register = await saveRegister(email, name, pais, hashedPassword,)
        return res.status(200).json(register)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const loginApp = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        if (user.status !== 'approved') {
            return res.status(401).json({ message: 'Usuario no aprobado' });
        }
        req.login(user, { session: false }, async (err) => {
            if (err) {
                return next(err);
            }

            const token = generateToken(user); // Utiliza la función generateToken que has definido
            const { nombre, tipo } = user
            // Establece una cookie con el token
            res.cookie('jwt', token, {
                httpOnly: true, // Hace que la cookie sea accesible solo desde el servidor
                secure: false, // Configura esta opción en true si estás usando HTTPS
                sameSite: 'strict', // Controla cuándo se envía la cookie en las solicitudes de terceros
            });

            return res.json({ token, nombre, tipo });

        });
    })(req, res, next)
};


const allUserRegister = async (req, res) => {
    try {
        const allUsers = await getAllUsersDb()
        return res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const sendEmailUserPending = async (req, res) => {
    const { email, username } = req.query
    try {
        const response = sendWelcomeEmail(email, username)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const sendEmailUserApprove = async (req, res) => {
    const { email, username } = req.query
    try {
        const response = sendApprovalEmail(email, username)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const verifyEmail = async (req, res) => {
    const { email } = req.query
    console.log('BACK EMSIL :',email)
    try {
        const apiKey = APIKEY_VERIFY; // Reemplaza con tu clave de API
        const apiUrl = `https://apps.emaillistverify.com/api/verifyEmail?secret=${apiKey}&email=${email}&timeout=15`;
        const response = await axios(apiUrl);
        // Verifica si la respuesta de la API es "OK"
        const isValidEmail = response.data === "ok";
        console.log(isValidEmail)
        // Devuelve la respuesta de la API al cliente
        res.json({ isValidEmail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar el correo electrónico' });
    }
};


module.exports = {
    registerUser,
    loginApp,
    allUserRegister,
    sendEmailUserApprove,
    sendEmailUserPending,
    verifyEmail
}