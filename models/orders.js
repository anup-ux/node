const mongoose=require('mongoose')
const OrdersSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    productId:{
        type:String,
      
    },
    productName:{type:String},
})
module.exports=mongoose.model('orders',OrdersSchema)