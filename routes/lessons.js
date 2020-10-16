const express = require("express");
const jsonValidate = require("../middleware/jsonValidate");
const lessonSchema = require("../schema/lessonSchema.json");
const { json } = require("express");
const router = new express.Router();
const Lesson = require("../models/lesson");
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureTeacherOrStudent, ensureTeacher } = require("../middleware/auth");

router.get("/:teacher_username/:student_username", ensureTeacherOrStudent, async function (req, res, next) {
	const { teacher_username, student_username } = req.params;
	try {
		const lessons = await Lesson.getAll(teacher_username, student_username);
		return res.json({ lessons: lessons });
	} catch (e) {
		return next(e);
	}
});

/** get lesson by id */

router.get("/:teacher_username/:student_username/:id", ensureTeacher, async function (req, res, next) {
	try {
		let lesson = await Lesson.getById(req.params.id);
		return res.json({ lesson: lesson });
	} catch (e) {
		return next(e);
	}
});

/** create lesson */

router.post("/:teacher_username/:student_username", ensureTeacher, jsonValidate(lessonSchema), async function (req, res, next) {
	try {
		let newLesson = await Lesson.create(req.body.date, req.params.teacher_username, req.params.student_username);
		return res.status(201).json({ lesson: newLesson });
	} catch (e) {
		return next(e);
	}
});

/** delete lesson from {id}; returns "deleted" */

router.delete("/:teacher_username/:student_username/:id", ensureTeacher, async function (req, res, next) {
	try {
		const lesson = await Lesson.getById(req.params.id);
		await lesson.remove();
		return res.json({ message: "lesson deleted" });
	} catch (e) {
		return next(e);
	}
});

/** updates a lesson */

router.patch("/:teacher_username/:student_username/:id", ensureTeacher, jsonValidate(lessonSchema), async function (req, res, next) {
	try {
		let lesson = await Lesson.getById(req.params.id);
		for (key in req.body) {
			lesson[key] = req.body[key];
		}
		lesson.save();
		const savedLesson = await Lesson.getById(req.params.id);
		return res.json({ lesson: savedLesson });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
