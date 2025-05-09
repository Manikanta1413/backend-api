const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const logger = require("./utils/logger");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const upload = require("./middlewares/upload");

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    res.status(200).json({
      message: "File uploaded successfully!",
      file: req.file, // The uploaded file details will be in req.file
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "File upload failed.", error: error.message });
  }
});
// Routes
app.get("/", (req, res) => {
  res.send("User Management API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling
app.use(errorHandler);

//MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     if (process.env.NODE_ENV !== "test") {
//       console.log("MongoDB Connected");
//       app.listen(process.env.PORT, () =>
//         console.log(`Server running on port ${process.env.PORT}`)
//       );
//     }
//   })
//   .catch((err) => {
//     console.error("Mongo Error:", err);
//     process.exit(1);
//   });

const startServer = async () => {
  await connectDB();

  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      logger.info(`Server running on port ... ${PORT}`);
    });
  }
};

startServer();

module.exports = app;

// logger.warn("This is a warning message");
// logger.error("Something went wrong");
