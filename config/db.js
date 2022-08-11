const mongoose=require("mongoose")
const connectDb=async()=>{
    return mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("mongoDb connection is established")
    }).catch((err)=>{
        console.log(err)
    })
}
module.exports=connectDb