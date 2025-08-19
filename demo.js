const updateUser = asyncHandler(async(req , res)=>{
    const {_id, username, password, roles, active } = req.body;
    //Confirm user
    if(!_id || !username ||!password || !Array.isArray(roles) || !roles.length || typeof active  !=='boolean'){
        return res.status(400).json({message : 'All fields except password are required '});
    }
    const user = await User.findById(_id).exec();
    if(!user){
        return res.status(400).json({message : 'User not found'});
    }
    //Check for Duplicate user
    const duplicate = await User.findOne({username}).lean().exec();
   if (duplicate && duplicate._id.toString() !== _id) {
    return res.status(409).json({ message: 'Duplicate username' });
}

    user.username = username;
    user.roles = roles;
    user.active =active;

    if (password){
        //Hash password
        user.password = await bcrypt.hash(password,10); // salt rounds 
    }
    //Update user
    const updateUser = await user.save()
   // const updateUser = await User.updateOne({_id : id},{$set :{user}})
    res.json({message:`${updateUser.username} updated`})
})
