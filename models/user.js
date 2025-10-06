import mongoose from "mongoose";

const userschema = new mongoose.Schema(
    {
        email : {
            type : String,
            required :true,
            unique : true

        },
        firstname :{
            type : String,
            required : true
        },
        lastname :{
            type :String,
            required:true
        },
        password :{
            type : String,
            required : true
        },
        role :{
            type : String,
            required : true,
            default : "user"
        },
        isBlock :{
            type : Boolean,
            default : false
        },
        image : {
            type :String,
            default :"https://www.gravatar.com/avatar/"
        }

    }

)

const User = mongoose.model("user",userschema);
export default User