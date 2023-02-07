
const bodyParser = require('body-parser')
const express=  require ('express')

const mongoose = require('mongoose')
const morgan = require('morgan')
const { signup, login } = require('./controller/User')
require("dotenv").config()
const app = express()

// import  ObjectId from 'mongodb';
const port = process.env.PORT || 9000

app.use(express.json()).use(morgan("dev"))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","*")
    next();
})

var teams = [];

//app route

app.get('/',(req,res)=> {
   
    res.status(200).send("Hello from backend")
});

app.post('/register',signup);
app.post('/login',login);