const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/login-mvc")

const express=require("express")
const app=express()
const port=3002

const nocache=require("nocache")
app.use(nocache())

//user route
const userRoute=require('./routes/userRoute')
app.use('/',userRoute)

//admin route
const adminRoute=require('./routes/adminRoute')
app.use('/admin',adminRoute)

app.listen(port,()=>{
    console.log(`http://localhost:${port}/`);
})