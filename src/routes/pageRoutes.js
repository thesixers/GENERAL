const pageCont = require("../controllers/pageCont");
const express = require("express");


const router = express.Router();

router.get("/", pageCont.index);
router.get("/register", pageCont.register);
router.get("/login", pageCont.login);
router.get("/vendorCustPage", pageCont.details);
router.post('/payment/make', pageCont.makePayment);
router.get('/payment/verify', pageCont.verifyPayment);
router.get('/success', pageCont.success);

module.exports = router;