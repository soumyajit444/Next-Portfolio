const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  Name: String,
  Rating: Number,
});

const educationSchema = new mongoose.Schema({
  PassOutYear: Number,
  Degree: String,
  Institution: String,
});

const projectSchema = new mongoose.Schema({
  Name: String,
  Description: String,
  Link: String,
});

const experienceSchema = new mongoose.Schema({
  CompanyName: String,
  Role: String,
  StartDate: String,
  EndDate: String,
  Description: String,
  WorkLocation: String,
  KeySkills: [String],
});

const profileSchema = new mongoose.Schema(
  {
    profileSlug: {
      type: String,
      required: true,
      unique: true,
    },

    // 🔥 UPDATED
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },

    // 🔥 NEW FIELD
    JobRoles: [String], // ["Frontend Developer", "Backend Developer"]

    Bio: String,

    Skills: [skillSchema],
    IndustryTools: [String],

    YearsOfExperience: Number,

    Education: [educationSchema],
    Hobbies: [String],

    Address: {
      Street: String,
      State: String,
      Pin: String,
      Country: String,
    },

    ContactInfo: {
      PhoneNo: String,
      Email: String,
      LinkedIn: String,
    },

    Projects: [projectSchema],

    WorkExperience: {
      Exp1: experienceSchema,
      Exp2: experienceSchema,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
