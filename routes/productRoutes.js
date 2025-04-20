import express from 'express'
import { ProductModel } from '../models/product.js'
import { userAuthenticate, authoriseRoles } from "../middleware/userMiddleware.js"

const app = express()
app.use(express.json())

//add new product 
app.post("/",userAuthenticate, authoriseRoles("admin"),async(req,res)=>{
    try{
        const productDetails = req.body;
        await ProductModel.create(productDetails);
        return res.status(200).json({message:"Product added successfully", productDetails});
    }
    catch(err){
        return res.status(500).json({message:"Failed to add product"});
    }
})

//get all products
app.get("/", async(req,res)=>{
    try{
        const products = await ProductModel.find();
        return res.status(200).json({message:"Products fetched successfully", products});
    }
    catch(err){
        return res.status(500).json({message:"Failed to fetch products", err});
    }
})

//get product by id
app.get("/:id", async(req,res)=>{
    try{
        const product = ProductModel.findById(req.params.id);
        if(!product){
            return res.status(403).json({message:"product not found"});
        }
        return res.status(200).json({message:"Product details fetched successfully", product});
    }
    catch(err){
        return res.status(500).json({message:"could not fetch the product details", err});
    }
})

//edit product details - admin only
app.put("/:id",userAuthenticate, authoriseRoles("admin"), async(req,res)=>{
    try{
        const updatedProductdetails= ProductModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.status(200).json({message:"product details updated successfully", updatedProductdetails})
    }
    catch(err){
        return res.status(500).json({message:"could not update the product details", err});
    }
})

//delete product - admin only
app.delete("/:id",userAuthenticate, authoriseRoles("admin"), async(req,res)=>{
    try{
        const deletedProductDetails = ProductModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"product deleted successfully", deletedProductDetails});
    }
    catch(err){
        return res.status(500).json({message:"could not delete the product", err});
    }
})

//get products by category
app.get("category/:categoryId", async(req,res)=>{
    try{
        const productsByCategory = ProductModel.findById(req.params.id);
        return res.status(200).json({message:"fetched product details based on category", productsByCategory});
    }
    catch(err){
        return res.status(500).json({message:"could not fetch the products based on category", err});
    }
})

//get products by brandName
app.get("/brand/:brandName", async(req,res)=>{
    try{
        const productsByBrandName = ProductModel.findById(req.params.id);
        return res.status(200).json({message:"fetched product details based on Brand Name", productsByBrandName});
    }
    catch(err){
        return res.status(500).json({message:"could not fetch the products based on Brand Name", err});
    }
})

//update product stock by admin
app.put("/:id/stock", userAuthenticate, authoriseRoles("admin"), async(req,res)=>{
    try{
        const updatedProduct = ProductModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        return res.status(200).json({message:`updated ${updatedProduct.name} successfully`});
    }
    catch(err){
        return res.status(500).json({message:"could not update product stock details", err});
    }
})



export default app;
