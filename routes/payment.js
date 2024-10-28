const express = require("express");
const { makeRequest } = require("../controllers/payment");
const router = express.Router();

router.post("/request", makeRequest);

module.exports = router;
