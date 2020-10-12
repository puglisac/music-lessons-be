const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Student {
	constructor(username, full_name, email) {
		this.username = username;
		this.full_name = full_name
		this.email = email;
	}

	static async register(username, password, full_name, email,) {
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`INSERT INTO students (
            username,
            password,
            full_name,
            email)
          VALUES ($1, $2, $3, $4)
          RETURNING username, full_name, email`,
			[ username, hashedPassword, full_name, email]
		);
		return result.rows[0];
	}

	/** Authenticate: is this username/password valid? Returns boolean. */

	static async authenticate(username, password) {
		const results = await db.query(
			`SELECT username, password 
       FROM students
       WHERE username = $1`,
			[ username ]
		);
		const student = results.rows[0];

		return await bcrypt.compare(password, student.password);
	}

	/** Get: get student by username **/

	static async get(username) {
		const student = await db.query(
			`
    SELECT u.username, full_name, email, FROM students WHERE u.username = $1`,
			[ username ]
		);
		if (!student.rows[0]) {
			throw new ExpressError(`No such user: ${username}`, 404);
		}
		const s = student.rows[0];

		return new Student(s.username, s.full_name, s.email);
	}
	async save() {
		await db.query(
			`UPDATE students SET full_name=$2, email=$3, WHERE username = $1`,
			[ this.username, this.full_name, this.email, ]
		);
	}
	async remove() {
		await db.query(`DELETE FROM students WHERE username = $1`, [ this.username ]);
	}
}

module.exports = Student;
