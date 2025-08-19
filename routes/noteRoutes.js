const express = require('express');
const router = express.Router();
const noteController = require('../Controllers/noteController');
router.route('/')
      .get(noteController)
      .get('/:id',noteController)
      .post(noteController)
      .patch(noteController)
      .delete(noteController)
module.exports = router