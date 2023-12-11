const { Router } = require('express')
const {
    registerUser,
    loginApp,
    allUserRegister,
    sendEmailUserApprove,
    sendEmailUserPending,
    verifyEmail
} = require('../handlers/users/userHandle')


const userRouter = Router()
userRouter.post('/register', registerUser)
    .post('/login', loginApp)
    .get('/all', allUserRegister)
    .get('/bienvenido', sendEmailUserPending)
    .get('/aprobado', sendEmailUserApprove)
    .post('/verificacion', verifyEmail)

module.exports = userRouter

