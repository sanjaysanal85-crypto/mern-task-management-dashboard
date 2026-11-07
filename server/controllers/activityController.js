const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(limit);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearActivities = async (req, res) => {
  try {
    await Activity.deleteMany({});
    res.json({ message: 'Activity log cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
