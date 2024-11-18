const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configure multer to save images in "saved_images" folder and keep the original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const savePath = path.join(__dirname, 'saved_images');
    // Create the directory if it doesn't exist
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath);
    }
    cb(null, savePath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname) || '.jpg'; // Default to jpg if no extension
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Get the file path to confirm it's saved
  const savedFilePath = path.resolve(req.file.path);
  console.log(`Image saved at ${savedFilePath}`);
  
  // Respond with the file path for confirmation
  res.send(`Image successfully saved to ${savedFilePath}`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
