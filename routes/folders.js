var express = require("express");
var router = express.Router();
var folderController = require("../controllers/folderController");

/* GET users listing. */
router.get("/", folderController.getFolders);

router.get("/new", (req, res) => res.render("folder/folder-create-form"));
router.post("/new", folderController.createFolder);

router.get("/:id/edit", folderController.editFolder);
router.post("/:id/update", folderController.updateFolder);

router.post("/:id/delete", folderController.deleteFolder);

router.get("/:folderId/add-file", folderController.addFile);
module.exports = router;
