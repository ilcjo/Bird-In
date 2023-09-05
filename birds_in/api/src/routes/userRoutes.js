const { Router } = require('express')
const { registerUser, loginApp } = require('../handlers/users/userHandle')


const userRouter = Router()
userRouter.post('/register', registerUser).post('/login', loginApp)

module.exports = userRouter

