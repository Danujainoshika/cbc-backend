import mongoose  from "mongoose";

const productschema = new mongoose.Schema(
    {
        productID :{
            type : String,
            required : true,
            unique : true
        },

        name :{
            type : String,
            required : true,
        },

        altNames : {
            type : [String],
            default : [],
            required : true
        },

        description :{
            type : String,
            required : true
        },

        images :{
            type : [String],
            default : [],
            required : true
        },

        price :{
            type : Number,
            required : true
        },

        labelledPrice :{
            type : Number,
            required : true
        },

        Category : {
            type : String,
            required : true
        }




         
    }
)

const Product = mongoose.model("product",productschema);
export default Product;