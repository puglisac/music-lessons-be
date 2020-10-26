const express = require("express");
const router = new express.Router();
const jsonValidate = require("../middleware/jsonValidate");
const userSchema = require("../schema/userSchema.json");
const signInSchema = require("../schema/signInSchema.json");
const jwt = require("jsonwebtoken");
const ExpressError = require("../helpers/expressError");
const { SECRET_KEY } = require("../config");
const Teacher = require("../models/teacher");
const Student = require("../models/student");

/** POST /login - login: {username, password} => {token}
 *
 **/

router.post("/teachers/login", jsonValidate(signInSchema), async function (req, res, next) {
	try {
		const { username, password } = req.body;
		const user = await Teacher.get(username);

		if (!user) {
			throw new ExpressError("Invalid username/password", 400);
		}
		if (await Teacher.authenticate(username, password)) {
			let token = jwt.sign({ username }, SECRET_KEY);
			return res.json({ token });
		} else {
			throw new ExpressError("Invalid username/password", 400);
		}
	} catch (err) {
		return next(err);
	}
});

/** POST /register - register user: registers, logs in, and returns token.
 
 */
router.post("/teachers/signup", jsonValidate(userSchema), async function (req, res, next) {
	try {
		const { username, password, full_name, email } = req.body;
		await Teacher.register(username, password, full_name, email);
		let token = jwt.sign({ username }, SECRET_KEY);
		return res.status(201).json({ token });
	} catch (err) {
		if (err.code === "23505") {
			return next(new ExpressError("Username/email taken. Please pick another!", 400));
		}
		return next(err);
	}
});

router.post("/students/login", jsonValidate(signInSchema), async function (req, res, next) {
	try {
		const { username, password } = req.body;
		const user = await Student.get(username);

		if (!user) {
			throw new ExpressError("Invalid user/password", 400);
		}
		if (await Student.authenticate(username, password)) {
			let token = jwt.sign({ username }, SECRET_KEY);
			return res.json({ token });
		} else {
			throw new ExpressError("Invalid username/password", 400);
		}
	} catch (err) {
		return next(err);
	}
});

/** POST /register - register user: registers, logs in, and returns token.
 
 */
router.post("/students/signup", jsonValidate(userSchema), async function (req, res, next) {
	try {
		const { username, password, full_name, email } = req.body;
		await Student.register(username, password, full_name, email);
		let token = jwt.sign({ username }, SECRET_KEY);
		return res.status(201).json({ token });
	} catch (err) {
		if (err.code === "23505") {
			return next(new ExpressError("Username/email taken. Please pick another!", 400));
		}
		return next(err);
	}
});
module.exports = router;
