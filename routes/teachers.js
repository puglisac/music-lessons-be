const express = require("express");
const jsonValidate = require("../middleware/jsonValidate");
const updateUserSchema = require("../schema/updateUserSchema.json");
const { json } = require("express");
const router = new express.Router();
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Teacher = require("../models/teacher");

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
		return res.json({ message: "user deleted" });
	} catch (e) {
		return next(e);
	}
});

/** updates a teacher */

router.patch("/:username", ensureCorrectUser, jsonValidate(updateUserSchema), async function (req, res, next) {
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

module.exports = router;
