require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "https://dishdrop-8fqc.onrender.com",
      "https://dishdrop.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
