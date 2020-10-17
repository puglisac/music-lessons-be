const db = require("../../db");
const Lesson = require("../../models/lesson");
const Teacher = require("../../models/teacher")
const Student = require("../../models/student")
const Homework = require ("../../models/homework")

describe("Test homework class", function() {
    let lessonId;
    let homeworkId
    beforeEach(async function() {
        await db.query("DELETE FROM students");
        await db.query("DELETE FROM teachers");
        await db.query("DELETE FROM lessons");
        await db.query("DELETE FROM homework")

        let t = await Teacher.register(
            "testteacher",
            "123",
            "test teacher",
            "test@test.com"
        );

        let s = await Student.register(
            "teststudent",
            "123",
            "test student",
            "test@test.com"
        );

        let l = await Lesson.create(
            "testteacher",
            "teststudent"
        );
        lessonId = l.id;

        let h = await Homework.create(
            lessonId, "do something"
        )
        homeworkId = h.id;
        
    });
    test("can get homework by lesson id", async function() {
        let h = await Homework.getAll(lessonId)

        expect(h).toEqual([{
            id: homeworkId,
            lesson_id: lessonId,
            assignment: "do something", 
            completed: false
        }]);
    });

    test("can create homework", async function() {
        let h = await Homework.create(
            lessonId,
            "another assignment"
        );

        expect(h).toEqual({
            id: expect.any(Number),
            lesson_id: lessonId,
            assignment: "another assignment", 
            completed: false
        });
    });
    test("can get homework by id", async function() {
        let h = await Homework.getById(homeworkId);

        expect(h.id).toEqual(homeworkId);
    });

});
afterAll(async function() {
    await db.end();
});