const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const os = require("os");
const path = require("path");


const dbconnect = require("./config/database")
const fileUpload = require("express-fileupload");


//routes
const userRoutes = require("./routes/userRouter");
const postRouter = require('./routes/postRouter')
const mlRouter = require("./routes/mlRouter")
const hfrouter = require("./routes/inferenceRouter")

dotenv.config({ quiet: true, path: path.join(__dirname, ".env") });
//database connection
dbconnect.connect();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://pramaanf.vercel.app",
  "https://pramaan-omega.vercel.app"
];
// "http://localhost:5173","*",
// if (process.env.CLIENT_ORIGIN) allowedOrigins.push(process.env.CLIENT_ORIGIN);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.use(
  fileUpload({
    useTempFiles: false,   // keep file in memory as file.data Buffer — works on Vercel
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  })
);

app.use("/api/user", userRoutes);

// post
app.use('/api/chat', postRouter);
app.use("/api/ml", mlRouter);
app.use("/api/hf", hfrouter)

const axios = require('axios');

const SPACES = [
  "https://animan0810-pramaan-ml.hf.space",
  "https://animan0810-pramaan-ai-detector-api.hf.space"
];

// Vercel Cron or external service target to ping HF Spaces and keep them awake
app.get("/api/cron/ping", async (req, res) => {
  const results = [];
  for (const url of SPACES) {
    try {
      await axios.get(`${url}/`, { timeout: 5000 });
      results.push({ url, status: "awake" });
      console.log(`✅ Pinged ${url}`);
    } catch {
      results.push({ url, status: "waking_up" });
      console.log(`⚠️ ${url} is waking up...`);
    }
  }
  res.status(200).json({ success: true, message: "Ping completed", data: results });
});
const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;