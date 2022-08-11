require("dotenv").config({})
const express=require("express")
const app=express()
const port=5000
const routes=require("./routes/user")
const auth=require("./middlewares/auth")
const connectDb=require("./config/db")
app.get('/',(req,res)=>{
    res.send("hello world")
})

app.use(express.json())
app.use("/",routes)
app.get('/protected',auth,(req,res)=>{
    return res.status(200).json({...req.user._doc})
})
app.listen(port, async () => {
    try {
        await connectDb()
        console.log(`server is running on ${port}`)

    } catch (error) {
        console.log(error)

    }

})