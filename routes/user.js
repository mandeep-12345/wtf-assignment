const User=require('../models/users')
const router = require("express").Router()
const auth=require("../middlewares/auth")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
router.post("/register",async(req,res)=>{
    const{first_name, last_name, email, mobile ,password, role, status}=req.body
    //check all missing fields
    if(!email || !mobile || !first_name || !last_name || !role || !status || !password){
        return res.status(400).json({error:"please enter all the required fields"})

    }
    //email validation
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "please enter valid email id " })
    }
    //phone validation
    const phoneRegex=/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    if(!phoneRegex.test(mobile)){
        return res.status(400).json({error:"please enter valid mobile number"})
    }
    if (mobile.length< 10 ||mobile.length> 10 ) {
        return res.status(400).json({ error: "mobile must be atleast 10 characters long" })
    }
    //password validation
    if (password.length <= 6) {
        return res.status(400).json({ error: "password must be atleast 6 characters long" })
    }
    const ispasswordspecial=/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if(!ispasswordspecial.test(password)){
        return res.status(400).json({error:"password must contain atleast one special character"})

    }
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if(!isContainsUppercase.test(password)){
        return res.status(400).json({error:"password must contain atleast one capital letter"})

    }
    try {
        const ifUserAlreadyExists = await User.findOne({ email })
        if (ifUserAlreadyExists) {
            return res.status(400).json({ error: `A user with the ${email} already exists,so please try another email id` })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = new User({ first_name, last_name, email, mobile , password: hashedPassword,status,role })
        const result = await newUser.save()
        result._doc.password = undefined
        return res.status(200).json({ ...result._doc,message:"registered successfully" })
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message })

        
    }


})

//login
router.post("/login", async (req, res) => {
    const { email, password ,role } = req.body
    if (!email || !password || !role) {
        return res.status(400).json({ error: "please enter all the required fields" })
    }
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "please enter valid email id " })
    }
    try {
        const doesUserExists = await User.findOne({ email })
        if (!doesUserExists) {
            return res.status(400).json({ error: "invalid email id or password" })

        }
        //if there is a user
        const doesPasswordMatch = await bcrypt.compare(password, doesUserExists.password)
        if (!doesPasswordMatch) {
            return res.status(400).json({ error: "invalid email id or password" })
        }
        const payload = { _id: doesUserExists._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" })
        const user = { ...doesUserExists._doc, password: undefined }
        return res.status(200).json({ token,user ,message:"logged in successfully"})

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });

    }

})
router.get("/me",auth,async(req,res)=>{
    return res.status(200).json({...req.user._doc})
})

module.exports = router