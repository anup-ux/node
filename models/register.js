const mongoose=require('mongoose')
const RegisterSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{type:String,required:true},
   orders:[{
       _Id:mongoose.Schema.Types.ObjectId,
       productId:{type:String}
    }
   ]
})
module.exports=mongoose.model('Register',RegisterSchema)