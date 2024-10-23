const supabase = require("./supabase/supabase"); // Assuming Supabase is initialized correctly
const fs = require("fs"); // Node's file system module
const path = require("path"); // Node's path module

const downloadFile = async () => {
  // Download the file from Supabase storage
  const { data, error } = await supabase.storage
    .from("images") // Replace 'images' with your actual bucket name
    .download("public/profile_pic.png"); // The file path in your storage bucket

  if (error) {
    console.error("Error downloading file:", error.message);
    return;
  }

  // Convert Blob to ArrayBuffer
  const arrayBuffer = await data.arrayBuffer();

  // Convert ArrayBuffer to Buffer (Node.js native)
  const buffer = Buffer.from(arrayBuffer);

  // Define the download directory and file path
  const downloadDir = path.join(__dirname, "downloads");
  const filePath = path.join(downloadDir, "profile_pic.png");

  // Check if the downloads directory exists; if not, create it
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  // Save the buffer to a file (e.g., profile_pic.png) in the downloads folder
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error saving file:", err);
    } else {
      console.log("File downloaded and saved successfully!");
    }
  });
};

downloadFile();
