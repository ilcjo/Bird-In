const { Router } = require('express')
const {
    registerUser,
    loginApp,
    allUserRegister,
    sendEmailUserApprove,
    sendEmailUserPending,
    verifyEmail,
    changeStatus,
    deleteUser,
    recoverPass
} = require('../handlers/users/userHandle')

const userRouter = Router()
userRouter.post('/register', registerUser)
    .post('/login', loginApp)
    .post('/all', allUserRegister)
    .get('/bienvenido', sendEmailUserPending)
    .get('/aprobado', sendEmailUserApprove)
    .post('/verificacion', verifyEmail)
    .put('/status', changeStatus)
    .delete('/borrarUsuario', deleteUser)
    .post('/recuperarContraseña', recoverPass)

module.exports = userRouter

