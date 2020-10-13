const express = require("express");
const jsonValidate = require("../middleware/jsonValidate");
const updateUserSchema = require("../schema/updateUserSchema.json");
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Student = require("../models/student");

/** get student by username */

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        let student = await Student.get(req.params.username);
        return res.json({ user: student });
    } catch (e) {
        return next(e);
    }
});

/** delete student from {username}; returns "deleted" */

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        let student = await Student.get(req.params.username);
        await student.remove();
        return res.json({ message: "user deleted" });
    } catch (e) {
        return next(e);
    }
});

/** updates a student */

router.patch("/:username", ensureCorrectUser, jsonValidate(updateUserSchema), async function (req, res, next) {
    try {
        let student = await Student.get(req.params.username);
        for (key in req.body) {
            student[key] = req.body[key];
        }
        student.save();
        const savedStudent = await Student.get(req.params.username);
        return res.json({ user: savedStudent });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
