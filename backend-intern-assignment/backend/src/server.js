const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./src/config/swagger.yaml");


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();

const app = express(); // ✅ app initialized FIRST

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Routes
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/tasks", taskRoutes);

// Protected test route (AFTER app initialization)
app.get("/api/v1/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
