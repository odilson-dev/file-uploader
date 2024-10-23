const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const supabase = require("../supabase/supabase");
// Create a new file

const uploadFile = asyncHandler(async (req, res) => {
  try {
    const file = req.file;

    // Check if the file was uploaded successfully
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Get file details from req.file (handled by Multer)
    const { originalname, filename, size, mimetype, path } = file; // Add 'path' if using Multer for disk storage
    const folderId = req.params.folderId || null; // Optional folder ID

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("images") // My bucket name
      .upload(
        `public/${originalname}`,
        path ? fs.readFileSync(path) : file.buffer,
        {
          // Use path or buffer depending on Multer setup
          cacheControl: "3600",
          upsert: true,
        }
      );

    if (error) throw error; // Handle Supabase error

    const filePath = data.Key || `public/${originalname}`; // Define the file path using the data returned from Supabase

    // Save file metadata in the database using Prisma
    const uploadedFile = await prisma.file.create({
      data: {
        name: originalname, // Original file name
        path: filePath, // Path to where the file is stored in Supabase
        size: size, // File size
        type: mimetype,
        userId: parseInt(req.user.id), // User who uploaded the file
        folder: folderId ? { connect: { id: parseInt(folderId) } } : undefined, // Associate the file with a folder, if provided
      },
    });
    console.log(uploadedFile);
    // Send success response back to the client
    res
      .status(200)
      .json({ message: "File uploaded successfully", path: filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
});

const editFile = asyncHandler(async (req, res) => {
  const file = await prisma.file.findUnique({
    where: { id: parseInt(req.params.fileId) },
  });

  res.render("files/files-edit-form", { file });
});

const updateFile = asyncHandler(async (req, res) => {
  await prisma.file.update({
    where: {
      id: parseInt(req.params.fileId),
    },
    data: {
      name: req.body.name,
    },
  });
  res.redirect("/folders");
});

const deleteFile = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.file.delete({
    where: { id },
  });
  res.redirect("/folders");
});

module.exports = { uploadFile, editFile, updateFile, deleteFile };
