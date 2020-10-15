const express = require("express");
const jsonValidate = require("../middleware/jsonValidate");
const { json } = require("express");
const router = new express.Router();
const Note = require("../models/note");
const ExpressError = require("../helpers/expressError");
const { ensureLoggedIn, ensureTeacherOrStudent, ensureTeacher } = require("../middleware/auth");

// get all notes for a lesson
router.get("/:teacher_username/:student_username/:lesson_id", ensureTeacherOrStudent, async function (req, res, next) {
	try {
		let notes = await Note.getAll(req.params.lesson_id);
		return res.json({ notes: notes });
	} catch (e) {
		return next(e);
	}
});

/** get note by id */

router.get("/:teacher_username/:student_username/:lesson_id/:id", ensureTeacherOrStudent, async function (req, res, next) {
	try {
		let note = await Note.getById(req.params.id);
		return res.json({ note: note });
	} catch (e) {
		return next(e);
	}
});

/** create lesson */

router.post("/:teacher_username/:student_username/:lesson_id", ensureTeacher, jsonValidate(jobSchema), async function (req, res, next) {
	try {
		let newNote = await Note.create(req.params.lesson_id, req.body.note);
		return res.status(201).json({ note: newNote });
	} catch (e) {
		return next(e);
	}
});

/** delete note from {id}; returns "deleted" */

router.delete("/:teacher_username/:student_username/:lesson_id/:id", ensureTeacher, async function (req, res, next) {
	try {
		const note = await Note.getById(req.params.id);
		await note.remove();
		return res.json({ message: "note deleted" });
	} catch (e) {
		return next(e);
	}
});

/** updates a note */

router.patch("/:teacher_username/:student_username/lesson_id/:id", ensureTeacher, jsonValidate(updateJobSchema), async function (req, res, next) {
	try {
		let note = await Note.getById(req.params.id);
		for (key in req.body) {
			note[key] = req.body[key];
		}
		note.save();
		const savedNote = await Note.getById(req.params.id);
		return res.json({ note: savedNote });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
