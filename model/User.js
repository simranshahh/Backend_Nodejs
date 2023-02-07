const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: [true, "Please provide your email"],
    trim: true,
    unique: [true, "Email already taken"],
    lowercase: true,
  },
  
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be minimum of 8 lengths"],
    select: false,
  },
 
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});



const User = mongoose.model("User", userSchema);

module.exports = User;