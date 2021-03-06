//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

console.log(process.env.API_KEY);
const app = express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt,{secret:process.env.SECRETS, encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err){
    if(!err){
      res.render("secrets")
    }
  })
});

app.post("/login",function(req,res){
  const username= req.body.username;
  const password= req.body.password;
  User.findOne({email:req.body.username},function(err, found){
    if(err){
      console.log(err);
    }else{
      if(found){
        if(found.password=== password){
          res.render("secrets");
        }
      }
    }
  })
});





app.listen(3000,function(){
  console.log("server started at port 3000")
});
