import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Auth"
    },buyerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Auth"
    },productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        default:1,
        required:true
    },
    status:{
        type:String,
        enum:["done"],
        default:"done"
    }

    
},{
    timestamps:true
})

export const Order= mongoose.model("Order",orderSchema)