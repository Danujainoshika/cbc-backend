import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productroutour.js";


const app = express();
// middle man to parse json body
app.use(express.json())
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization")
        if(token != null){
            token = token.replace("Bearer ","")
            
            jwt.verify(token,"jwt-secret",
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
const connectionstring = "mongodb+srv://Admindanuja:dnmongo123@cluster0.a0xqaus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(connectionstring).then(
    ()=>{
        console.log("database connected")
    }
).catch(
    ()=>{
        console.log("connection Failed")
    }
    
);


app.use("/users",userRouter);
app.use("/products",productRouter);




app.listen(5000,
    ()=>{console.log("Sever is started")

    }
);
