const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Lesson {
    constructor(id, date, teacher_username, student_username, notes = [], homework = []) {
        this.id = id;
        this.date = date;
        this.teacher_username = teacher_username;
        this.student_username = student_username;
        this.notes = notes;
        this.homework = homework;
    }


    /** get all lessons for a teacher and student: returns [lesson, ...] */

    static async getAll(teacher_username, student_username) {
        const result = await db.query(
            `SELECT * FROM lessons WHERE teacher_username = $1 AND student_username = $2`, [teacher_username, student_username]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No Lesson for ${teacher_username} and ${student_username}`, 404);
        };
        return result.rows.map(l => new Lesson(l.id, l.date, l.teacher_username, l.student_username));
    }

    // static async search(str = "", min = 0, equity = 0) {

    //     const result = await db.query(
    //         `SELECT * FROM lesson_plans WHERE 
    //             (title ILIKE $1 OR company_handle ILIKE $1) AND salary >= $2 AND equity >= $3`, [`%${str}%`, min, equity]);
    //     if (result.rows.length === 0) {
    //         throw new ExpressError("no results", 400)
    //     };
    //     return result.rows.map(j => new Job(j.id, j.title, j.salary, j.equity, j.company_handle, j.date_posted));
    // }

    /** get lesson by id: returns lesson, notes, homework */

    static async getById(id) {
        const result = await db.query(
            `SELECT l.id, l.date, l.teacher_username, l.student_username,
            n.id AS note_id, n.note, h.id AS hw_id, h.assignment, h.completed
            FROM lessons AS l FULL JOIN notes as n ON n.lesson_id=l.id FULL JOIN homework AS h ON h.lesson_id=l.id
            WHERE l.id = $1`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such lesson with id: ${id}`, 404);
        }

        let l = result.rows[0];
        const notes = result.rows.map(n => {
            n.note_id,
                n.note;
        });
        const homework = result.rows.map(h => {
            h.hw_id,
                h.assignment,
                h.completed;
        });
        return new Lesson(l.id, l.date, l.teacher_username, l.student_username, notes, homework);
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