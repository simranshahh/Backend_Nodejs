


const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../model/User");

const bcrypt = require("bcryptjs")

const expressAsyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
}

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id, user.role);

  // user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    // data: user,AS
  });
};


exports.signup = expressAsyncHandler(async (req, res, next) => {

    console.log(req.body)
    User.findOne({ email: req.body.email }, function (err, user) {
      // error occur
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      else if (user) {
        return res.status(400).send({
          msg: "This email address is already associated with another account.",
        });
      }
      else {
      
        user = new User({
         
          email: req.body.email,
          password: req.body.password,
        });
  
        user.save(function (err) {
          if (err) {
            console.log(err);
            return res.status(500).send({ msg: err.message });
          }
          return res.status(200).send('User registered successfully')
          });
        }
      });
})


exports.login = expressAsyncHandler(async (req, res, next) => {
   
  
  
  
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");
  
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return next(new AppError("Invalid email or password", 401));
    }
  
   
    createSendToken(user, 200, req, res);
  });
  

  // mongoose.connect("mongodb+srv://Simran:qwertyuiop@cluster0.uu8dq.mongodb.net/signin")

  