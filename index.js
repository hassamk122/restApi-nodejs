const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 8000;

const mongoose = require("mongoose");


// Schema
const userSchema = new mongoose.Schema({
    firstName:{
      type: String,
      required:true,
    },
    lastName:{
      type: String,
      required:false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    jobTitle:{
      type: String,
    },
    gender : {
      type:String,
    }
},{timestamps:true});

//Model
const User = mongoose.model('user',userSchema);

//connection
mongoose.connect('mongodb://127.0.0.1:27017/app-1')
.then(()=>console.log("Mongodb Connected!"))
.catch((err)=>console.log("Mongo Error",err));

//Middleware
app.use(express.urlencoded({extended:false}));

// SSR ----------------------->

app.get("/users",async (request, response) => {
  const allDbUsers = await User.find({});
  const html = `
    <ul>
    ${allDbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>`;
  return response.send(html); 
}); 

//    
app.get("/api/users", async(request, response) => {
   const allDbUsers = await User.find({});
  return response.json(allDbUsers);
});

app.post("/api/users", async(request, response) => {
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
      return response.status(201).json({msg:"Sucess"});
  });


app
.route("/api/users/:id")
.get(async(request, response) => {
  const user = await User.findById(request.params.id);
  return response.json(user);
})
.patch(async(request, response) => {
  await User.findByIdAndUpdate(request.params.id,{lastName:'changed'})
  return response.json({msg:"sucess"})
})
.delete(async(request, response) => {
   await User.findByIdAndDelete(request.params.id);
     return response.json({msg:"sucess"})
  })



app.listen(PORT, () =>
  console.log(`Server Started at ${PORT} !!!\n http://localhost:8000/`)
);
