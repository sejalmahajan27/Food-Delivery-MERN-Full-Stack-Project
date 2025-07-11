import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "https://food-delivery-mern-full-stack-project-k4sh.onrender.com";
  const USD_TO_INR = 83; // approx. conversion rate

  try {
    const newOrder = new orderModel({
      userId: req.userId,                      
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    // ✅ Fix: Use req.userId to clear cart
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * USD_TO_INR * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery charge
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * USD_TO_INR * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    console.log("Stripe session created:", session.url);
    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.json({ success: false, message: "Stripe Checkout Error" });
  }
};

// ✅ VERIFY ORDER
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  console.log("🔄 VERIFY ORDER CALLED");
  console.log("➡️  success =", success, "| typeof =", typeof success);
  console.log("➡️  orderId =", orderId);

  try {
    if (success === true || success === "true") {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true, paidAt: new Date() },
        { new: true }
      );

      if (!updatedOrder) {
        console.log("❌ Order not found");
        return res.json({ success: false, message: "Order not found" });
      }

      console.log("✅ Order updated:", updatedOrder);
      res.json({ success: true, message: "Paid", order: updatedOrder });
    } else {
      const deleted = await orderModel.findByIdAndDelete(orderId);
      console.log("❌ Order deleted:", deleted);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error("❌ verifyOrder ERROR:", error.message);
    res.json({ success: false, message: "Verification Error" });
  }
};

// user orders for frontend
const userOrders = async (req,res) => {
  try {
    const orders = await orderModel.find({userId:req.userId});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
  }
}
// Listing orders for admin
const listOrders = async(req,res)=>{
  try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})  
  }
}

// api for updating order status
const updateStatus = async(req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,mesage:"Status Updated!"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
  }
}


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
