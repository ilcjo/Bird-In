const { Router } = require('express')
const { registerUser, loginApp, allUserRegister } = require('../handlers/users/userHandle')


const userRouter = Router()
userRouter.post('/register', registerUser)
    .post('/login', loginApp)
    .get('/all', allUserRegister)

module.exports = userRouter

