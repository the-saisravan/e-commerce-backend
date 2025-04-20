import express from 'express'
import { CartModel } from '../models/cart';
import { userAuthenticate } from '../middleware/userMiddleware';
import { ProductModel } from '../models/product';

const app = express;
app.use(express.json());

//add item to cart
app.post("/cart/add", userAuthenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.statu(404).json({ message: "Product not found" });
        }
        let cart = await CartModel.findOne({ user: userId });
        //if no cart exist for user
        if (!cart) {
            const newCart = new CartModel({
                user: userId,
                items: [{ product: productId, quantity }],
                totalPrice: product.price * quantity,
            });
            await newCart.save();
            return res.status(200).json({ message: "Cart created", cart: newCart });
        }

        //cart already exists - check for product in the cart
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        }
        else { // add new product to items
            cart.items.push({ product: productId, quantity });
        }

        //calculating the totol price now
        cart.totalPrice = 0
        for (let item of cart.items) {
            const prod = await Product.findById(item.product);
            cart.totalPrice += prod.price * item.quantity;
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });
    }
    catch (error) {
        console.error("Add to cart failed:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

})

//delete a product from cart
app.delete("/remove/:productId", userAuthenticate, async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "cart not found" });
        }
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );
        if (itemIndex === -1) {
            return res.status(404).json({ message: "product not found in cart" });
        }

        cart.items.splice(itemIndex, 1);

        let newTotal = 0;
        for (const item of cart.items) {
            const prod = await ProductModel.findById(item.product);
            newTotal += prod.price * item.quantity;
        }

        cart.totalPrice = newTotal;
        await cart.save();

        res.status(200).json({ message: "item removed from cart", cart });
    }
    catch (err) {
        return res.status(500).json({ message: "could not remove the item", err });
    }

})

//update quantity of cart items 
app.put("/update/:productId", userAuthenticate, async(req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    try {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "cart not found" });
        }
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );
        if (itemIndex === -1) {
            return res.status(404).json({ message: "product not found in cart" });
        }

        cart.items[itemIndex].quantity = quantity;

        let newTotal = 0;
        for (const item of cart.items) {
            const prod = await ProductModel.findById(item.product);
            newTotal += prod.price * item.quantity;
        }

        cart.totalPrice = newTotal;
        await cart.save();
        return res.status(200).json({message: "cart updated successfully", cart});
    }
    catch(err){
        return res.status(500).json({message:"could not update the cart", err});
    }
})




export default app;