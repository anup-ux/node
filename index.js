const express=require('express')
const routes=require('./router')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const app=express()
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// mongodb+srv://Anup:<password>@cluster0.44kgf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const dbUrl="mongodb+srv://Anup:123456Anup@cluster0.44kgf.mongodb.net/sample?retryWrites=true&w=majority"
mongoose.connect(dbUrl,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true}).then((result)=>{
    app.listen(7008,()=>{
        console.log("listening at 7008");
    })    
}).catch((err)=>console.log(err))
app.use('/',routes)
