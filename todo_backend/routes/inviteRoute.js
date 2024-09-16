const express = require("express");
const auth = require("../middlewares/authorize");
const inviteController = require("../controllers/inviteController");
const router = express.Router();

router.post("/invitation", inviteController.invitation);

module.exports = router;

// http://localhost:4001/api/invites/invitation