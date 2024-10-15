const authCont = require("../controllers/authCont");
const express = require("express");
const {profileHandler} = require('../helpers/img_handler');


const route = express.Router();

route.post("/register", profileHandler, authCont.register);
route.post("/login", authCont.login);
route.get('/user-logout', authCont.user_logout);



module.exports = route;