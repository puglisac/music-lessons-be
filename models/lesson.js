const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Lesson {
    constructor(id, date, teacher_username, student_username) {
        this.id = id;
        this.date = date;
        this.teacher_username = teacher_username;
        this.student_username = student_username;
    }


    /** get all lessons for a teacher and student: returns [lesson, ...] */

    static async getAll(teacher_username, student_username) {
        const result = await db.query(
            `SELECT * FROM lessons WHERE teacher_username = $1 AND student_username = $2 ORDER BY date DESC`, [teacher_username, student_username]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No Lesson for ${teacher_username} and ${student_username}`, 404);
        };
        return result.rows.map(l => new Lesson(l.id, l.date, l.teacher_username, l.student_username));
    }

    static async search(teacher_username, student_username, str) {

        const result = await db.query(
            `SELECT * FROM lessons WHERE teacher_username = $1 AND student_username = $2 AND DATE_TRUNC('day', date) = $3 ORDER BY date DESC`, [teacher_username, student_username, str]);
        if (result.rows.length === 0) {
            throw new ExpressError("no results", 404);
        };
        return result.rows.map(l => new Lesson(l.id, l.date, l.teacher_username, l.student_username));
    }

    /** get lesson by id: returns lesson, notes, homework */

    static async getById(id) {
        const result = await db.query(
            `SELECT id, date, teacher_username, student_username 
            FROM lessons 
            WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such lesson with id: ${id}`, 404);
        }

        let l = result.rows[0];

        return new Lesson(l.id, l.date, l.teacher_username, l.student_username);
    }

    /** create a lesson: returns lesson */

    static async create(teacher_username, student_username, date = new Date()) {
        try {
            const newLesson = await db.query(`INSERT INTO lessons (date, teacher_username, student_username) VALUES ($1, $2, $3) RETURNING id, date, teacher_username, student_username`, [date, teacher_username, student_username]);
            const l = newLesson.rows[0];
            return new Lesson(l.id, l.date, l.teacher_username, l.student_username);
        } catch (e) {
            throw new Error("Something went wrong");
        }

    }

    /** update lesson date */

    async save() {
        await db.query(
            `UPDATE lessons SET date=$1 WHERE id = $2`, [this.date, this.id]);
    }

    /** delete lesson */

    async remove() {
        await db.query(
            `DELETE FROM lessons WHERE id = $1`, [this.id]);
    }
}


module.exports = Lesson;