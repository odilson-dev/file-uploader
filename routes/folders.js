var express = require("express");
var router = express.Router();
var folderController = require("../controllers/folderController");

/* GET users listing. */
router.get("/", folderController.getFolders);

router.post("/new", folderController.createFolder);
router.get("/new", (req, res) => res.render("folder/folder-create-form"));
module.exports = router;
