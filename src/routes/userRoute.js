const express = require('express');
const userCont = require('../controllers/userCont');
const {profileHandler} = require('../helpers/img_handler');
const { checkVendor } = require('../middlewares/authMiddleware')


const router = express.Router();

router.get('/dashboard', checkVendor, userCont.dashboard);

router.get('/foods-published', checkVendor, userCont.listedItem);

router.post('/post-food', checkVendor, profileHandler, userCont.postFood);

router.get('/post-food', checkVendor, userCont.get_postFood);

router.get('/customers-order', checkVendor, userCont.customerOrder);

router.get('/payments', checkVendor, userCont.payments);

router.get('/transactions', checkVendor, userCont.transactionReceipt);



module.exports = router;