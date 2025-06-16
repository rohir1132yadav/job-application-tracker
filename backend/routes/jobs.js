const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const { auth, isAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const { sendJobStatusNotification, sendNewApplicationNotification } = require('../utils/notificationService');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create new job application
router.post('/', auth, async (req, res) => {
  try {
    const jobApplication = new JobApplication({
      ...req.body,
      user: req.user._id
    });

    const savedJob = await jobApplication.save();

    // Send notification for new application
    const io = req.app.get('io');
    io.to(req.user.id).emit('notification', {
      title: 'New Job Application Added',
      message: `You have added a new application for ${savedJob.company}`,
      timestamp: new Date()
    });

    // Send email notification
    await sendNewApplicationNotification(req.user.email, savedJob);

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all job applications (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { status, sortBy = 'appliedDate', sortOrder = 'desc' } = req.query;

    const query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await JobApplication.find(query)
      .sort(sort)
      .populate('user', 'name email');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job application
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job application
router.patch('/:id', auth, async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    const oldStatus = job.status;
    const newStatus = req.body.status;

    // Update job
    Object.assign(job, req.body);
    const updatedJob = await job.save();

    // Send notification if status changed
    if (oldStatus !== newStatus) {
      const io = req.app.get('io');
      io.to(req.user.id).emit('notification', {
        title: 'Job Status Updated',
        message: `Your application at ${updatedJob.company} status changed to ${newStatus}`,
        timestamp: new Date()
      });

      // Send email notification
      await sendJobStatusNotification(req.user.email, updatedJob);
    }

    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete job application
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.json({ message: 'Job application deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.get('/admin/all', auth, isAdmin, async (req, res) => {
  try {
    const { status, sortBy = 'appliedDate', sortOrder = 'desc' } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await JobApplication.find(query)
      .sort(sort)
      .populate('user', 'name email');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job application statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await JobApplication.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          applied: {
            $sum: { $cond: [{ $eq: ['$status', 'Applied'] }, 1, 0] }
          },
          interview: {
            $sum: { $cond: [{ $eq: ['$status', 'Interview'] }, 1, 0] }
          },
          offer: {
            $sum: { $cond: [{ $eq: ['$status', 'Offer'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
          },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      total: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      accepted: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router; 