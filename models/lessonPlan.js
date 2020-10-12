const db = require("../db");
const ExpressError = require("../helpers/expressError");

class LessonPlan {
    constructor(id, title, description, lesson_plan, teacher_username) {
        this.id=id
        this.title = title;
        this.description = description;
        this.lesson_plan = lesson_plan;
        this.teacher_username = teacher_username;
    }


    /** get all lesson plans for a teacher: returns [lessonPlan, ...] */

    static async getAll(teacher_username) {
        const result = await db.query(
            `SELECT * FROM lesson_plans WHERE teacher_username = $1`, [teacher_username]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No Lesson Plans for ${teacher_username}`, 404)
        };
        return result.rows.map(lp => new LessonPlan(lp.id, lp.title, lp.description, lp.teacher_username));
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

    /** get lesson plan by id: returns lessonPlan */

    static async getById(id) {
        const result = await db.query(
            `SELECT * FROM lesson_plans WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such lesson plan with id: ${id}`, 404);
        }

        let lp = result.rows[0];
        return new LessonPlan(lp.id, lp.title, lp.description, lp.lesson_plan, lp.teacher_username);
    }

    /** create a lesson plan: returns lessonPlan */

    static async create(title, description, lesson_plan, teacher_username) {
        try {
            const newLessonPlan = await db.query(`INSERT INTO lesson_plans (title, description, lesson_plan, teacher_username) VALUES ($1, $2, $3, $4) RETURNING id, title, description, lesson_plan, teacher_username`, [title, description, lesson_plan, teacher_username]);
            const lp = newLessonPlan.rows[0];
            return new LessonPlan(lp.id, lp.title, lp.description, lp.lesson_plan, lp.teacher_username);
        } catch (e) {
            throw new Error("Something went wrong");
        }

    }

    /** update lesson plan */

    async save() {
        await db.query(
            `UPDATE lesson_plans SET title=$1, description=$2, lesson_plan=$3 WHERE id = $4`, [this.title, this.description, this.lesson_plan, this.id]);
    }

    /** delete lesson plan */

    async remove() {
        await db.query(
            `DELETE FROM lesson_plans WHERE id = $1`, [this.id]);
    }
}


module.exports = LessonPlan;