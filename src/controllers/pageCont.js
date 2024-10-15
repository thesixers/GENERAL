const Food = require("../models/food");
const payment = require("../models/payment");
const paystack = require("paystack")(process.env.PAYSTACK_API_KEY);

module.exports = {
  index: async (req, res) => {
    const context = {};
    try {
      const _listedFood = await Food.find().populate("vendor");
      context["listedFood"] = _listedFood;

      res.render("./index", { context, res });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  register: (req, res) => {
    res.render("./register");
  },

  login: (req, res) => {
    res.render("./login");
  },

  details: async (req, res) => {
    const context = {};
    try {
      const _listedFood = await Food.findOne({
        _id: req.query.food_id,
      }).populate("vendor");
      context["listedFood"] = _listedFood;
      res.render("./vendorCustPage", { context, res });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  makePayment: async (req, res) => {
    const {
      food_id,
      cust_fName,
      custPhone_no,
      cust_email,
      cust_address,
      food_quantity,
    } = req.body;

    const cust_fNameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const custPhone_noReg = /^[0-9]+$/;
    const cust_emailReg = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;
    const cust_addressReg = /^[a-zA-Z0-9\s,.'-]{3,100}$/;
    const food_quantityReg = /^[0-9]+$/;

    try {
      // Validation
      if (!cust_fNameReg.test(cust_fName))
        throw new Error("Enter a valid Full name");
      if (!custPhone_noReg.test(custPhone_no))
        throw new Error("Enter a valid phone number");
      if (!cust_emailReg.test(cust_email))
        throw new Error("Enter a valid email address");
      if (!cust_addressReg.test(cust_address))
        throw new Error("Enter a correct home address");
      if (!food_quantityReg.test(food_quantity))
        throw new Error("Enter a valid quantity of food");


      // Calculate total amount to pay (in kobo for Paystack)
      const food = await Food.findOne()
      const amount = parseFloat(food.amount) * food_quantity * 100;
      
      // Initialize Paystack transaction
      const response = await paystack.transaction.initialize({
        email: cust_email,
        amount: amount,
        metadata: {
          cust_fName,
          custPhone_no,
          cust_address,
          food_id: food._id,
          food_quantity,
          cust_email: cust_email,
        },
        callback_url: `http://localhost:6001/payment/verify?food_id=${food_id}`, // Replace with your actual verification route
      });
      

      if (response.status) {
        return res.status(200).json({
          success: true,
          authorization_url: response.data.authorization_url,
          access_code: response.data.access_code,
          reference: response.data.reference,
        });
      } else {
        throw new Error("Failed to initialize transaction");
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  verifyPayment: async (req, res) => {
    const { reference } = req.query;    
    try {
      const response = await paystack.transaction.verify(reference);
      console.log(response);
      

      if (response.status && response.data.status === "success") {
        console.log(response.data.metadata);
        
        const foodOrderDetails = await payment.create({
          food_id:response.data.metadata.food_id,
          cust_fName:response.data.metadata.cust_fName,
          cust_email: response.data.metadata.cust_email,
          custPhone_no:response.data.metadata.custPhone_no,
          cust_address:response.data.metadata.cust_address,
          food_quantity:response.data.metadata.food_quantity,
          ref: response.data.reference,
          status: response.data.status,
          payment_date: response.data.paid_at,
          amount: response.data.amount,
        })
        console.log(foodOrderDetails);
        return res.render('./success')
        // Get the transaction details
        // return res.status(200).json({
        //   success: true,
        //   message: "Payment verified successfully",
        //   data: response.data,
        // });
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  success: (req, res) => {
    res.render("/success")
  }
};
