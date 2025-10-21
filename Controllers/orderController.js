import Order from "../models/order.js";

export async function createOrder(req, res) {
      if(req.user == null){
         res.status(401).json(
            { 
            message: "Unauthorized user" 
            }
        );
        return;
      }
      try {
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

        const newOrder = new Order({
            orderID : newOrderId,
            items :[],
            customerName : req.body.customerName,
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address,
            total : req.body.total,
            status : "pending"
        })

        const savedOrder = await newOrder.save()
        res.status(201).json(
            { 
                message: "Order created successfully", 
                orderID: savedOrder 
            });
      } catch (error) {
        res.status(500).json(
            { 
                message: "Internal server error" 
            });
      }
}