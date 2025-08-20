const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
//@dec Get all notes
//@method GET /notes
//@access PRIVATE

const getAllNotes = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean()

    // If no notes 
    if (!notes?.length) {
        return res.status(200).json({ message: 'No notes found' })
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})
//@dec Get a specfic note
//@method GET /notes/:id
//@access PRIVATE
const getUserNoteById = asyncHandler(async(req,res)=>{
    const user = req.params.id;
    note = await Note.findOne({user}).lean().exec();
    if(!note){
        return res.status(200).json({message:`No Note is Assigned to UserId ${userId}`});
    }
    const noteUser = await Note.findById(note.user).lean().exec();
    const noteWithUser = {...note, username: noteUser.username }
    res.json(noteWithUser);
});

//@dec Create a New Note
//@method POST /notes
//@access PRIVATE

const createNewNote = asyncHandler(async(req,res) =>{
    const {user, title, text } = req.body;
    //Confirm data
    if(!user || !title || !text  ){
        return res.status(404).json({message:'All fields are required'});
    }
    //Duplicate Data
    const duplicate = await Note.findOne({title}).lean().exec();
    if (duplicate){
        res.status(409).json({message:'Duplicate title found. \n Note cannot be inserted '});
    }
    const result = await Note.create({user, title, text});
   if (note) { // Created 
        return res.status(201).json({ message: 'New note created' })
    } 
    else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }
});

//@dec Get all notes
//@method GET /notes
//@access PRIVATE

const updateNote = asyncHandler(async(req,res) =>{
    const {_id, user, title, text ,completed} =req.body;
    //Confirm Data
    if(!_id || !user || !title || !text || typeof completed != 'boolean'){
        return res.status(404).json({message : 'All fields are required'});
    }
    //Get user
    const note = await Note.findById(_id).lean().exec();
    if(!note){
        res.status(200).json({message:'Note not found'});
    }
    //Check Duplicate Data
    const duplicate = await Note.findOne({title})
    if (duplicate && duplicate._id.toString() !== _id){
        return res.status(409).json({message: 'Duplicate Note \n Note cannot be updated'});
    }
    //Update data
    //MongoDB never allows to update the _id field
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedUser = await note.save();
    res.json(`${updatedUser.title} updated successfully`);
});

//@dec Get all notes
//@method GET /notes
//@access PRIVATE

const deleteNote = asyncHandler(async(req,res)=>{
     const {_id} = req.body;
     const note = await Note.findById(_id).lean().exec();
     if(!note){
        res.status(200).json({message : 'Note not found'});
     }
     const deletedUser = await note.deleteNote();
     const reply = `Note '${deletedUser.title} with ID '${deletedUser._id}' deleted`;
     res.json(reply);
});

module.exports ={
    getAllNotes,
    getUserNoteById,
    createNewNote,
    updateNote,
    deleteNote
} 