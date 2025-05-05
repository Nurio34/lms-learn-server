const express = require("express");
const { ping } = require("../controllers/ping");
const router = express.Router();

router.get("/", ping);

module.exports = router;
