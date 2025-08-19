const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const noteSchema = mongoose.Schema({
    user:{    //reference to a User
        type: mongoose.Schema.Types.ObjectId, // Fill it with _id field of type "ObjectId". Type ObjectId is built-in type by MongoDB
        ref:'User', //tells Mongoose this field links to the User model (like a foreign key in SQL).
        required:true, //you can’t save a note without linking it to a user.
    },
    title:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    }

},
{
    timestamps:true //for auto-managed timestamps
}
);

noteSchema.plugin(AutoIncrement,{
    inc_field : 'ticket',
    id: 'ticketNums',
    start_seq:500
})
module.exports = mongoose.model('Note',noteSchema);

/*
user: Stores an ObjectId (unique identifier) that refers to a document in another collection.
ref: 'User' → tells Mongoose this field links to the User model (like a foreign key in SQL).
required: true → you can’t save a note without linking it to a user.


1]ObjectId is a special data type in MongoDB used as the unique identifier (_id) for documents.
2]Every document automatically gets an "_id field of type ObjectId" unless you explicitly provide one.

Why use ObjectId?
1]It’s unique across the whole database.
2]Encodes timestamp info inside it (so you can tell when it was created without extra fields).
3]Perfect for creating relationships between collections (like foreign keys in SQL).


In Mongoose, when you write:

user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}


You’re saying:

1]The user field must hold an ObjectId value.
2]This ObjectId should refer to a document from the User collection (because of ref: 'User').


//Schema Options
{ timestamps:true }
Mongoose will automatically add two fields to each note:
createdAt: when the note was created
updatedAt: when the note was last updated


//Creating the Model
module.exports = mongoose.model('Note', noteSchema);

A model is a wrapper around the schema.
'Note' → The model name (Mongoose will create a notes collection in MongoDB).
You export it so you can require it elsewhere in your project and interact with the Note collection.
*/