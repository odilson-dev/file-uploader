const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
// Create a new user
const uploadFile = asyncHandler(async (req, res) => {
  try {
    // Check if the file was uploaded successfully
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Get file details from req.file (handled by Multer)
    const { originalname, filename, size, mimetype } = req.file;
    const folderId = req.params.folderId || null; // Optional folder ID

    // Create the file path to be saved in the database
    const filePath = path.join("/public/data/uploads", filename);
    console.log(mimetype);

    // Save file metadata in the database using Prisma
    const newFile = await prisma.file.create({
      data: {
        name: originalname, // Original file name
        path: filePath, // Path to where the file is stored
        size: size, // File size
        type: mimetype,
        folder: folderId ? { connect: { id: parseInt(folderId) } } : undefined, // If folderId is provided, associate the file with a folder
      },
    });

    // Send a success response back to the client
    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
});

module.exports = { uploadFile };
