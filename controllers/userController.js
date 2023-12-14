const User=require("../models/userModel")
const loadRegister=async(req,res)=>{
    try {
        res.render('registeration')
    } catch (error) {
        console.log(error.message);
    }
}

const bcrypt=require("bcrypt")
const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}
// const insertUser=async(req,res)=>{
//     try {
//         const spassword=await securePassword(req.body.password)
//         const user=new User({
//             name:req.body.name,
//             mobile:req.body.mobile,
//             email:req.body.email,
//             password:spassword,
//             is_admin:0
//         })
//         const userData= await user.save();

//         if (userData) {
//             res.render('registeration',{message:"your registeration has been successful"})
//         } else {
//             res.render('registeration',{message:"your registeration has failed"})
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// }


const insertUser = async (req, res) => {
  try {
      const { name, mobile, email, password } = req.body;

      // Check if the email is already registered
      const existingUser = await User.findOne({ email });

      if (existingUser) {
          return res.render('registeration', { errorMessage: 'Email already exists. Please choose a different email.' });
      }

      // If email is not already registered, proceed with user creation
      const spassword = await securePassword(password);
      const user = new User({
          name,
          mobile,
          email,
          password: spassword,
          is_admin: 0
      });

      const userData = await user.save();

      if (userData) {
          return res.render('registeration', { message: 'Your registration has been successful' });
      } else {
          return res.render('registeration', { message: 'Your registration has failed' });
      }
  } catch (error) {
      console.log(error.message);
      return res.status(500).send('Internal Server Error');
  }
};


//-----------------------------------------login started----------------------------------------------//
const loginLoad=async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}
// const verifyLogin=async(req,res)=>{
//     try {
//         const email=req.body.email
//         const password=req.body.password
//         const userData = await User.findOne({
//             email: email
//           });
      
//           if (userData) {
//             const passwordMatch = await bcrypt.compare(password, userData.password);
//             if (passwordMatch) {
//               if (userData.is_verfied === 0) {
//                 res.render('login', { message: 'Login successful' });
//               } else {
//                 req.session.user_id=userData._id
//                 res.redirect('/home');
//               }
//             } else {
//               res.render('login', { message: 'Email and password are incorrect' });
//             }
//           } else {
//             res.render('login', { message: 'Email and password are incorrect' });
//           }
//         } catch (error) {
//           console.log(error.message);
//         }
//       };

const verifyLogin = async (req, res) => {
    try {
        const email=req.body.email
                const password=req.body.password
                const userData = await User.findOne({
                    email: email
                  });
  
                  if (userData) {
                    const passwordMatch = await bcrypt.compare(password, userData.password);
                    if (passwordMatch) {
                      if (userData.is_verfied === 0) {
                        return res.render('login', { message: 'Login successful' });
                      } else {
                        req.session.user_id = userData._id;
                        return res.redirect('/home');
                      }
                    } else {
                      return res.render('login', { message: 'Email and password are incorrect' });
                    }
                  } else {
                    return res.render('login', { message: 'Email and password are incorrect' });
                  }
                } catch (error) {
                  console.error(error);
                  return res.status(500).send('Internal Server Error');
                }
              };

      const loadHome=async (req,res)=>{
        try {
            res.render('home')
        } catch (error) {
            console.log(error.message);
        }
      }

      const userLogout = async (req, res) => {
        try {
          req.session.destroy();
          res.redirect('/?message=Logoutsuccessfully');
        } catch (error) {
          console.log(error.message);
        }
      };

     
      
module.exports={loadRegister,insertUser,loginLoad,verifyLogin,loadHome,userLogout}