const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createFolder = asyncHandler(async (req, res) => {
  await prisma.folder.create({
    data: {
      name: req.body.name,
      userId: req.user.id,
    },
  });
  res.redirect("/folders");
});

const getFolders = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    const folders = await prisma.folder.findMany({
      where: {
        userId: {
          equals: req.user.id,
        },
      },
      include: {
        files: true,
      },
    });

    res.render("folder/folders", { folders });
  } else {
    res.redirect("/");
  }
});

const updateFolder = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  const updateFolder = await prisma.folder.update({
    where: { id },
    data: { name },
  });
  res.redirect("/folders");
});

const editFolder = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const folder = await prisma.folder.findUnique({
    where: { id },
  });
  res.render("folder/folder-edit-form", { folder });
});

const deleteFolder = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const deleteFolder = await prisma.folder.delete({
    where: { id },
  });
  res.redirect("/folders");
});

const addFile = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    const folderId = req.params.folderId;
    res.render("file-upload-form", { folderId });
  } else {
    res.redirect("/");
  }
});

module.exports = {
  createFolder,
  getFolders,
  editFolder,
  updateFolder,
  deleteFolder,
  addFile,
};
