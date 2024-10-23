var express = require("express");
var router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
var fileController = require("../controllers/fileController");

router.post(
  "/upload/:folderId?",
  upload.single("uploaded_file"),
  fileController.uploadFile
);

router.get("/:fileId/edit", fileController.editFile);

router.post("/:fileId/update", fileController.updateFile);

router.post("/:id/delete", fileController.deleteFile);

module.exports = router;
