const express = require("express");
const jsonValidate = require("../middleware/jsonValidate");
const updateTeacherSchema = require("../schema/updateTeacherSchema.json");
const updateStudentSchema = require("../schema/updateStudentSchema.json");
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Teacher = require("../models/teacher");
const Student = require("../models/student");

/** get teacher by username */

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
	try {
		let teacher = await Teacher.get(req.params.username);
		return res.json({ user: teacher });
	} catch (e) {
		return next(e);
	}
});

/** delete teacher from {username}; returns "deleted" */

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
	try {
		let teacher = await Teacher.get(req.params.username);
		await teacher.remove();
		return res.json({ message: "teacher deleted" });
	} catch (e) {
		return next(e);
	}
});

/** updates a teacher */

router.patch("/:username", ensureCorrectUser, jsonValidate(updateTeacherSchema), async function (req, res, next) {
	try {
		let teacher = await Teacher.get(req.params.username);
		for (key in req.body) {
			teacher[key] = req.body[key];
		}
		teacher.save();
		const savedTeacher = await Teacher.get(req.params.username);
		return res.json({ user: savedTeacher });
	} catch (e) {
		return next(e);
	}
});

// adds a student to teacher
router.patch("/:username/add_student", ensureCorrectUser, jsonValidate(updateStudentSchema), async function (req, res, next) {
	try {
		let teacher = await Teacher.get(req.params.username);
		let student = await Student.get(req.body.student_username);
		if (student.teacher_username) {
			throw new ExpressError(`${student.username} already has a teacher`, 401);
		}
		student.teacher_username = teacher.username;
		student.save();
		return res.json({ message: "student added" });
	} catch (e) {
		return next(e);
	}
});


// removes student from teacher
router.patch("/:username/remove_student", ensureCorrectUser, jsonValidate(updateStudentSchema), async function (req, res, next) {
	try {
		let student = await Student.get(req.body.student_username);
		student.teacher_username = null;
		student.save();
		return res.json({ message: "student removed" });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
