const express = require("express");
const userRouter = require("./routes/user");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;

const {logRequestResponse} = require("./middlewares")

//Connection
 mongoose.connect('mongodb://127.0.0.1:27017/app-1')
.then(()=>console.log("MongoDb connected!"));

//Middleware
app.use(express.urlencoded({extended:false}));
app.use(logRequestResponse('log.txt'));

//Routes
app.use('/api/users',userRouter);

app.listen(PORT, () =>
  console.log(`Server Started at ${PORT} !!!\n http://localhost:8000/`)
);
