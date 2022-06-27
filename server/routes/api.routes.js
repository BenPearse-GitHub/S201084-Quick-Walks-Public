const express = require("express");
const router = express.Router();

router.use("/accounts", require("./account.routes"));
router.use("/users", require("./user.routes"));
router.use("/routes", require("./route.routes"));

module.exports = router;
