import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function craeteProduct(req,res) {
    if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "you are not authorized to craete a product"
            }
        )
        return
    }
    try {
        const productData = req.body;
        const product = new Product(productData)

        await product.save();
        
        res.json(
            {
                message : "product created successfully",
                product : product
            }
            
        )
    } catch (error) {
        console.error(error)
        res.status(500).json(
            {
                message : "Failed to craete product"
            }
        )
    }
    
}

export async function getProduct(req,res) {
    try {
        const products = await Product.find();
        res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json(
            {
                message : "Failed to retrieve products"
            }
        )
    }
}


export async function deleteProduct(req,res) {
    if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "you are not authorized to delete a product"
            }
        )
        return
    }
    try {
        const productID = req.params.productID;
        await Product.deleteOne({
            productID : productID
        })
        res.json(
            {
                message : "product deleted sucessfully"
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json(
            {
                message : "Failed to delete product"
            }
        )
    }
    
    

}

export async function updateProduct(req,res) {
    if(!isAdmin(req)){
        res.status(403).json(
            {
                message : "you are not authorized to craete a product"
            }
        )
        return
    }
    try {
        const productID = req.params.productID;
        const updateData = req.body;
        await Product.updateOne(
            {productID:productID},
            updateData
        );
        res.json(
            {
                message : "product update successfully"
            }
        );
    } catch (error) {
        console.error(error);
        res.json(
            {
                message : "Failed to update product"
            }
        )
    }
}

export async function getProductID(req,res) {
    try {
        const productID = req.params.productID
        const product = await Product.findOne(
            {
                productID : productID
            }
        )
        if(product == null){
            res.status(404).json(
                {
                    message : "product not found"
                }
            )
        }else{
            res.json(product)
        }
        
    } catch (error) {
        
    }
}