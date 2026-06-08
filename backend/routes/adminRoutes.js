const express = require("express");
const { getAdminStats } = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/stats", auth, getAdminStats);
module.exports = router;
