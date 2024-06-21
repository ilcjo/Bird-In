const { saveRegister, getAllUsersDb, changeApprovedStatus, deleteCompleteU, verifyTokenDb, saveTokenToDatabase, updatePass } = require("../../controllers/users/userController")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { generateToken, generateTokenRecoverEmail } = require("../../utils/passport");
const { sendWelcomeEmail, sendApprovalEmail, sendEmailRecoverPass } = require("../../utils/emailService");
const axios = require('axios')
require('dotenv').config();
const { APIKEY_VERIFY } = process.env;

const registerUser = async (req, res) => {
    const { email, name, pais, pass } = req.body
    // console.log('handler pass:',pass)
    try {
        const hashedPassword = await bcrypt.hash(pass, 5)
        // console.log('pass haseadsa:',hashedPassword)
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
    const { status } = req.query
    try {
        const allUsers = await getAllUsersDb(status)
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
    try {
        const apiKey = APIKEY_VERIFY; // Reemplaza con tu clave de API
        const apiUrl = `https://apps.emaillistverify.com/api/verifyEmail?secret=${apiKey}&email=${email}&timeout=15`;
        const response = await axios(apiUrl);
        // Verifica si la respuesta de la API es "OK"
        const isValidEmail = response.data === "ok";
        // Devuelve la respuesta de la API al cliente
        res.json({ isValidEmail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar el correo electrónico' });
    }
};

const changeStatus = async (req, res) => {
    const { id } = req.query
    try {
        const response = await changeApprovedStatus(id)

        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.query
    try {
        const response = await deleteCompleteU(id)

        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const recoverPass = async (req, res) => {
    const { email } = req.query
    try {
        const token = await generateTokenRecoverEmail(email)
        await saveTokenToDatabase(token, email);
        const link = `http://localhost:5173/recuperar?token=${token}`;
        await sendEmailRecoverPass(email, link)
        return res.status(200).json({ message: 'Correo de recuperación enviado.' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};
const changePassRecover= async (req, res) => {
    const { pass, token } = req.query
    try {
        const response = await updatePass(pass, token)
        return res.status(200).json({ message: 'Contraseña Actualizada.' })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const verifyTokenRecover = async (req, res) => {
    const { token } = req.query;

    try {
        const tokenStatus = await verifyTokenDb(token);
        // console.log(tokenStatus)
        if (tokenStatus === 'Token inválido') {
            return res.status(400).send('Token inválido');
        } else if (tokenStatus === 'Token expirado') {
            return res.status(400).send('Token expirado');
        }

        return res.status(200).send('Token válido');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginApp,
    allUserRegister,
    sendEmailUserApprove,
    sendEmailUserPending,
    verifyEmail,
    changeStatus,
    deleteUser,
    recoverPass,
    verifyTokenRecover,
    changePassRecover
}