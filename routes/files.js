var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./public/data/uploads/" });
var fileController = require("../controllers/fileController");

router.post(
  "/upload/:folderId",
  upload.single("uploaded_file"),
  fileController.uploadFile
);

router.get("/:fileId/edit", fileController.editFile);

router.post("/:fileId/update", fileController.updateFile);

module.exports = router;
