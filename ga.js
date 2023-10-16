const express = require('express');
const app = express();
const request=require('request');
const admin = require('firebase-admin');
app.use(express.static("public"));
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key2.json");

 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/project/project-d-33e0e/firestore/data/~2FDetails~2FXj7AhInyOurPnjraysrG'
});
const db1 = admin.firestore();
const db = getFirestore();
app.get('/signup', function (req, res) {  
  res.sendFile(__dirname + "/public/" + "signup.html")  
});

app.get('/login', function (req, res) {  
  res.sendFile(__dirname + "/public/" + "login.html") 
});

app.get('/', function (req, res) {  
    res.sendFile(__dirname + "/public/" + "g.html")  
  });

  app.get('/search', function (req, res) {  
    res.sendFile(__dirname + "/public/" + "search.html")  
  });

app.get('/adddetails', function (req, res) {  
    res.sendFile(__dirname + "/public/" + "add.html")  
  });
  app.get('/getConsoleData', function (req, res) {  
    res.sendFile(__dirname + "/public/" + "table.html")  
  });
  app.post('/signupsubmit', function (req, res) {
    db.collection("Details1")
      .where("email","==",req.body.email)
      .get()
      .then  ((docs)=>{
        if(docs.size>0){
          res.send("Hey user this account is already exist")
        }
        else{
    db.collection("Details1").add({
      username :req.body.username,
      email: req.body.email,
      password: req.body.password 
    })
    .then(() =>{
      const successMessage="Signup Succesfull. click here to <a href='/login'>Log in</a>.";
      res.send(successMessage);
    });}
  });});
  
  app.post("/loginSubmit", function (req, res) {
      const email = req.body.email;
      const password = req.body.password;
  
      db.collection("Details1")
      .where("email","==",email)
      .where("password","==" ,password)
      .get()
      .then((docs)=>{
          console.log(docs);
          console.log(docs.size);
          if(docs.size>0){
            res.sendFile(__dirname + "/public/" + "g.html" );
          }
          else{
              res.send("login failed");
          }
        })
        
  });

  app.get('/detailssumbit', function (req, res) {
    db.collection("Details")
      .where("email","==",req.query.email)
      .get()
      .then  ((docs)=>{
        if(docs.size>0){
          res.send("Hey user this account is already exist")
        }
        else{
    db.collection("Details").add({
      username :req.query.username,
      email: req.query.email,
      phonenumber: req.query.phonenumber,
      location: req.query.location,
      address: req.query.address,
      nearlocation: req.query.nearlocation
    })
    .then(() =>{
      const successMessage="Our orphange home details are stored sucessfully";
      res.send(successMessage);
    });}
  });});

 
  
  app.get("/searchSubmit", function (req, res) {
    const location = req.query.loacation;
    const nearlocation = req.query.nearalocation;

    db.collection("Details")
    .where("location","==",location)
    .where("nearlocation","==" ,nearlocation)
    .get()
    .then((querySnapshot) => {
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      if (data.length > 0) {
        res.send(JSON.stringify(data, null, 2)); // Send the JSON data with formatting
      } else {
        res.send('No matching data found.');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});














    
app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')  
    })