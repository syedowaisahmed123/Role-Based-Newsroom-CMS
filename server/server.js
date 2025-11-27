require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const articleRoutes = require("./src/routes/articles");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",    // fallback
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow if origin is in the list OR no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked for this origin: " + origin));
  },
  credentials: true
}));

app.use(express.json());     
app.use(express.urlencoded({ extended: true })); 

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);

app.get('/api/testingRoutes', (req,res) =>{
    res.send("api working backend ")
});

// Global Error Handler hai ye
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

// DB + Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("Server running on PORT", process.env.PORT)
    );
  })
  .catch((err) => console.error("DB ERROR:", err));
