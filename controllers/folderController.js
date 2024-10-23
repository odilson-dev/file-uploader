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

const createSubFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;

  let { parentId } = req.params;
  parentId = parseInt(parentId);

  const userId = req.user.id;

  const folder = await prisma.folder.create({
    data: {
      name,
      userId,
      parentId,
    },
  });

  res.redirect(`/folders/${parentId}`);
});
const getFolders = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    const folders = await prisma.folder.findMany({
      where: {
        AND: { userId: { equals: req.user.id } },
        parentId: { equals: null },
      },
      include: {
        subfolders: true,
        files: true,
      },
    });

    const files = await prisma.file.findMany({
      where: {
        AND: { userId: { equals: req.user.id } },
        folderId: { equals: null },
      },
    });

    res.render("folders/folders", { folders, files });
  } else {
    res.redirect("/");
  }
});

const updateFolder = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  const folder = await prisma.folder.update({
    where: { id },
    data: { name },
  });
  if (folder.parentId) {
    res.redirect(`/folders/${folder.parentId}`);
  } else {
    res.redirect("/folders");
  }
});

const deleteFolder = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const folder = await prisma.folder.delete({
    where: { id },
  });
  if (folder.parentId) {
    res.redirect(`/folders/${folder.parentId}`);
  } else {
    res.redirect("/folders");
  }
});

const addFile = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    const folderId = req.params.folderId;
    res.render("files/files-upload-form", { folderId });
  } else {
    res.redirect("/");
  }
});

const showFolder = asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params;

    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id), userId: req.user.id },
      include: {
        subfolders: {
          include: { subfolders: true, files: true }, // Include sub-subfolders and files recursively
        },
        files: true,
        parent: true,
      },
    });

    res.render("folders/show", { folder });
  } else {
    res.redirect("/");
  }
});

module.exports = {
  createFolder,
  createSubFolder,
  getFolders,
  updateFolder,
  deleteFolder,
  addFile,
  showFolder,
};
