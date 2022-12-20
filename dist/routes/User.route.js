"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
// const { Router } = require('express');
const express_1 = require("express");
const Account_controller_1 = __importDefault(
  require("../controllers/Account.controller")
);
const User_controller_1 = __importDefault(
  require("../controllers/User.controller")
);
const verifyToken_1 = require("../middlewares/verifyToken.middleware");
const checkRole = require("../middlewares/checkrole.middleware");
const Login_middleware_1 = require("../middlewares/Login.middleware");
const route = (0, express_1.Router)();
route.post("/login", Account_controller_1.default.login);
route.post("/refreshToken", Account_controller_1.default.getAccessToken);
// route.post('/signUp', accountController.signUp);
route.post("/logout", Account_controller_1.default.logOut);
route.post("/newpass", Account_controller_1.default.newPass);
route.post("/newuser", User_controller_1.default.newUser);

route.post("/verifyOTP", User_controller_1.default.verifyOTPUser);
route.post("/createOtp", User_controller_1.default.createOtp);

//ROLE ADMIN
route.get(
  "/getall",
  [verifyToken_1.verifyToken, checkRole.checkroleAdmin],
  User_controller_1.default.getUsers
);

route.post("/fogotpass", User_controller_1.default.FogotPassword);

route.post(
  "/updateinfo",
  verifyToken_1.verifyToken,
  User_controller_1.default.updateUser
);
route.get(
  "/info",
  verifyToken_1.verifyToken,
  User_controller_1.default.getUserByUsername
);
module.exports = route;
