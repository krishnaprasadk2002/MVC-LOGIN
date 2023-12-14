const express=require("express")
const userRoute=express()

userRoute.set('view engine','ejs')
userRoute.set('views','./views/users')

const session=require('express-session')
const config=require("../config/config")
userRoute.use(session({
    secret: config.sessionSecret,
    resave: false, 
    saveUninitialized: true  
  }));

  const auth=require('../middleware/auth')

const bodyParser=require("body-parser")
userRoute.use(bodyParser.json())
userRoute.use(bodyParser.urlencoded({extended:true}))

const userController=require("../controllers/userController")
userRoute.get('/register',auth.is_logout,userController.loadRegister)
userRoute.post('/register',userController.insertUser)

//login

userRoute.get('/',auth.is_logout,userController.loginLoad)
userRoute.get('/login',auth.is_logout,userController.loginLoad)
userRoute.post('/login',userController.verifyLogin)
userRoute.get('/home',auth.is_login,userController.loadHome)
userRoute.get('/logout',auth.is_login,userController.userLogout)




module.exports=userRoute