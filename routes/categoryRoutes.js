import express from 'express'
import { CategoryModel } from '../models/category.js'
import { userAuthenticate, authoriseRoles } from "../middleware/userMiddleware.js"

const app = express()
app.use(express.json())

//create category
app.post("/",async(req,res)=>{
    try{
        const category = req.body;
    await CategoryModel.create(category);
    return res.status(200).json({message:"category created successfully", category});
    }
    catch(err){
        return res.status(500).json({message:"Failed to create a category", err});
    }
})

//get all categories
app.get("/", async(req,res)=>{
    try{
        const categories = CategoryModel.find();
        return res.status(200).json({message:"fetched all categories successfully", categories})
    }
    catch(err){
        return res.status(500).json({message:"Failed to fetch categories", err});
    }
})

//get specific category by id
app.get("/:id", async(req,res)=>{
    try{
        const category = CategoryModel.findById(req.params.id);
        return res.status(200).json({message:"fetched category successfully", category})
    }
    catch(err){
        return res.status(500).json({message:"Failed to fetch category", err});
    }
})

//update a categpry
app.put("/:id", async(req,res)=>{
    try{
        const updatedCategory = CategoryModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        return res.status(200).json({message:"updated category successfully", updatedCategory});
    }
    catch(err){
        return res.status(500).json({message:"could not update category", err});
    }
})

//delete a category
app.delete("/:id", async(req,res)=>{
    try{
        const deletedCategory = CategoryModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"deleted category successfully", deletedCategory});
    }
    catch(err){
        return res.status(500).json({message:"could not delete category", err});
    }
})

export default app;