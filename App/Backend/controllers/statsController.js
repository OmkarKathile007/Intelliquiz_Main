const Stats = require('../models/Stats');

exports.getStats = async (req, res) => {
  try {
    const stats = await Stats.findOne({ player: req.params.playerId });
    if (!stats) return res.status(404).json({ msg: 'Stats not found' });
    res.json(stats);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};