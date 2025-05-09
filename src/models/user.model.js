const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const upload = require("../middlewares/upload");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false, // Do not return password on queries
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?(\d.*){3,}$/, "Please provide a valid phone number"],
    },
    address: {
      type: String,
    },
    profilePicture: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/[^\s]+$/.test(v); // Validate if it's a valid URL (optional)
        },
        message: "Please provide a valid URL for the profile picture",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

//Hashing password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//compare entered password with hashed one
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
