const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
const auth=require('./auth/auth')
const key='secret key'
const admin=require("./models/admin_login")
const Product=require("./models/new_product")
const Register=require("./models/register");
const orders = require('./models/orders');
router.get("/test",(req,res)=>{
    res.send("handling requetst")
})
// ADMIN LOGIN WITH JWT AUTH
router.post("/admin-login",(req,res)=>{
    console.log("body is",req.body)
 admin.find({email:req.body.email}).exec().then((data)=>{
 if(data.length>1){
    return res.status(401).json({
                messege:" user not found"
            })
 }else if(data[0].password===req.body.password){
  const token= jwt.sign({
       email:data[0].email,
       id:data[0].id
   },
   key,
   {
       expiresIn:"1hr"
   }
   )
    res.send({
        messege:"success login",
        "data":data,
        "token":token
    })
}
else{
    res.send("error in password ")
}
 }).catch((err)=>{
     res.send("No user found")
     console.log("failed",err)
 })
})
router.post("/new-product", auth,(req,res)=>{
    Product.find({name:req.body.name})
    .exec()
    .then((product)=>{
        if(product.length>=1){
            return res.status(409).json({
                messege:"product exists",
            })
        }
        else{
            const newProduct=new Product({
                _id:mongoose.Types.ObjectId(),
                name:req.body.name,
                price:req.body.price,
                quantity:req.body.quantity
             })
             newProduct.save().then((result)=>{
                 console.log("resul",result)
                 res.status(200).json({
                    messege:"Added",
                    data:newProduct
                })
             }).catch((err)=>{
                 res.status(500).json({
                     error:err,
                     messege:"error while store Adding"
                 })
             })
             }
        })
})
// USER REGISTRATION CAN BE ACCESSED BY ADMIN AND THE USER
router.post("/register",(req,res)=>{
    Register.find({email:req.body.email})
    .exec()
    .then((user)=>{
        if(user.length>=1){
            console.log("user",user)
            return res.status(409).json({
                messege:"user exists"
            })
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if (err){
                res.status(500).json({
                messege:"error while hasing",
                error:err
                })
                console.log(err);
                }else{
                    const registerUser=new Register({
                        _id:mongoose.Types.ObjectId(),
                        name:req.body.name,
                        email:req.body.email,
                        password:hash,
                     })
                     registerUser.save().then((result)=>{
                         console.log("resul",result)
                         res.status(200).json({
                            messege:"Registered",
                            data:registerUser
                        })
                     }).catch((err)=>{
                         res.status(500).json({
                             error:err
                         })
                     })
                }
            })
        }
    })
   
})
// USER LOGIN
router.post("/login",(req,res)=>{
    Register.find({email:req.body.email})
    .exec()
    .then(async user=>{
        console.log("user is",req.body.password)
        if(user.length<1){
         return res.status(401).json({
                messege:" user not found"
            })
        }
      const compare=await bcrypt.compare(req.body.password,user[0].password)
      try{
        if(compare){
            console.log("sdcsdc",compare)
            return res.status(200).send({
                data:user,
                messege:"Login success"
            }).redirect('/view-products')
        }else{
            res.send("error in password ")
        }
      }catch(err){
           console.log("error in password",err)
           res.send("error in password ")
      }
    })
    .catch(err=>{
        res.status(401).json({
            messege:"Login failed please check email and password",
            error:err
        })
    })
})
// user view product
router.get('/view-product',(req,res)=>{
    Product.find().then((mess)=>{
    console.log("mess",mess)
    res.status(200).json({
        messege:"sucess",
        data:mess
    })
    
}).catch(err=>res.status(500).json({error:err}))    
})
// for ordering we need two params the user credentials and the item cred
// for user credentials we could get it from sessions or cookies
// here I am passing it manually
// item id is saved in the db along with the users order in the collection 

router.post('/order/:uid/:pid',(req,res)=>{
      Register.find({_id:req.params.uid,"orders.productId":req.params.pid})
      .then((data)=>{
          if(data){
           Register.updateOne({_id:req.params.uid},
            {
                $push:
                {
                   "orders.1.productId":req.params.pid,
               }  
            }
         
            ).then(result=>console.log("result",result)).catch(err=>console.log("err",err))
          }else{
          console.log("error while updating")
          }
      })
      .catch(err=>console.log(err))

})
// /databaseName/collectionName?queryParameters
router.get("/view-orders/:userId",(req,res)=>{
    Register.findOne({_id:req.params.userId})
    .then((data)=>{
        const orders=data.orders
        orders.forEach((field)=>{
            console.log("fields are",field)
            res.send({
                data:field,
                messege:"orders are"
            })
        })
    })
    .catch(err=>console.log("error",err))
})
router.get("/view-allorders/",(req,res)=>{
    Register.find()
    .then((data)=>{ 
       data.forEach((fields)=>{
           res.send({
               "data":fields.orders
           })
       })
    })
    .catch(err=>console.log(err))
    })
module.exports=router;

// this is the data being returend on view orders you can see the order clearly has an array of objects and the array product key is also shown but not able to 
// retrive it in response
// orders
// :
// Array
// 0
// :
// Object
// 1
// :
// Object
// productId
// :
// Array
// 0
// :
// "60f9cd05946bef4db41281f7"
// __v
// :
// 0