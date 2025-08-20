const express = require('express');
const router = express.Router();
const noteController = require('../Controllers/noteController.js');
router.route('/')
      .get(noteController.getAllNotes)
      .post(noteController.createNewNote)
      .patch(noteController.updateNote)
      .delete(noteController.deleteNote);

router.get('/:id',noteController.getUserNoteById);
module.exports = router;