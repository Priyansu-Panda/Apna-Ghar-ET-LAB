const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req,res)=>{
    try{
        const {username, email, phone, password, role} = req.body;
        
        const isUserExist = await userModel.findOne({
            $or: [{email},{phone}]
        })

        if(isUserExist){
            return res.status(400).json({
                message: "User already exist"
            })
        }

        const hashPass = await bcrypt.hash(password,10);

        const user = await userModel.create({
            username,
            email,
            phone,
            password: hashPass,
            role
        });

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        res.cookie("token", token);

        return res.status(201).json({
            message: "User registered successfully",
            user,
            token
        })

    }catch(err){
        return res.status(500).json({
            message: "Error in user registration",
            error: err.message
        });
    }
}

async function loginUser(req,res){
    try{
        const {email,phone,password} = req.body;
        const user = await userModel.findOne({
            $or: [{email}, {phone}]
        })
        if(!user){
            return res.status(404).json({
                message: "User Not found"
            })
        }
        const decodePass = await bcrypt.compare(password, user.password);
        if(!decodePass){
            return res.status(401).json({
                message: "Incorrect Password"
            })
        }
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET,{expiresIn:"1d"});
        res.cookie("token", token);

        return res.status(201).json({
            message: "User logged in successfully",
            user,
            token
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Error in user login",
            error: err.message
        });
    }
}

async function logoutUser(req,res){
    try{
        res.clearCookie("token");
        return res.status(200).json({
            message: "User logged out successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            message: "Error in user logout",
            error: err.message
        });
    }
}

module.exports = {registerUser, loginUser, logoutUser};