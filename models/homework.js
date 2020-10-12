const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Homework {
    constructor(id, lesson_id, assignment, completed) {
        this.id=id;
        this.lesson_id = lesson_id;
        this.assignment = assignment;
        this.completed=completed;
    }


    /** get all homework for a lesson: returns [homework, ...] */

    static async getAll(lessonId) {
        const result = await db.query(
            `SELECT * FROM homework WHERE lesson_id = $1`, [lessonId]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No homework`, 404)
        };
        return result.rows.map(h => new Homework(h.id, h.lesson_id, h.assignment, h.completed));
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

    /** get homework by id: returns homework */

    static async getById(id) {
        const result = await db.query(
            `SELECT * FROM homework WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such homwork with id: ${id}`, 404);
        }

        let h = result.rows[0];
        return new Note(h.id, h.lesson_id, h.assignment, h.completed);
    }

    /** create a homework assignment: returns homework */

    static async create(lesson_id, assignment, completed=false) {
        try {
            const newHomework = await db.query(`INSERT INTO homework (lesson_id, assignment, completed) VALUES ($1, $2) RETURNING id, lesson_id, text`, [lesson_id, assignment, completed]);
            const h = newHomework.rows[0];
            return new Homework(h.id, h.lesson_id, h.assignment, h.completed);
        } catch (e) {
            throw new Error("Something went wrong");
        }

    }

    /** update homework */

    async save() {
        await db.query(
            `UPDATE homework SET assignment=$1, completed=$2 WHERE id = $3`, [this.assignment, this.completed, this.id]);
    }

    /** delete homework */

    async remove() {
        await db.query(
            `DELETE FROM homework WHERE id = $1`, [this.id]);
    }
}


module.exports = Homework;