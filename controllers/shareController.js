const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto"); // For generating random share tokens

const createShareItemLink = async (req, res) => {
  try {
    let { itemId, type, duration } = req.body; // `type` can be 'file' or 'folder'
    itemId = parseInt(itemId);
    let item;
    if (type === "file") {
      item = await prisma.file.findUnique({ where: { id: itemId } });
      if (!item) {
        return res.status(404).send("File not found.");
      }
    } else if (type === "folder") {
      item = await prisma.folder.findUnique({ where: { id: itemId } });
      if (!item) {
        return res.status(404).send("Folder not found.");
      }
    }

    // Calculate expiration date
    const expiresAt = new Date();
    const days = parseInt(duration); // Assuming duration is in days
    expiresAt.setDate(expiresAt.getDate() + days);

    // Generate a share token
    const shareToken = crypto.randomBytes(16).toString("hex");

    // Create shared item record
    const sharedItem = await prisma.sharedItem.create({
      data: {
        shareToken: shareToken,
        type: type.toUpperCase(), // FILE or FOLDER
        fileId: type === "file" ? itemId : null,
        folderId: type === "folder" ? itemId : null,
        expiresAt: expiresAt,
      },
    });

    // Generate the shareable link
    const shareLink = `${req.protocol}://${req.get(
      "host"
    )}/share/${shareToken}`;

    res.render("share/shared-link", {
      shareLink: shareLink,
      expirationDate: sharedItem.expiresAt,
    });
  } catch (error) {
    console.error("Error sharing item:", error);
    res.status(500).json({
      message: "Error sharing item",
      error: error.message,
    });
  }
};

const accessSharedItem = async (req, res) => {
  try {
    const { token } = req.params;

    // Find the shared item by token
    const sharedItem = await prisma.sharedItem.findUnique({
      where: { shareToken: token },
      include: {
        file: true,
        folder: true,
      },
    });

    if (!sharedItem) {
      return res.status(404).send("Shared item not found.");
    }

    // Check if the link has expired
    const now = new Date();
    if (now > sharedItem.expiresAt) {
      return res.status(410).send("Share link has expired.");
    }

    // Respond with the appropriate data based on the type
    if (sharedItem.type === "FILE") {
      res.status(200).json({
        message: "File accessed successfully",
        file: sharedItem.file,
      });
    } else if (sharedItem.type === "FOLDER") {
      const folderContents = await prisma.folder.findUnique({
        where: { id: sharedItem.folderId },
        include: {
          files: true,
          subfolders: true,
        },
      });

      res.status(200).json({
        message: "Folder accessed successfully",
        folder: folderContents,
      });
    }
  } catch (error) {
    console.error("Error accessing shared item:", error);
    res.status(500).json({
      message: "Error accessing shared item",
      error: error.message,
    });
  }
};

module.exports = {
  createShareItemLink,
  accessSharedItem,
};
