import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// ==============================
// MIDDLEWARE
// ==============================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());


// ==============================
// RAZORPAY
// ==============================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ==============================
// HEALTH CHECK
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Luv03 payment server is running",
  });
});


// ==============================
// CREATE RAZORPAY ORDER
// ==============================

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const {
      amount,
      receipt,
    } = req.body;


    // Validate amount
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }


    const amountInPaise = Math.round(
      Number(amount) * 100
    );


    const options = {
      amount: amountInPaise,

      currency: "INR",

      receipt:
        receipt ||
        `luv03_${Date.now()}`,

      payment_capture: 1,
    };


    const order =
      await razorpay.orders.create(options);


    return res.status(200).json({
      success: true,

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });

  } catch (error) {

    console.error(
      "Razorpay order creation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Could not create Razorpay order",
    });
  }
});


// ==============================
// VERIFY PAYMENT
// ==============================

app.post("/api/payment/verify", async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;


    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }


    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");


    const expectedBuffer =
      Buffer.from(generatedSignature, "utf8");

    const receivedBuffer =
      Buffer.from(razorpay_signature, "utf8");


    if (
      expectedBuffer.length !==
      receivedBuffer.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }


    const isValid =
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );


    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
    });

  } catch (error) {

    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});


// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {
  console.log(
    `Luv03 payment server running on http://localhost:${PORT}`
  );
});