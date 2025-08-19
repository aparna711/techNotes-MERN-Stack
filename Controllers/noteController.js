const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
//@dec Get all notes
//@method GET /notes
//@access PRIVATE

const getAllNotes =asyncHandler( async(req,res) => {
    const notes = await Note.find().lean().exec();
    if(!notes.length){
        return res.status(200).json({message:"No notes found"})
    }
    res.json(notes)
}
);

//@dec Get a specfic note
//@method GET /notes/:id
//@access PRIVATE
const getUserNoteById = asyncHandler(async(req,res)=>{
    const userId = req.params.id;
    note = await Note.findOne({userId}).lean().exec();
    if(!note){
        return res.status(200).json({message:`No Note is Assigned to UserId ${userId}`});
    }
});

//@dec Create a New Note
//@method POST /notes
//@access PRIVATE

const createNewNote = asyncHandler(async(req,res) =>{
    const {userId, title, text } = req.body;
    //Confirm data
    if(!userId || !title || !text || !completed ){
        return res.status(404).json({message:'All fields are required'});
    }
    //Duplicate Data
    const duplicate = await Note.findOne({userId}).lean().exec();
    if (duplicate){
        res.status(409).json({message:'Duplicate username found. \n Note cannot be inserted '});
    }
    const result = await Note.create({userId, title, text});
    res.json(`Note created successfully ! ${result}`);
});

//@dec Get all notes
//@method GET /notes
//@access PRIVATE

const updateNote = asyncHandler(async(req,res) =>{
    const {_id, userId, title, text ,completed} =req.body;
    //Confirm Data
    if(!_id || !userId || !title || !text || !completed){
        return res.status(404).json({message : 'All fields are required'});
    }
    //Get user
    const note = await findById(_id).lean().exec();
    if(!user){
        res.status(200).json('Note not found');
    }
    //Check Duplicate Data
    const duplicate = await findOne({userId})
    if (duplicate && duplicate._id.toString() !== _id){
        return res.status(200).json({'Duplicate Note \n Note cannot be updated'});
    }
    //Update data
    const updatedUser = await userId.save();
    res.json(`${updatedUser.username} updated successfully`);
})

//@dec Get all notes
//@method GET /notes
//@access PRIVATE

const deleteNote = asyncHandler(async(req,res)=>{
     const userId = req.body;
     const note = await Note.findById(id).lean().exec();
     if(!note.length){
        res.status(200).json({message : 'Note not found'});
     }
     const deletedUser = await Note.deleteOne({userId});
     res.json('Note Deleted successfully');
});

module.exposts ={
    getAllNotes,
    getUserNoteById,
    createNewNote,
    updateNote,
    deleteNote
} 