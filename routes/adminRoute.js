const express=require('express')
const adminRoute=express()

const session=require('express-session')
const config=require('../config/config')
adminRoute.use(session({
    secret: config.sessionSecret,
    resave: false,  // Set to false to prevent session save on every request
    saveUninitialized: true  // Set to false to prevent session save for uninitialized sessions
  }));

const bodyParser=require('body-parser')
adminRoute.use(bodyParser.json())
adminRoute.use(bodyParser.urlencoded({extended:true}))

adminRoute.set('view engine','ejs')
adminRoute.set('views','./views/admin')

const adminAuth=require("../middleware/adminAuth")
const adminController=require('../controllers/adminController')
adminRoute.get('/',adminAuth.is_logout,adminController.loadLogin)
adminRoute.post('/',adminController.verifyLogin)

adminRoute.get('/dashboard',adminAuth.is_login,adminController.loadDashboard)
adminRoute.get('/logout',adminAuth.is_login,adminController.logout)
adminRoute.get('/new-user',adminAuth.is_login,adminController.newUserload)
adminRoute.post('/new-user',adminController.addUser)

// edit

adminRoute.get('/edit-user',adminAuth.is_login,adminController.editUserLoad)
adminRoute.post('/edit-user',adminController.updateUsers)

//delete 

adminRoute.get('/delete-user',adminController.deleteUser)

adminRoute.get("*",(req,res)=>{
  res.redirect('/admin')
})

module.exports=adminRoute
