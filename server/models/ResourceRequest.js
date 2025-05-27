
const mongoose = require('mongoose');

const ResourceRequestSchema = new mongoose.Schema({
  resourceId: {
    type: String,
    required: true
  },
  resourceTitle: {
    type: String,
    required: true
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requesterName: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  paymentType: {
    type: String,
    enum: ['money', 'barter'],
    required: true
  },
  paymentDetails: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResourceRequest', ResourceRequestSchema);
