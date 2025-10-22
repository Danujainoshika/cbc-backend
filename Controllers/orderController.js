
import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {
      
      try {
        const user = req.user;
        if(user == null){
         res.status(401).json(
            { 
            message: "Unauthorized user" 
            }
        );
        return;
        }
        const orderList = await Order.find().sort({date:-1}).limit(1);
        

        let newOrderId = "CBC0000001";

        if(orderList.length != 0 ){
            let lastOrderInString = orderList[0].orderID
            let lastOrderNumberInString = lastOrderInString.replace("CBC","")
            let lastOrderNumber = parseInt(lastOrderNumberInString)
            let newOrderNumber = lastOrderNumber + 1
            let newOrderNumberInString = newOrderNumber.toString().padStart(7,'0')
            newOrderId = "CBC" + newOrderNumberInString

        }
        

        let customerName = req.body.customerName;
        if(customerName == null){
            customerName = user.firstname + " " +user.lastname
        }
        
        let phone = req.body.phone;
        if(phone == null){
            phone = "Not provided"
        }

        const itemInRequest = req.body.items;

        if(itemInRequest == null){
            res.status(400).json(
                { 
                    message: "Items are required to place an order" 
                })
            return
        }

        if(!Array.isArray(itemInRequest)){
            res.status(400).json(
                { 
                    message: "Items should be an array" 
                })
            return
        }
        const itemsToBeAdded = [];
        let total = 0;
        for(let i=0;i<itemInRequest.length;i++){
            const item = itemInRequest[i]
            const product = await Product.findOne({productID : item.productID})

            if(product == null){
                res.status(400).json(
                    { 
                        code : "Not found",
                        message: `Product with ID ${item.productID} not found` ,
                        productID : item.productID
                    })
                return
            }

            if(product.stock < item.quantity){
                res.status(400).json(
                    { 
                        code : "stock",
                        message: `Insufficient stock for product ID ${item.productID}` ,
                        productID : item.productID,
                        availableStock : product.stock
                    })
                return
            }
            itemsToBeAdded.push({
                productID : product.productID,
                quantity : item.quantity,
                name : product.name,
                price : product.price,
                image : product.images[0]
            })  
            total += product.price * item.quantity;
        }
        const newOrder = new Order({
            orderID : newOrderId,
            customerName : customerName,
            email : user.email,
            phone : phone,
            address : req.body.address,
            total : total,
            items : itemsToBeAdded,
            status : "pending"
        })
        
        const savedOrder = await newOrder.save()
        /*for(let i=0;i<itemInRequest.length;i++){
            const item = itemInRequest[i]
            await Product.updateOne()(
                { productID : item.productID },
                { $inc: { stock: -item.quantity } }
            );
        }*/
        res.status(201).json(
            { 
                message: "Order created successfully", 
                orderID: savedOrder 
            });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json(
            { 
                message: "Internal server error" ,
               
            });
      }
}

export async function getOrders(req, res) {
    if(isAdmin(req)){
        const orders = await Order.find().sort({date:-1})
        res.json(orders)
    }else if(isCustomer(req)){
        const user = req.user
        const orders = (await Order.find({email : user.email})).sort({date:-1})
    }else{
        res.status(401).json(
            { 
                message: "you are not authorized to view orders" 
            })
    }
}