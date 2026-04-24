const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authOwner = async (req,res,next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decode.id)
        if(!user){
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        if(user.role !== "owner"){
            return res.status(403).json({
                message: "Forbidden: U are Not Allowed"
            })
        }
        req.user = user;
        next();
    }
    catch(err){
        return res.status(500).json({
            message: "Error in owner auth",
            error: err.message
        })
    }
}

const authTenant = async (req,res,next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decode.id);
        if(!user){
            return res.status(401).json({
                message: "User not found"
            })
        }
        if(user.role !== "tenant" || user.role !== "owner"){
            return res.status(403).json({
                message: "Forbidden: U are Not Allowed"
            });
        }
        req.user = user;
        next();
    }
    catch(err){
        return res.status(500).json({
            message: "Error in tenant auth",
            error: err.message
        })
    }
}

const authUser = async (req,res,next) =>{
    try{

        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: "No token Found, login Please"})
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decode.id);
        if(!user){
            return res.status(404).json({
                message: "User Not Found"
            })
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(500).json({
            message: "Error in user auth",
            error: err.message
        })
    }
}
module.exports = {authOwner, authTenant, authUser};
