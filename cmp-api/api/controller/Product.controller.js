import { getToken } from "../../utl/gettoken.js"
import  {Product} from "../models/product.js"

export const createProduct =async(req,res,next)=>{
    try{
      const {title,description,price,category,quantity}= req.body

      if(!title||!price){
        return res.status(400).json({
            message:"all fields are required "
        })
      }


      const  user = req.user;
      if(!user){
        return res.status(401).json({
          message:"user does mot exit "
        })
      }
      
      const images = req.files?.map((file)=>({
        url:file.path,
        public_id:file.filename,
      }))||[]// empty array 
        
      const product= await Product.create({
        title,
        description,
        price,
        quantity,
        category,
        seller:req.user.id,
        college :req.user.college,
        images,
      })
       return res.status(201).json({
        message:"product succesfully created "
       })
    //      console.log(req.user);
    // console.log(req.body);
    // console.log(req.file);
    }
    catch(err){
       return res.status(500).json({
        message:err.message
       })
    }
}

//read 
export const getAllProducts = async(req,res,next)=>{
  try{
    let filters = {
      inStock: true,
    }
    const token = req.cookies?.token
    if(token){
      const decoded = await jwt.verify(token, process.env.JWT_SECRET)
      filters.seller = {$ne: decoded.id}    // Get products where the seller is NOT equal to this user’s id”
    }
    const products = await Product.find(filters)
    if(products.length === 0){
      return res.status(404).json({
        message:"no products available",
      })
    }
    return res.status(200).json({
      data: products
    })

  }
  catch(err){
    return res.status(500).json({
      message:err.message,
    })
  }
} 
  // read 
 export const getMyListing = async(req,res,next)=>{
  try{
    let filter = {
      seller: req.user.id,
    }
    const products = await Product.find(filter).sort({
      createdAt: -1,
    })
    return res.status(200).json({
      data:products,
    })
  }
  catch(err){
    return res.status(500).json({
      message:err.message,
    })
  }
 }