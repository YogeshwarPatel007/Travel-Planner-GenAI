const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  generateTrip,
  saveTrip,
  getTrips,
  getTripById,
  deleteTrip,
  toggleFavorite,
} = require('../controllers/tripController');

const router = express.Router();

// All trip routes require authentication
router.use(authMiddleware);

router.post('/generate', generateTrip);
router.post('/save', saveTrip);
router.get('/get', getTrips);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
