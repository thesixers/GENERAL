const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  food_id: {
    type: mongoose.Schema.ObjectId,
    ref: "food",
    required: true
  },

  cust_fName: {
    type: String,
    required: true
  },

  custPhone_no: {
    type: String,
    required: true
  },

  cust_email: {
    type: String,
    required: true
  },

  cust_address: {
    type: String,
    required: true
  },

  food_quantity: {
    type: String,
    required: true
  },
  ref: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  payment_date: {
    type: String,
    required: true,
    set: (value) => {
      return value.split('T')[0];
    }
  },
  amount: {
    type: Number,
    required: true
  },
  
});

const Payment = mongoose.model("payment", paymentSchema);
module.exports = Payment;
