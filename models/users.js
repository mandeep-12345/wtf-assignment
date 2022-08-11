const mongoose=require("mongoose")
const userSchema= new mongoose.Schema({
    first_name:{
        type:String,
        required:[true,'firstname must be required'],
        trim:true,
        maxLength:[20,'firstname cannot be more than 20 characters']
    
    },
    last_name:{
        type:String,
        required:[true,'last_name must be required'],
        trim:true,
        maxLength:[20,'last_name cannot be more than 20 characters']

    },
    email:{
        type:String,
        required:[true,'email must be required'],
        trim:true,
        maxLength:[20,'email cannot be more than 20 characters']

    },
    mobile:{
        type:Number,
        required:[true,'mobile no. must be required'],
        trim:true,
        maxLength:[10,'mobile no. cannot be more than 10 characters']

    },
    password:{
        type:String,
        required:[true,'email must be required'],
        trim:true,
       

    },
    role:{
        type:String,
        required:[true,'role must be required'],
        
    },
    status:{
        type:String,
        required:[true,'status must be required'],
        
    }
})
module.exports=mongoose.model("user",userSchema)