import express from 'express'
import { adminLogin, loginUser, registerUser, userProfile} from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get("/get-profile", userAuth, userProfile);
userRouter.post('/admin',adminLogin)

export default userRouter;