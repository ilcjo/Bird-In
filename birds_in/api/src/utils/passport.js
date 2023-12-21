const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET_KEY } = process.env;
const { Usuarios } = require('../db/db')


// Configura la estrategia de autenticación local
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await Usuarios.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: 'Usuario no registrado' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.pass);
                if (isPasswordValid) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Configura la estrategia de autenticación JWT
passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET_KEY,
        },
        async (jwtPayload, done) => {
            try {
                const user = await Usuarios.findByPk(jwtPayload.id);

                if (user && user.status === 'approved') {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Función para generar un token JWT
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' }); // Cambia la duración según tus necesidades
};

const generateTokenRecoverEmail = (email) => {
    const payload = {
        email: email,
    };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '30min' });

};

module.exports = { passport, generateToken, generateTokenRecoverEmail };