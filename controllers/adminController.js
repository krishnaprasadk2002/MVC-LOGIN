const User=require("../models/userModel")
const bcrypt=require('bcrypt')
const randomstring=require('randomstring')
const mongoose=require('mongoose')

const loadLogin=async (req,res)=>{
   try {
    res.render('adminLogin')
   } catch (error) {
    console.log(error.message);
   }
}

const verifyLogin=async (req,res)=>{
   try {
    const email=req.body.email;
    const password=req.body.password;

    const userData=await User.findOne({email:email})
    if (userData) {
      const passwordMatch=await bcrypt.compare(password,userData.password)
      if (passwordMatch) {
        if (userData.is_admin === 0) {
            res.render('adminLogin',{message:"email and password incorrect"})
        }else{
            req.session.user_id=userData._id
            res.redirect("/admin/dashboard")
        }
      } else {
        res.render('adminLogin',{message:"Email and password incorrect"})
      }
    } else {
        res.render('adminLogin',{message:"Email and password incorrect"})
    }
   } catch (error) {
    
   }
}
const loadDashboard=async(req,res)=>{
    try {
        const userData=await User.find({is_admin:0})
        res.render('dashboard',{users:userData})
    } catch (error) {
        console.log(error.message);
    }
}
const logout=async (req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}

// add new work start

const newUserload=async (req,res)=>{
    try {
        res.render('newUser')
    } catch (error) {
        console.log(error.message);
    }
}

const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async (req, res) => {
    try {
        const name = req.body.name;
        const mobile = req.body.mobile;
        const email = req.body.email;
        const password = randomstring.generate(8);

        const spassword = await securePassword(password);

        const user = new User({
            name: name,
            email: email,
            mobile: mobile,
            password: spassword,
            is_admin: 0
        });

        const userData = await user.save();

        if (userData) {
            res.redirect('/admin/newUser');
        } else {
            res.render('new-user', { message: "Something went wrong" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

// edit user

const editUserLoad=async (req,res)=>{
    try {
        const id=req.query._id;
       const userData=await User.findById({_id:id})
       if(userData){
        res.render('edit-user',{user:userData})
       }
       res.redirect('/admin/dashboard')
        
    } catch (error) {
        console.log(error.message);
    }
}

// const updateUsers=async (req,res)=>{
// try {
//    const userData=await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile,is_verified:req.body.veriyfy}})
//    res.redirect('/admin/dashboard');

// } catch (error) {
//     console.log(error.message);
// }
// }
const updateUsers = async (req, res) => {
    try {
        const userId = req.body.id;

        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("Invalid ObjectId");
            
            return res.redirect('/admin/dashboard');
        }

        const newEmail = req.body.email;

        // Checking new email or already exists user
        const existingUserWithSameEmail = await User.findOne({ email: newEmail, _id: { $ne: userId } });

        if (existingUserWithSameEmail) {
            // Send an error message 
            return res.render('edit-user', { user: req.body, errorMessage: "Error: Email already exists for another user." });
        }

        // Update the user data
        const userData = await User.findByIdAndUpdate(userId, {
            $set: {
                name: req.body.name,
                email: newEmail,
                mobile: req.body.mobile,
                is_verified: req.body.veriyfy
            }
        });

        console.log("User data updated successfully");

       
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log("Error updating user:", error.message);
        
        res.redirect('/admin/dashboard');
    }
};


//deleting user

const deleteUser=async (req,res)=>{
    try {
        const id=req.query._id;
        await User.deleteOne({_id:id})
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={loadLogin,verifyLogin,loadDashboard,logout,newUserload,addUser,editUserLoad,updateUsers,deleteUser}