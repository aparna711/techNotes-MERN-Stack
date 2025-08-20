const User = require('../models/User');
const Note = require('../models/Note');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

//@desc Get all users
//@route GET /users
//@access Private

const getAllUsers = asyncHandler(async(req , res)=>{
    const users = await User.find().select('-password').lean();
    if(!users.length){
        return res.status(200).json({message:"No users found !"})
    }
    res.json(users);
});

//@desc Create new User
//@route POST /users
//@access Private

const createNewUser = asyncHandler(async(req , res)=>{
    const {username, password, roles } = req.body;

    //Confirm body
    if (!username || !password || !Array.isArray(roles) || !roles.length){ //StatusCode : 400 Bad Request
        return res.status(400).json({message:'All fields are required'});
    }
    //Check for duplicate
    const duplicate = await User.findOne({username}).lean().exec();
    
    if(duplicate){ //StatusCode : 409 Conflict
        return res.status(409).json({message:"Duplicate username"});
    }
    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10); //salt rounds
    const userObject = {username , password:hashedPwd, roles}

    //Create and store new user
    const user = await User.create(userObject);

    if (user){ //201 new resource was created successfully
        res.status(201).json({message:`New user ${username} created`})
    }
    else{
        res.status(400).json({message: 'Invalid user data received'})
    }
});

//@desc Update a User
//@route PATCH /users
//@access Private


const updateUser = asyncHandler(async (req, res) => {
    const { _id, username, password, roles, active } = req.body;

    // 1. Validation
    if (!_id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' });
    }

    // 2. Find user by ID
    const user = await User.findById(_id).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // 3. Duplicate check for username
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }

    // 4. Update allowed fields
    user.username = username;   // ✅ unchanged username passes fine
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10); // hash only if new password provided
    }

    // 5. Save changes/Update Changes - save() does both of it
    const updatedUser = await user.save();
    //OR use 
        // const updatedUser = await User.findByIdAndUpdate(
        //     {_id: user._id },            // filter which document
        //     { $set: { username, roles, active, password: user.password } }   // spread properties of the user object.
        //  );

        //  Never use ..user it gives extra Mongo methods binded to user varible document
        // =========but that still includes _id, which MongoDB doesn’t allow updating===============

    res.json({ message: `User ${updatedUser.username} updated successfully` });
});




//@desc Delete a user
//@route DELETE /users
//@access Private

const deleteUser = asyncHandler(async(req , res)=>{
    const id = req.body;
    if (!id){
        return res.status(400).json({message:"All the fields are required"});
    }
    const notes = await Note.findOne({user:id}).lean().exec();
    if(notes){
        res.status(400).json({message:'User has been assigned Notes'});
    }
    const user = await User.findById(id).exec();
    if(!user){
        return res.status(400).json({message:'User not found'});
    }
    const result = await user.deleteOne();
    res.json({message:`User Deleted successfully ! : ${result}`})

});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};