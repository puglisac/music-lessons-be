const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const Teacher = require("../../models/teacher");
const Student = require("../../models/student");
const Lesson = require("../../models/lesson");
const Note = require("../../models/note");

let token;
let lessonId
let noteId
describe("lesson Routes Test", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM teachers");
        await db.query("DELETE FROM students");
        await db.query("DELETE FROM lessons");
        await db.query("DELETe FROM notes");

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
        let l = await Lesson.create("testteacher", "teststudent")
        lessonId = l.id
        let n = await Note.create(lessonId, "this is note text")
        noteId=n.id
        const res = await request(app).post("/teachers/login").send({
            username: "testteacher",
            password: "123"
        });
        token = res.body.token;
    });


    describe("get notes/:teacher_username/:student_username/:id", function () {
        test("can get notes by lesson id", async function () {
            const resp = await request(app)
                .get(`/notes/testteacher/teststudent/${lessonId}`).send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                notes: [{
                    id: noteId,
                    lesson_id: lessonId,
                    note: "this is note text"
                }]
            });
        });
        test("return 401 if not authorized ", async function () {
            const resp = await request(app)
                .get(`/notes/notauser/teststudent/${lessonId}`).send({ _token: token });

            expect(resp.status).toEqual(401);
        });
        test("return 404 if not found ", async function () {
            const resp = await request(app)
                .get(`/notes/testteacher/teststudent/0`).send({ _token: token });

            expect(resp.status).toEqual(404);
        });
    });

    describe("post /notes/:teacher_username/:student_username/:lesson_id", function () {
        test("can create new note ", async function () {
            const resp = await request(app)
                .post(`/notes/testteacher/teststudent/${lessonId}`).send({
                    note: "new note text",
                    _token:token
                })

            expect(resp.status).toEqual(201);
            expect(resp.body).toEqual({
                note:{
                    id: expect.any(Number),
                    lesson_id: lessonId,
                    note: "new note text"
                }
            });
        });
        test("cannot create new note without correct info ", async function () {
            const resp = await request(app)
                .post(`/notes/testteacher/teststudent/${lessonId}`).send({
                    lesson_id: 5,
                    _token:token
                })

            expect(resp.status).toEqual(400);
        });
    });

    describe("get notes/:teacher_username/:student_username/:lesson_id/:id", function () {
        test("can get note by id", async function () {
            const resp = await request(app)
                .get(`/notes/testteacher/teststudent/${lessonId}/${noteId}`).send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                note: {
                    id: noteId,
                    lesson_id: lessonId,
                    note: "this is note text"
                }
            });
        });
        test("return 404 if not found ", async function () {
            const resp = await request(app)
                .get(`/notes/testteacher/teststudent/${lessonId}/0`).send({ _token: token });

            expect(resp.status).toEqual(404);
        });
    });
    describe("delete notes/:teacher_username/:student_username/:lesson_id/:id", function () {
        test("can delete a lesson ", async function () {
            const resp = await request(app)
                .delete(`/notes/testteacher/teststudent/${lessonId}/${noteId}`).send({ "_token": token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "note deleted"
            });
        });
        test("return 401 if not authorized ", async function () {
            const resp = await request(app)
                .delete(`/notes/notauser/teststudent/${lessonId}/${noteId}`).send({ "_token": token });

            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            });
        });
    });
    describe("patch notes/:teacher_username/:student_username/:lesson_id/:id", function () {
        test("can update a note ", async function () {
            const resp = await request(app)
                .patch(`/notes/testteacher/teststudent/${lessonId}/${noteId}`).send({
                    note: "new note text",
                    _token: token
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                note: {
                    id: noteId,
                    lesson_id: lessonId,
                    note: "new note text"
                }
            });
        });

        test("cannot update note without correct info", async function () {
            const resp = await request(app)
                .patch(`/notes/testteacher/teststudent/${lessonId}/${noteId}`).send({
                    lesson_id: 84,
                    _token: token
                });

            expect(resp.status).toEqual(400);

        });

    });
});

afterAll(async function () {
    await db.end();
});