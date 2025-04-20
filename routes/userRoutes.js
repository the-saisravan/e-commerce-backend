import express from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {UserModel} from '../models/user.js'
import { userAuthenticate, authoriseRoles } from "../middleware/userMiddleware.js"

const app = express();
app.use(express.json());

//register a new user
app.post('/register', async (req,res)=>{
    const userDetails = req.body;
    const email = userDetails.email;
    const password = userDetails.password;
    const userExists = await UserModel.findOne({email: email});
    if(userExists){
        return res.status(409).json({message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    userDetails.password = hashedPassword;
    await UserModel.create(userDetails);
    return res.status(200).json({message: "user registered successfully"});
    // return res.status(200).json({message: "user registered successfully", user: newUser});
})

//user login
app.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    const userExists = await UserModel.findOne({email: email});
    if(!userExists){
        return res.status(404).json({message: " user doesnot exit"});
    }
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid password"});
    }
    const token = jwt.sign({id: userExists._id, role: userExists.role}, process.env.JWT_SECRET, {expiresIn: '48h'});
    return res.status(200).json({message: "user logged in successfully", token});
})

//get all users
// app.get('/users', async(req,res)=>{
//     const users = await UserModel.find().select("-password");
//     return res.status(200).json({message: "users fetched successfully", users});
// })


//get all users - admin only - RBAC
app.get("/users", userAuthenticate, authoriseRoles("admin"), async(req,res)=>{
    try{
        const users = await UserModel.find();
        return res.status(200).json({message: "fetched all users successfully", users});
    }
    catch(err){
        res.json(500).json({message:"could not fetch users", err});
    }
})



//get user by id - user profile
// app.get("/user/:id", async(req,res)=>{

//     const user = await UserModel.findById(req.params.id).select("-password");
//     if(!user){
//         return res.status(404).json({message: "user doesnot exit"});
//     }
//     return res.status(200).json({message: "user fetched successfully", user});
// })

//get user by id : profile - authentication impl

app.get("/user/:id", userAuthenticate, async(req,res)=>{
    if(req.user.id === req.params.id){
        const user = await UserModel.findById(req.params.id).select("-password");
        if(!user){
            return res.status(404).json({message: "user doesnot exit"});
        }
        return res.status(200).json({message: "user fetched successfully", user});
    }
})



//update user details
app.put("/user/:id", async(req, res)=>{
    const user = await UserModel.findById(req.params.id);
    if(!user){
        return res.status(404).json({message: "user doesnot exit"});
    }
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true}).select("-password");
    return res.status(200).json({message: "user updated successfully", user: updatedUser});
})

//delete user
// app.delete("/user/:id", async(req, res)=>{
//     const user = await UserModel.findById(req.params.id);
//     if(!user){
//         return res.status(404).json({message: "user doesnot exit"});
//     }
//     await UserModel.findByIdAndDelete(req.params.id);
//     return res.status(200).json({message: "user deleted successfully"});
// })


//delete user by id (admin) - RBAC
app.delete("/user/:id", userAuthenticate, authoriseRoles, async (req,res)=>{
    try{
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json({message:"user deleted successfully"});
    }
    catch(err){
        return res.json(500).json({errrorMessage:"could not delete the user", err});
    }
})

//change user role
app.put("/user/:id/role",async(req,res)=>{
    const user = await UserModel.findById(req.params.id);
    if(!user){
        return res.status(404).json({message: "user doesnot exist"});
    }
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body,{new: true}).select("-password");
    return res.status(200).json({message: "role updated successfully", user: updatedUser});
})

//get user address info
app.get("user/:id/address", async(req,res)=>{
    const user = await UserModel.findById(req.params.id);
    if(!user){
        return res.status(404).json({message: "user doesnot exist"});
    }
    const address= user.address;
    if(!address){
        return res.status(404).json({message: " user address doesnot exist"});
    }
    return res.status(200).json({message:"user address fetched successfully", address});
})


//exporting the routes
export default app;