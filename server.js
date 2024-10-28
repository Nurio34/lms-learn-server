require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AuthRouter = require("./routes");
const MediaRouter = require("./routes/cloudinary");
const CourseRouter = require("./routes/course");
const PaymentRouter = require("./routes/payment");
const MyCoursesRouter = require("./routes/my-courses");
const CommentRouter = require("./routes/comment");

const app = express();
app.use(express.json());

//! --- VARIABLES  ---
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;
//! ---------------------------

//! --- CORS CONFIGURATION  ---
app.use(cors());
//! ---------------------------

//! --- MONGODB CONNECTION  ---
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Database connected successfully"))
    .catch((e) => console.log(e));
//! ---------------------------

//! --- ROUTER ---
app.use("/auth", AuthRouter);
app.use("/media", MediaRouter);
app.use("/course", CourseRouter);
app.use("/payment", PaymentRouter);
app.use("/my-courses", MyCoursesRouter);
app.use("/comment", CommentRouter);
//! --------------

//! --- GLOBAL ERROR HANDLER  ---
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong ( from GLOBAL ERROR HANDLER)",
    });
});
//! -----------------------------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
