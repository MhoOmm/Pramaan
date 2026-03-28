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
const hfrouter =  require("./routes/inferenceRouter")

dotenv.config({ quiet: true, path: path.join(__dirname, ".env") });
//database connection
dbconnect.connect();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://hack4impacttrack2-api-smiths.onrender.com"
];
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
    useTempFiles: true,
    tempFileDir: os.tmpdir()
  })
);

app.use("/api/user", userRoutes);

// post
app.use('/api/chat',postRouter);
app.use("/api/ml", mlRouter);
app.use("/api/hf",hfrouter)


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});