const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup storage for clips and thumbnails
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(file.fieldname === 'clip') cb(null, 'backend/uploads/videos/');
        else cb(null, 'backend/uploads/thumbnails/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(express.static('frontend'));
app.use('/uploads', express.static('backend/uploads'));

// Admin Login (simple for demo)
const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if(username === ADMIN_USER && password === ADMIN_PASS) res.json({success: true});
    else res.json({success: false});
});

// Upload Clip
app.post('/admin/upload', upload.fields([{name:'clip'}, {name:'thumbnail'}]), (req,res)=>{
    let clips = JSON.parse(fs.readFileSync('backend/clips.json'));
    const newClip = {
        id: Date.now(),
        title: req.body.title,
        category: req.body.category,
        tags: req.body.tags.split(','),
        clip: `/uploads/videos/${req.files['clip'][0].filename}`,
        thumbnail: `/uploads/thumbnails/${req.files['thumbnail'][0].filename}`
    };
    clips.push(newClip);
    fs.writeFileSync('backend/clips.json', JSON.stringify(clips,null,2));
    res.json({success:true, clip:newClip});
});

// Get all Clips
app.get('/clips', (req,res)=>{
    const clips = JSON.parse(fs.readFileSync('backend/clips.json'));
    res.json(clips);
});

// Start Server
app.listen(PORT, () => console.log(`AZ Clips Pro server running on port ${PORT}`));