const { saveRegister } = require("../../controllers/users/userController")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { generateToken } = require("../../utils/passport");

const registerUser = async (req, res) => {
    const { email, name, pais, pass } = req.body
    try {
        const hashedPassword = await bcrypt.hash(pass, 10)
        const register = await saveRegister(email, name, pais, hashedPassword,)
        return res.status(404).json(register)
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

module.exports = {
    registerUser,
    loginApp
}