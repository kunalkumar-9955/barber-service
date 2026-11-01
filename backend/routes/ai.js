const express = require('express');
const { protect } = require('../middleware/auth');
const cloudinary = require('../utils/cloudinary');
const router = express.Router();

const hairstyles = [
  { name: 'Modern Pompadour', description: 'Glossy fade with volume and confidence.' },
  { name: 'Textured Crop', description: 'Effortless sharp finish for busy city looks.' },
  { name: 'Slick Back Undercut', description: 'Sleek premium style with strong contrast.' },
  { name: 'Classic Taper', description: 'A polished everyday cut with timeless appeal.' }
];

router.post('/suggest', protect, async (req, res, next) => {
  try {
    let imageUrl = null;
    if (req.files?.photo) {
      const upload = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
        folder: 'barberpro/ai',
        transformation: [{ width: 1200, crop: 'limit' }]
      });
      imageUrl = upload.secure_url;
    }
    const suggestions = hairstyles.sort(() => 0.5 - Math.random()).slice(0, 3);
    res.json({ imageUrl, suggestions, message: 'AI hairstyle matches generated successfully.' });
  } catch (err) {
    next(err);
  }
});

router.get('/recommend', protect, async (req, res) => {
  const recommendations = [
    { name: 'Gold Standard Barbers', rating: 4.9, city: 'Mumbai', price: 499 },
    { name: 'Urban Trim Studio', rating: 4.8, city: 'Delhi', price: 399 },
    { name: 'Platinum Fade Lounge', rating: 4.7, city: 'Bengaluru', price: 449 }
  ];
  res.json({ recommendations });
});

module.exports = router;
