import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'


const app = express();
dotenv.config();
app.use(express.json());

// MongoDB connection
const connectDB = await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        const db= mongoose.connection;
        //console.log(db);
        console.log("MongoDB connected");
    })
    .catch((err)=>{
        console.log(`MongoDB connection error: ${err}`)
    })

app.use("/api", userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/cart", cartRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})