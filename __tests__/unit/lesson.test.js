const db = require("../../db");
const Lesson = require("../../models/lesson");
const Teacher = require("../../models/teacher");
const Student = require("../../models/student");

describe("Test lesson class", function () {
    let testId;
    beforeEach(async function () {
        await db.query("DELETE FROM students");
        await db.query("DELETE FROM teachers");
        await db.query("DELETE FROM lessons");

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
        testId = l.id;
    });
    test("can get lesson by student and teacher", async function () {
        let l = await Lesson.getAll("testteacher", "teststudent");

        expect(l).toEqual([{
            id: testId,
            date: expect.any(Date),
            teacher_username: "testteacher",
            student_username: "teststudent"
        }]);
    });

    test("can create a lesson", async function () {
        let l = await Lesson.create(
            "testteacher",
            "teststudent"
        );

        expect(l).toEqual({
            id: expect.any(Number),
            date: expect.any(Date),
            teacher_username: "testteacher",
            student_username: "teststudent"
        });
    });
    test("can get lesson by id", async function () {
        let l = await Lesson.getById(testId);

        expect(l.id).toEqual(testId);
    });

});
afterAll(async function () {
    await db.end();
});