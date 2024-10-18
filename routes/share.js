var express = require("express");
var router = express.Router();
let shareController = require("../controllers/shareController");
// Share file or folder route
router.post("/", shareController.createShareItemLink);

// Access shared file or folder route
//router.get("/share/:token", fileController.accessSharedItem);

module.exports = router;