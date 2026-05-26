import Razorpay from "razorpay";

export async function POST() {

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const options = {
    amount: 12000 * 100,
    currency: "INR",
    receipt: "receipt_order_1"
  };

  try {

    const order = await razorpay.orders.create(options);

    return Response.json(order);

  } catch (error) {

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
