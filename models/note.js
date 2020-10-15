const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Note {
    constructor(id, lesson_id, note) {
        this.id = id;
        this.lesson_id = lesson_id;
        this.note = note;
    }


    /** get all notes for a lesson: returns [note, ...] */

    static async getAll(lessonId) {
        const result = await db.query(
            `SELECT * FROM notes WHERE lesson_id = $1`, [lessonId]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No notes`, 404);
        };
        return result.rows.map(n => new Note(n.id, n.lesson_id, n.note));
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

    /** get note by id: returns note */

    static async getById(id) {
        const result = await db.query(
            `SELECT * FROM notes WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such lesson with id: ${id}`, 404);
        }

        let n = result.rows[0];
        return new Note(n.id, n.lesson_id, n.note);
    }

    /** create a note: returns note */

    static async create(lesson_id, note) {
        try {
            const newNote = await db.query(`INSERT INTO notes (lesson_id, note) VALUES ($1, $2) RETURNING id, lesson_id, note`, [lesson_id, note]);
            const n = newNote.rows[0];
            return new Note(n.id, n.lesson_id, n.note);
        } catch (e) {
            throw new Error("Something went wrong");
        }

    }

    /** update note text */

    async save() {
        await db.query(
            `UPDATE notes SET note=$1 WHERE id = $2`, [this.date, this.note]);
    }

    /** delete note */

    async remove() {
        await db.query(
            `DELETE FROM notes WHERE id = $1`, [this.id]);
    }
}


module.exports = Note;