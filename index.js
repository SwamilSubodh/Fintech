const express = require('express')
const mongoose=require("mongoose");
const brcypt=require("bcrypt");
const pasth=require("path");
const app = express();
const port = 3000
const info=require("./model/userdata");

app.use(express.static('public'))
const connect=mongoose.connect("mongodb://localhost:27017/information");

app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

connect.then(() => {
  console.log("database connected");
}).catch((error) => {
  console.log("error in connection:", error);
});

app.get('/', (req, res) => {
  res.render("/login")
});

app.get('/signup', (req, res) => {
  res.render("signup")
});





app.post('/signup', async (req, res) => {
  const data={
    name:req.body.username,
    email:req.body.email,
    password: req.body.password
  }
  const alereadythere= await info.findOne({email:data.email});

  if(alereadythere){
    res.send("you already exist please use different username")
  }
  else{
    const saltrounds=10;
    const hashpassword=await brcypt.hash(data.password, saltrounds);
    data.password=hashpassword;
    const userdata= await info.insertMany(data);
    console.log(userdata)
  }
  
});

app.post('/login', async (req, res) => {
  try {
    const check= await info.findOne({email: req.body.email});
    if(!check){
      res.send("username does not exist");
    }

    const checkpassword= await brcypt.compare(req.body.password, check.password);
    if(checkpassword){
      res.render("home");
    }
    else{
      res.send("wrong password")
    }
  } catch{
    res.send("wrong details")
  }
  
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})