import { Product } from "../models/product.js";
import { Order } from "../models/order.schema.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const buyerId = req.user.id;

    // Validation
    if (!productId || !quantity) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Find Product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Prevent self purchase
    if (product.seller.toString() === buyerId.toString()) {
      return res.status(400).json({
        message: "You cannot buy your own product",
      });
    }

    // Check stock
    if (product.quantity < quantity) {
      return res.status(400).json({
        message: "Insufficient product quantity",
      });
    }

    // Update stock
    product.quantity -= quantity;

    // Mark out of stock
    if (product.quantity <= 0) {
      product.inStock = false;
    }

    await product.save();

    // Calculate total amount
    const totalAmount = product.price * quantity;

    // Create Order
    const order = await Order.create({
      productId: product._id,
      sellerId: product.seller,
      buyerId,
      quantity,
      totalAmount,
    });

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get My Purchases
export const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Order.find({
      buyerId: req.user.id,
    })
      .populate("productId")
      .populate("sellerId", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: purchases,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get My Sales
export const getMySales = async (req, res) => {
  try {
    const sales = await Order.find({
      sellerId: req.user.id,
    })
      .populate("productId")
      .populate("buyerId", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: sales,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get All My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { buyerId: req.user.id },
        { sellerId: req.user.id },
      ],
    })
      .populate("productId")
      .populate("sellerId", "userName email")
      .populate("buyerId", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};