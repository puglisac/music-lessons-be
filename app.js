/** Express app for jobly. */

const express = require("express");

const ExpressError = require("./helpers/expressError");
const { authenticateJWT } = require("./middleware/auth");
const morgan = require("morgan");
const authRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/teachers");
const studentRoutes = require("./routes/students");
const lessonRoutes = require("./routes/lessons");
const noteRoutes = require("./routes/notes");
const homeworkRoutes = require("./routes/homework");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
// add logging system
app.use(morgan("tiny"));

// get auth token for all routes
app.use(authenticateJWT);

// routes
app.use(authRoutes);
app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);
app.use("/lessons", lessonRoutes);
app.use("/notes", noteRoutes);
app.use("/homework", homeworkRoutes);


/** 404 handler */
app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);

    // pass the error to the next piece of middleware
    return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    return res.json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;