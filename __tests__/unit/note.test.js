const db = require("../../db");
const Lesson = require("../../models/lesson");
const Teacher = require("../../models/teacher")
const Student = require("../../models/student")
const Note = require ("../../models/note")

describe("Test job class", function() {
    let lessonId;
    let noteId
    beforeEach(async function() {
        await db.query("DELETE FROM students");
        await db.query("DELETE FROM teachers");
        await db.query("DELETE FROM lessons");
        await db.query("DELETE FROM notes")

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

        let n = await Note.create(
            lessonId, "note text"
        )
        noteId = n.id;
        
    });
    test("can get note by lesson id", async function() {
        let n = await Note.getAll(lessonId)

        expect(n).toEqual([{
            id: noteId,
            lesson_id: lessonId,
            note: "note text"
        }]);
    });

    test("can create a note", async function() {
        let l = await Note.create(
            lessonId,
            "test note text"
        );

        expect(l).toEqual({
            id: expect.any(Number),
            lesson_id: lessonId,
            note: "test note text"
        });
    });
    test("can get note by id", async function() {
        let n = await Note.getById(noteId);

        expect(n.id).toEqual(noteId);
    });

});
afterAll(async function() {
    await db.end();
});