const User = require("../models/user")

async function handleGetAllUsers(request,response){
     const allDbUsers = await User.find({});
  return response.json(allDbUsers);
}

async function handleGetUserById(request,response){
    const user = await User.findById(request.params.id);
    if(!user) return response.status(404).json({error:"user not found"});
  return response.json(user);
}


async function handleUpdateUserById(request,response){
    const user =  await User.findByIdAndUpdate(request.params.id,{lastName:'changed'});
     if(!user) return response.status(404).json({error:"user not found"});
  return response.json({msg:"sucess"});
}

async function handleDeleteUserById(request,response){
   const user = await User.findByIdAndDelete(request.params.id);
    if(!user) return response.status(404).json({error:"user not found"});
     return response.json({msg:"success"})
}

async function handleCreateNewUser(request,response){
        const body = request.body;
      if (
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
      ) {
        return response.status(400).json({ msg: "All fields are required..." });
      }

       const existingEmail = await User.findOne({ email: body.email });
    if (existingEmail) {
      return response.status(400).json({ msg: "Email already exists" });
    }
    const result =  await User.create({
        firstName : body.first_name,
        lastName : body.last_name,
        email : body.email,
        jobTitle : body.job_title,
        gender : body.gender,
      })
      console.log("result :",result);
      return response.status(201).json({msg:"Success",id:result._id});
}

module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
}