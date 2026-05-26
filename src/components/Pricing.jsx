"use client";

import loadRazorpay from "@/lib/loadRazorpay";

export default function Pricing() {

  const handlePayment = async () => {

    const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const response = await fetch("/api/razorpay", {
      method: "POST"
    });

    const data = await response.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "SkillVane IT academy",
      description: "GCP Data Engineering Training",
      order_id: data.id,

      handler: async function (response) {

        const verifyResponse = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(response)
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.success) {
          alert("Payment Successful!");
        } else {
          alert("Payment Verification Failed");
        }
      },

      theme: {
        color: "#7c3aed"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <section
      id="pricing"
      className="py-24 px-6 bg-slate-950"
    >
      <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">

        <h2 className="text-5xl font-bold">
          Pricing
        </h2>

        <p className="mt-6 text-gray-300">
          Complete GCP Data Engineering Program
        </p>

        <div className="mt-10 text-7xl font-bold gradient-text">
          ₹12,000
        </div>

        <button
          onClick={handlePayment}
          className="mt-10 bg-purple-600 hover:bg-purple-700 px-10 py-5 rounded-2xl text-xl font-bold transition"
        >
          Buy Now
        </button>
      </div>
    </section>
  );
}
