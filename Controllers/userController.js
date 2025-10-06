import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req,res){

    const hashedPassword = bcrypt.hashSync(req.body.password,10)
    const user = new User(
        {
            email : req.body.email,
            firstname: req.body.firstname,
            lastname:req.body.lastname,
            password:hashedPassword
        }
        
    )

    user.save().then(
        ()=>{
            res.json(
                {
                    message:"user created successfully"
                }
            )
        }
    ).catch(
        ()=>{
            res.json(
                {
                    message:"user not created"
                }
            )
        }
    )

}

export function loginUser(req,res){
    User.findOne(
        {
            email : req.body.email
        }
    ).then(
        (user)=>{
            if(user == null){
                res.json(
                    {
                        message : "user not found"
                    }
                )
            }else{
                const isPasswordMaching = bcrypt.compareSync(req.body.password,user.password);
                if(isPasswordMaching){
                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstname : user.firstname,
                            lastname : user.lastname,
                            role : user.role,
                            isEmailVerified : user.isEmailVerified

                        },"jwt-secret"
                    )
                     
                    res.json(
                    {
                        message : "login successfull",
                        token : token
                    }
                )
                }else{
                    res.json(
                        {
                            message : "invalide password"
                        }
                    )
                }
                
            }
        }
    )
}


export function isAdmin(req){
    if(req.user == null){
        return false
    }

    if (req.user.role != "admin"){
        return false
    }

    return true
}

export function isCustomer(req){
    if(req.user == null){
        return false
    }
    if(req.user.role != "user"){
        return false
    }
    return true
}