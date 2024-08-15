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
    recoverPass,
    verifyTokenRecover,
    changePassRecover,
    changePassDirect
} = require('../../handlers/settings/users/userHandle')

const userRouter = Router()
userRouter.post('/register', registerUser)
    .post('/login', loginApp)
    .post('/all', allUserRegister)
    .get('/bienvenido', sendEmailUserPending)
    .get('/aprobado', sendEmailUserApprove)
    .post('/verificacion', verifyEmail)
    .put('/status', changeStatus)
    .delete('/borrarUsuario', deleteUser)
    .post('/recuperar', recoverPass)
    .get('/verificar', verifyTokenRecover)
    .post('/cambio', changePassRecover)
    .post('/cambioDirecto', changePassDirect)

module.exports = userRouter

