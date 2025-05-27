
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Define schema for weather alerts
const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const WeatherAlert = mongoose.model('WeatherAlert', alertSchema);

// Get all alerts for the authenticated user
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = await WeatherAlert.find({ userId: req.user.id })
      .sort({ timestamp: -1 });
    
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new weather alert
router.post('/alerts', auth, async (req, res) => {
  try {
    const { city, condition, description } = req.body;
    
    if (!city || !condition || !description) {
      return res.status(400).json({ message: 'Please provide city, condition and description' });
    }
    
    const newAlert = new WeatherAlert({
      userId: req.user.id,
      city,
      condition,
      description,
      timestamp: new Date(),
      read: false
    });
    
    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark an alert as read
router.patch('/alerts/:id', auth, async (req, res) => {
  try {
    const alert = await WeatherAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Check if the alert belongs to the authenticated user
    if (alert.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    alert.read = true;
    await alert.save();
    
    res.json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an alert
router.delete('/alerts/:id', auth, async (req, res) => {
  try {
    const alert = await WeatherAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Check if the alert belongs to the authenticated user
    if (alert.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await alert.remove();
    res.json({ message: 'Alert removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
