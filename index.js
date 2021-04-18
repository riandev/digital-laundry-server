const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");
const ObjectID = require('mongodb').ObjectID;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

const port = 5000;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbqmn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const adminServiceCollection = client
    .db("laundryApp")
    .collection("adminService");
    const userBookingCollection = client
    .db("laundryApp")
    .collection("userBooking");
    const userPaymentData = client
    .db("laundryApp")
    .collection("userPaymentData");
    const signUpUserCollection = client
    .db("laundryApp")
    .collection("signUpUser");
    const bookingStatusCollection = client
    .db("laundryApp")
    .collection("bookingStatus");
    const reviewsCollection = client
    .db("laundryApp")
    .collection("reviews");
    const adminEmailCollection = client
    .db("laundryApp")
    .collection("adminEmail");
    
  console.log("DB CONNECTED");
  app.post("/addAdminService", (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const cloths = req.body.cloths;
    const pants = req.body.pants;
    const shirts = req.body.shirts;
    const sweaters = req.body.sweaters;
    const price = req.body.price;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    adminServiceCollection
      .insertOne({ title, cloths, pants, shirts, sweaters,price, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });
  app.get('/bookingData',(req, res) => {
    adminServiceCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  
  app.delete('/deleteService/:id', (req, res) =>{
    const id = ObjectID(req.params.id)
    adminServiceCollection.findOneAndDelete({_id: id})
    .then(documents =>{
        res.send(documents);
    })
})
  app.post('/userBookings',(req, res) => {
    const userBooking=req.body;
    userBookingCollection.insertOne(userBooking)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  app.get('/booking/:email',(req, res) => {
    userBookingCollection.find({email: req.params.email})
    .toArray((err, bookings) =>{
      res.send(bookings)
    })
  })
  
  app.get('/userBookingList',(req, res) => {
    userBookingCollection.find({})
    .toArray((err,bookings) => {
      res.send(bookings)
    })
  })
  app.post('/signUpUser', (req, res) => {
    const user= req.body;
    signUpUserCollection.insertOne(user)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  app.get('/user',(req, res) => {
    const email=req.query.email;
    signUpUserCollection.find({email: email})
    .toArray((err,user) => {
      console.log('user:',user[0]);
      res.send(user[0])
    })
  })
  
  app.get('/orderList',(req, res) => {
    userBookingCollection.find({})
    .toArray((err,bookings) => {
      res.send(bookings)
    })
  })
  
  app.post('/bookingStatus', (req, res) => {
    const status= req.body;
    bookingStatusCollection.insertOne(status)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  app.get('/userBookingStatus',(req, res) => {
    bookingStatusCollection.find({})
    .toArray((err,status) => {
      res.send(status)
    })
  })
  
  app.post('/addReview', (req, res) => {
    const review=req.body;
    console.log(review);
    reviewsCollection.insertOne(review)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  app.get('/reviews',(req, res) => {
    reviewsCollection.find({})
    .toArray((err,reviews) => {
      res.send(reviews)
    })
  })
  
  app.post('/addAdmin', (req, res) => {
    const adminEmail= req.body;
    adminEmailCollection.insertOne(adminEmail)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
app.post('/adminEmail',(req, res) => {
  const email = req.body.email;
  console.log(email);
adminEmailCollection.find({adminEmail: email})
.toArray((err,adminEmail) => {
  res.send(adminEmail.length > 0)
})
})
  
  app.post('/userPaymentInfo',(req, res) => {
    const paymentInfo=req.body;
    userPaymentData.insertOne(paymentInfo)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  
  
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port || process.env.PORT);
