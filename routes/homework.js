const express = require("express");
const jsonValidate = require("../middleware/jsonValidate");
const { json } = require("express");
const router = new express.Router();
const Homework = require("../models/homework");
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureTeacherOrStudent, ensureTeacher } = require("../middleware/auth");

// get all homework for a lesson
router.get("/:teacher_username/:student_username/:lesson_id", ensureTeacherOrStudent, async function (req, res, next) {
    try {
        let homework = await Homework.getAll(req.params.lesson_id);
        return res.json({ homework: homework });
    } catch (e) {
        return next(e);
    }
});

/** get homework by id */

router.get("/:teacher_username/:student_username/:lesson_id/:id", ensureTeacherOrStudent, async function (req, res, next) {
    try {
        let homework = await Homework.getById(req.params.id);
        return res.json({ homework: homework });
    } catch (e) {
        return next(e);
    }
});

/** create homework */

router.post("/:teacher_username/:student_username/:lesson_id", ensureTeacher, jsonValidate(jobSchema), async function (req, res, next) {
    try {
        let newHomework = await Homework.create(req.params.lesson_id, req.body.assignment);
        return res.status(201).json({ homework: newHomework });
    } catch (e) {
        return next(e);
    }
});

/** delete homework from {id}; returns "deleted" */

router.delete("/:teacher_username/:student_username/:lesson_id/:id", ensureTeacher, async function (req, res, next) {
    try {
        const homework = await Homework.getById(req.params.id);
        await homework.remove();
        return res.json({ message: "homework deleted" });
    } catch (e) {
        return next(e);
    }
});

/** updates homework */

router.patch("/:teacher_username/:student_username/lesson_id/:id", ensureTeacher, jsonValidate(updateJobSchema), async function (req, res, next) {
    try {
        let homework = await Homework.getById(req.params.id);
        for (key in req.body) {
            homework[key] = req.body[key];
        }
        note.save();
        const savedHomework = await Homework.getById(req.params.id);
        return res.json({ homework: savedHomework });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
