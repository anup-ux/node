const jwt=require('jsonwebtoken')
const key='secret key'
module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization
        console.log("toek",token)
        const decode=jwt.verify(token,key)
        req.data=decode
        next();
    }catch(err){
       res.send("auth failed")
    }
}