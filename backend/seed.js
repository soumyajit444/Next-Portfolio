// require("dotenv").config();
// const connectDB = require("./src/config/db");
// const Profile = require("./src/models/Profile");

// const seedData = async () => {
//   try {
//     console.log("🚀 Seeding started...");

//     await connectDB();

//     // 🔥 Delete only these profiles (SAFE)
//     await Profile.deleteMany({
//       profileSlug: {
//         $in: ["soumyajit-sengupta", "subhrojoti-nag"],
//       },
//     });

//     console.log("🧹 Old data removed");

//     // ✅ Insert fresh data
//     await Profile.insertMany([
//       {
//         profileSlug: "soumyajit-sengupta",

//         FirstName: "Soumyajit",
//         LastName: "Sengupta",

//         JobRoles: ["Frontend Developer", "React Developer"],

//         Bio: "Creative and detail-oriented Frontend Developer with 3 years of experience.",

//         Skills: [
//           { Name: "React.js", Rating: 9 },
//           { Name: "JavaScript", Rating: 8 },
//           { Name: "HTML5 & CSS3", Rating: 9 },
//         ],

//         IndustryTools: ["VS Code", "Figma", "Postman"],

//         YearsOfExperience: 3,

//         Education: [
//           {
//             PassOutYear: 2022,
//             Degree: "B.Tech CSE",
//             Institution: "Heritage Institute of Technology",
//           },
//         ],

//         Hobbies: ["Gaming", "Sketching"],

//         Address: {
//           Street: "Ultadanga",
//           State: "West Bengal",
//           Pin: "700067",
//           Country: "India",
//         },

//         ContactInfo: {
//           PhoneNo: "+91-9123456780",
//           Email: "soumyajit@example.com",
//           LinkedIn: "linkedin.com",
//         },

//         Projects: [
//           {
//             Name: "ReactCart",
//             Description: "E-commerce UI",
//             Link: "github.com",
//           },
//         ],

//         WorkExperience: {
//           Exp1: {
//             CompanyName: "Capgemini",
//             Role: "Frontend Dev",
//             StartDate: "2022",
//             EndDate: "2023",
//             Description: "Worked on React apps",
//             WorkLocation: "Kolkata",
//             KeySkills: ["React", "JS"],
//           },
//         },
//       },

//       {
//         profileSlug: "subhrojoti-nag",

//         FirstName: "Subhrojoti",
//         LastName: "Nag",

//         JobRoles: ["Full Stack Developer", "MERN Developer"],

//         Bio: "MERN developer with 2 years experience.",

//         Skills: [
//           { Name: "MongoDB", Rating: 8 },
//           { Name: "Node.js", Rating: 9 },
//         ],

//         IndustryTools: ["VS Code", "MongoDB Compass"],

//         YearsOfExperience: 2,

//         Education: [
//           {
//             PassOutYear: 2022,
//             Degree: "B.Tech IT",
//             Institution: "Jadavpur University",
//           },
//         ],

//         Hobbies: ["Cricket", "Travel"],

//         Address: {
//           Street: "Ballygunge",
//           State: "West Bengal",
//           Pin: "700019",
//           Country: "India",
//         },

//         ContactInfo: {
//           PhoneNo: "+91-9876012345",
//           Email: "subhrojoti@example.com",
//           LinkedIn: "linkedin.com",
//         },

//         Projects: [
//           {
//             Name: "JobNest",
//             Description: "Job portal",
//             Link: "github.com",
//           },
//         ],

//         WorkExperience: {
//           Exp1: {
//             CompanyName: "Genpact",
//             Role: "Full Stack Dev",
//             StartDate: "2023",
//             EndDate: "Present",
//             Description: "Working on MERN apps",
//             WorkLocation: "Kolkata",
//             KeySkills: ["Node", "MongoDB"],
//           },
//         },
//       },
//     ]);

//     console.log("✅ Data Seeded Successfully!");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ ERROR:", error);
//     process.exit(1);
//   }
// };

// seedData();
