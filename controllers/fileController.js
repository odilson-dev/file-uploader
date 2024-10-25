const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
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
        folderId: folderId ? parseInt(folderId) : null, // Associate the file with a folder, if provided
      },
    });
    if (folderId) {
      res.redirect(`/folders/${folderId}`);
    } else {
      res.redirect(`/folders`);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
});
const downloadFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  // Fetch file metadata from the database
  const file = await prisma.file.findUnique({
    where: { id: parseInt(fileId) },
  });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  // Download the file from Supabase storage
  const { data, error } = await supabase.storage
    .from("images") // Replace 'images' with your actual bucket name
    .download(`public/${file.name}`); // Path to the file in the bucket

  if (error) {
    console.error("Error downloading file from storage:", error.message);
    return res.status(500).json({ message: "Error downloading file" });
  }

  // Ensure the file is in a correct format (Blob or Readable Stream)
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer); // Convert to Node.js buffer

  // Set headers for file download
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
  res.setHeader("Content-Type", file.type); // Set appropriate MIME type (e.g., image/png, application/pdf, etc.)

  // Send the buffer as the file response
  res.send(buffer);
});

const editFile = asyncHandler(async (req, res) => {
  const file = await prisma.file.findUnique({
    where: { id: parseInt(req.params.fileId) },
  });

  res.render("files/files-edit-form", { file });
});

const updateFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  // Find the file by ID in your database
  const file = await prisma.file.findUnique({
    where: { id: parseInt(fileId) },
  });

  // Update the file name in the database
  const updatedFile = await prisma.file.update({
    where: { id: parseInt(fileId) },
    data: { name: req.body.name },
  });

  // Rename the file in Supabase Storage
  const oldFileName = `public/${file.name}`;
  const newFileName = `public/${updatedFile.name}`;

  // First, upload the file with the new name
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images") // Replace 'avatars' with your bucket name
    .move(oldFileName, newFileName); // Move method to "rename" the file

  if (uploadError) {
    console.error("Error renaming file in Supabase:", uploadError.message);
    return res.status(500).json({ message: "Error renaming file in Supabase" });
  }

  // Redirect to the appropriate folder
  updatedFile.folderId
    ? res.redirect(`/folders/${updatedFile.folderId}`)
    : res.redirect(`/folders`);
});

const deleteFile = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const file = await prisma.file.delete({
    where: { id },
  });
  const { data, error } = await supabase.storage
    .from("images")
    .remove([`public/${file.name}`]);

  file.folderId
    ? res.redirect(`/folders/${file.folderId}`)
    : res.redirect(`/folders`);
});

module.exports = { uploadFile, downloadFile, editFile, updateFile, deleteFile };
