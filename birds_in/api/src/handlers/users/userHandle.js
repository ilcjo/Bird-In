const { saveRegister, getAllUsersDb } = require("../../controllers/users/userController")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { generateToken } = require("../../utils/passport");
const { sendWelcomeEmail, sendApprovalEmail } = require("../../utils/emailService");

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
        console.log(response)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const sendEmailUserApprove = async (req, res) => {
    const { email, username } = req.query
    try {
        const response = sendApprovalEmail(email, username)
        console.log(response)
        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};


module.exports = {
    registerUser,
    loginApp,
    allUserRegister,
    sendEmailUserApprove,
    sendEmailUserPending
}