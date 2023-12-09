const { Router } = require('express')
const { registerUser, loginApp, allUserRegister, sendEmailUserApprove, sendEmailUserPending } = require('../handlers/users/userHandle')


const userRouter = Router()
userRouter.post('/register', registerUser)
    .post('/login', loginApp)
    .get('/all', allUserRegister)
    .get('/bienvenido', sendEmailUserPending)
    .get('/aprobado', sendEmailUserApprove)

module.exports = userRouter

