const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Teacher {
	constructor(username, full_name, email, students = []) {
		this.username = username;
		this.full_name = full_name;
		this.email = email;
		this.students = students;

	}

	static async register(username, password, full_name, email) {
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`INSERT INTO teachers (
            username,
            password,
            full_name,
            email)
          VALUES ($1, $2, $3, $4)
          RETURNING username, full_name, email`,
			[username, hashedPassword, full_name, email]
		);
		return result.rows[0];
	}

	/** Authenticate: is this username/password valid? Returns boolean. */

	static async authenticate(username, password) {
		const results = await db.query(
			`SELECT username, password 
       		FROM teachers
       		WHERE username = $1`,
			[username]
		);
		const teacher = results.rows[0];

		return await bcrypt.compare(password, teacher.password);
	}

	/** Get: get teacher by username **/

	static async get(username) {
		const teacher = await db.query(
			`SELECT t.username, t.full_name, t.email, 
			s.username AS student_username, s.full_name 
			AS student_full_name, 
			s.email AS student_email
			FROM teachers AS t FULL JOIN students AS s 
			ON s.teacher_username = t.username 
			WHERE username = $1`,
			[username]
		);
		if (!teacher.rows[0]) {
			throw new ExpressError(`No such user: ${username}`, 404);
		}
		const t = teacher.rows[0];
		const students = teacher.rows.map(s => {
			s.student_username,
			s.student_full_name,
			s.student_email
		});

		return new Teacher(t.username, t.full_name, t.email, students);
	}
	async save() {
		await db.query(
			`UPDATE teachers SET full_name=$2, email=$3 WHERE username = $1`,
			[this.username, this.full_name, this.email,]
		);
	}
	async remove() {
		await db.query(`DELETE FROM teachers WHERE username = $1`, [this.username]);
	}
}

module.exports = Teacher;
