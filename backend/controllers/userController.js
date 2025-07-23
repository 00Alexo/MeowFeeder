const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(8)
.has().uppercase()
.has().lowercase()
.has().digits(1)

const createToken = (_id) =>{
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const signup = async(req, res) =>{
    try{
        const {email, password, confirmPassword} = req.body;
        const saltRounds = 12; let errorFields = [];

        if (!email) errorFields.push({field: "email", error: "This field is required!"});
        if (!password) errorFields.push({field: "pass", error: "This field is required!"});
        if (!confirmPassword) errorFields.push({field: "cpass", error: "This field is required!"});

        if (errorFields.length > 0) 
            return res.status(400).json({error: 'All fields are required!', errorFields: errorFields});

        if(!email.includes('@') && !email.includes('+') && !email.includes('%')){
            errorFields.push({field: "email", error: "Invalid email!"});
            return res.status(400).json({error:"Invalid email!", errorFields: errorFields});
        }

        const existingEmail = await userModel.findOne({email})
        if(existingEmail){
            errorFields.push({field: "email", error: "Email is already in use!"});
            return res.status(400).json({error:'Email is already in use!', errorFields: errorFields})
        }

        if(!schema.validate(password)){
            errorFields.push({field: "pass", error: "Password must be at least 8 characters long, contain an uppercase letter and a number!"});
            errorFields.push({field: "cpass", error: ""});
            return res.status(400).json({error: 'Password must be at least 8 characters long, contain an uppercase letter and a number!', errorFields: errorFields})
        }

        if(password !== confirmPassword){
            errorFields.push({field: "pass", error: "Passwords do not match!"});
            errorFields.push({field: "cpass", error: ""});
            return res.status(400).json({error:"Passwords do not match!", errorFields: errorFields});
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const data = {
            email: email,
            password: hashedPassword,
            devices: ['6866adc4845d2990e46152df'] // for testing purposes (demo)
        }

        const user = await userModel.create(data);
        const token = createToken(user._id);

        res.status(200).json({username:data.email, token});
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const signin = async(req, res)=>{
    try{
        const {email, password} = req.body;
        let errorFields = [];

        if (!email) errorFields.push({field: "email", error: "This field is required!"});
        if (!password) errorFields.push({field: "pass", error: "This field is required!"});
        if (errorFields.length > 0) {
            return res.status(400).json({error: 'All fields are required!', errorFields: errorFields});
        }

        user = await userModel.findOne({email});

        if(user){
            const passMatch = await bcrypt.compare(password, user.password);

            if(passMatch){
                const token = createToken(user._id)

                res.status(200).json({username:user.email, token});
            }
            else{
                errorFields.push({field: "pass", error: "Incorrect password!"});
                return res.status(400).json({error: 'Incorrect password!', errorFields});
            }
        }
        else
            return res.status(400).json({error: 'Account does not exist!', errorFields: [{field:"email", error:"This account does not exist!"}]} );
    }catch(error){
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    signup,
    signin
}