const express = require("express");
const accountRouter = express.Router();
const accountController = require("../controllers/account.controller");

// user sign-up
accountRouter.post("/sign-up", accountController.signUp);

// user sign-in
accountRouter.post("/sign-in", accountController.signIn);

module.exports = accountRouter;
