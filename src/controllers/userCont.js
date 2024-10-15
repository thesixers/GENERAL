const Food = require("../models/food");
const Payment = require("../models/payment");

module.exports = {
  dashboard: (req, res) => {
    res.render("./dashboard", { res });
  },

  listedItem: async (req, res) => {
    const context = {};
    try {
      const _listedFood = await Food.find().populate("vendor");
      console.log(_listedFood);

      context["listedFood"] = _listedFood;

      return res.render("./viewListedItems", { context, res });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  get_postFood: (req, res) => {
    res.render("./postFood", { res });
  },

  postFood: async (req, res) => {
    const { name, amount, description } = req.body;

    const nameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const amountReg = /^\d+(\.\d{1,2})?$/;
    const descriptionReg = /^[a-zA-Z0-9\s,.'()\-!]+$/;

    try {
      const img = req.file ? req.file.filename : null;

      if (!nameReg.test(name)) {
        throw new Error("Invalid food name format");
      }

      if (!amountReg.test(amount)) {
        throw new Error("Invalid amount format");
      }

      if (!descriptionReg.test(description)) {
        throw new Error("Invalid description input");
      }

      if (!img) {
        throw new Error("Upload food picture");
      }

      //   db
      const food = await Food.create({
        vendor: req.vendor,
        name,
        amount,
        img,
        description,
      });
      return res.status(200).json({
        success: true,
        msg: "Food published successfully",
        redirectURL: "/foods-published",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  customerOrder: (req, res) => {
    res.render("./customerOrders", { res });
  },

  payments: async(req, res) => {
    const context = {};
    try {
      const _payment = await Payment.find().populate('food_id');
      context["payments"] = _payment;

      console.log(_payment);
      return res.render("./payments", { context, res });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  transactionReceipt: async(req, res) => {
    const context = {};
    try {
      const _payment = await Payment.find().populate('food_id');
      context["payments"] = _payment;
      return res.render("./transactionReceipt", {context, res });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
