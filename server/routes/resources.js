
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ResourceRequest = require('../models/ResourceRequest');
const Resource = require('../models/Resource');
const User = require('../models/User');

// @route   POST api/resources
// @desc    Create a new resource
// @access  Private (farmers only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a farmer
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can add resources' });
    }

    const { 
      title, 
      imageUrl,
      price,
      priceType,
      availability,
      condition,
      location,
      description
    } = req.body;

    const newResource = new Resource({
      title,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1601084881623-cdf9a8ea242c?auto=format&fit=crop&q=80&w=500',
      price,
      priceType,
      availability,
      condition,
      location,
      description,
      ownerId: req.user.id,
      ownerName: user.name
    });

    const resource = await newResource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/resources/all
// @desc    Get all resources
// @access  Private (farmers only)
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is a farmer
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can view resources' });
    }
    
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/resources/:id
// @desc    Get resource by ID
// @access  Private (farmers only)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user is a farmer
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can view resources' });
    }
    
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/resources/:id
// @desc    Update a resource
// @access  Private (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user owns this resource
    if (resource.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this resource' });
    }

    const { 
      title, 
      imageUrl,
      price,
      priceType,
      availability,
      condition,
      location,
      description
    } = req.body;

    // Update fields
    if (title) resource.title = title;
    if (imageUrl) resource.imageUrl = imageUrl;
    if (price) resource.price = price;
    if (priceType) resource.priceType = priceType;
    if (availability) resource.availability = availability;
    if (condition) resource.condition = condition;
    if (location) resource.location = location;
    if (description !== undefined) resource.description = description;

    await resource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/resources/:id
// @desc    Delete a resource
// @access  Private (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user owns this resource
    if (resource.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/resources/user/me
// @desc    Get current user's resources
// @access  Private
router.get('/user/me', auth, async (req, res) => {
  try {
    const resources = await Resource.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/resources/request
// @desc    Create a new resource request
// @access  Private (farmers only)
router.post('/request', auth, async (req, res) => {
  try {
    // Check if user is a farmer
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can request resources' });
    }

    const { 
      resourceId, 
      resourceTitle,
      ownerId,
      ownerName,
      message,
      startDate, 
      endDate,
      paymentType,
      paymentDetails
    } = req.body;

    const newRequest = new ResourceRequest({
      resourceId,
      resourceTitle,
      requesterId: req.user.id,
      requesterName: user.name,
      ownerId,
      ownerName,
      message,
      startDate,
      endDate,
      paymentType,
      paymentDetails
    });

    const resourceRequest = await newRequest.save();
    res.json(resourceRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/resources/requests/received
// @desc    Get all resource requests received by the current user
// @access  Private
router.get('/requests/received', auth, async (req, res) => {
  try {
    const requests = await ResourceRequest.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/resources/requests/sent
// @desc    Get all resource requests sent by the current user
// @access  Private
router.get('/requests/sent', auth, async (req, res) => {
  try {
    const requests = await ResourceRequest.find({ requesterId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/resources/requests/:id
// @desc    Update a resource request status (approve/reject)
// @access  Private (owner only)
router.put('/requests/:id', auth, async (req, res) => {
  try {
    const request = await ResourceRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if user owns this request
    if (request.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this request' });
    }

    const { status } = req.body;
    if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    request.status = status;
    await request.save();
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
