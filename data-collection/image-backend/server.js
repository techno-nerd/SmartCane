const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const TEMP_DIR = 'saved_images/temp'
const HAZARD_DIR = 'saved_images/hazard'
const NON_HAZARD_DIR = 'saved_images/non-hazard'


const app = express();
const port = 3000;

// Configure multer for temporary file storage
const upload = multer({ dest: TEMP_DIR }); // Temporary folder for uploads

// POST route to handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        console.log('Received body:', req.body); // Log form fields
        console.log('Received file:', req.file); // Log uploaded file details

        // Parse the hazard field from form data
        const isHazard = req.body.hazard === 'true'; // Compare as strings
        console.log('Is Hazard:', isHazard);

        // Determine the target directory
        const targetDir = isHazard ? HAZARD_DIR : NON_HAZARD_DIR;

        // Ensure the target directory exists
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Move the uploaded file to the target directory
        const oldPath = req.file.path;
        const newPath = path.join(targetDir, req.file.originalname);

        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).send('Error saving file');
            }

            console.log(`File saved to ${newPath}`);
            res.send('File uploaded successfully');
        });
    } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
