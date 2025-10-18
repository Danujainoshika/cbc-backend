import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productroutour.js";
import cors from "cors";
import dotenv from "dotenv"
import orderRouter from "./routes/orderRouter.js";

dotenv.config();
const app = express();
app.use(cors())
// middle man to parse json body
app.use(express.json())

app.use(
    (req,res,next)=>{
        let token = req.header("Authorization")
        if(token != null){
            token = token.replace("Bearer ","")
            
            jwt.verify(token,process.env.JWT_SECRET,
                (err,decoded)=>{
                    if(decoded == null){
                        res.json(
                            {
                                message : "Invalid token please login again"
                            }
                        )
                        return
                    }else{
                        req.user = decoded;
                    }
                }
            )
        }
        next();
    } 
)
const connectionstring = process.env.mongo_URI;
mongoose.connect(connectionstring).then(
    ()=>{
        console.log("database connected")
    }
).catch(
    ()=>{
        console.log("connection Failed")
    }
    
);


app.use("/api/users",userRouter);
app.use("/api/products",productRouter);
app.use("/api/orders",orderRouter);




app.listen(5000,
    ()=>{console.log("Sever is started")

    }
);
