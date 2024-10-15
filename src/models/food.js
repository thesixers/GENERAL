const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true
  },
  name: {
    type: String, 
    required: true
  },

  img: {
    type: String,
    required: true,
  },

  amount: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

const Food = mongoose.model("food", foodSchema);
module.exports = Food;