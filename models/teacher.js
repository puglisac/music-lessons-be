const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Teacher {
	constructor(username, full_name, email) {
		this.username = username;
		this.full_name = full_name
		this.email = email;

	}

	static async register(username, password, full_name, email,) {
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`INSERT INTO teachers (
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
       FROM teachers
       WHERE username = $1`,
			[ username ]
		);
		const teacher = results.rows[0];

		return await bcrypt.compare(password, teacher.password);
	}

	/** Get: get user by username **/

	static async get(username) {
		const teacher = await db.query(
			`
    SELECT u.username, full_name, email, FROM teachers WHERE u.username = $1`,
			[ username ]
		);
		if (!teacher.rows[0]) {
			throw new ExpressError(`No such user: ${username}`, 404);
		}
		const t = teacher.rows[0];

		return new Teacher(t.username, t.full_name, t.email);
	}
	async save() {
		await db.query(
			`UPDATE teachers SET full_name=$2, email=$3, WHERE username = $1`,
			[ this.username, this.full_name, this.email, ]
		);
	}
	async remove() {
		await db.query(`DELETE FROM teachers WHERE username = $1`, [ this.username ]);
	}
}

module.exports = Teacher;
