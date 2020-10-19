const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const Teacher = require("../../models/teacher");
const Student = require("../../models/student");
const Lesson = require("../../models/lesson");
const Homework = require("../../models/homework");

let token;
let lessonId;
let homeworkId;
describe("lesson Routes Test", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM teachers");
        await db.query("DELETE FROM students");
        await db.query("DELETE FROM lessons");
        await db.query("DELETe FROM homework");

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
        let l = await Lesson.create("testteacher", "teststudent");
        lessonId = l.id;
        let h = await Homework.create(lessonId, "homework assignment");
        homeworkId = h.id;
        const res = await request(app).post("/teachers/login").send({
            username: "testteacher",
            password: "123"
        });
        token = res.body.token;
    });


    describe("get homework/:teacher_username/:student_username/:lesson_id", function () {
        test("can get homework by lesson id", async function () {
            const resp = await request(app)
                .get(`/homework/testteacher/teststudent/${lessonId}`).send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                homework: [{
                    id: homeworkId,
                    lesson_id: lessonId,
                    assignment: "homework assignment",
                    completed: false
                }]
            });
        });
        test("return 401 if not authorized ", async function () {
            const resp = await request(app)
                .get(`/homework/notauser/teststudent/${lessonId}`).send({ _token: token });

            expect(resp.status).toEqual(401);
        });
        test("return 404 if not found ", async function () {
            const resp = await request(app)
                .get(`/homework/testteacher/teststudent/0`).send({ _token: token });

            expect(resp.status).toEqual(404);
        });
    });

    describe("post /homework/:teacher_username/:student_username/:lesson_id", function () {
        test("can create new homework ", async function () {
            const resp = await request(app)
                .post(`/homework/testteacher/teststudent/${lessonId}`).send({
                    assignment: "new assignment",
                    _token: token
                });

            expect(resp.status).toEqual(201);
            expect(resp.body).toEqual({
                homework: {
                    id: expect.any(Number),
                    lesson_id: lessonId,
                    assignment: "new assignment",
                    completed: false
                }
            });
        });
        test("cannot create new homework without correct info ", async function () {
            const resp = await request(app)
                .post(`/homework/testteacher/teststudent/${lessonId}`).send({
                    lesson_id: 5,
                    _token: token
                });

            expect(resp.status).toEqual(400);
        });
    });

    describe("get homework/:teacher_username/:student_username/:lesson_id/:id", function () {
        test("can get homework by id", async function () {
            const resp = await request(app)
                .get(`/homework/testteacher/teststudent/${lessonId}/${homeworkId}`).send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                homework: {
                    id: homeworkId,
                    lesson_id: lessonId,
                    assignment: "homework assignment",
                    completed: false
                }
            });
        });
        test("return 404 if not found ", async function () {
            const resp = await request(app)
                .get(`/homework/testteacher/teststudent/${lessonId}/0`).send({ _token: token });

            expect(resp.status).toEqual(404);
        });
    });
    describe("delete homework/:teacher_username/:student_username/:lesson_id/:id", function () {
        test("can delete homework ", async function () {
            const resp = await request(app)
                .delete(`/homework/testteacher/teststudent/${lessonId}/${homeworkId}`).send({ "_token": token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "homework deleted"
            });
        });
        test("return 401 if not authorized ", async function () {
            const resp = await request(app)
                .delete(`/homework/notauser/teststudent/${lessonId}/${homeworkId}`).send({ "_token": token });

            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            });
        });
    });
    describe("patch homework/:teacher_username/:student_username/:lesson_id/:id", function () {
        test("can update homework ", async function () {
            const resp = await request(app)
                .patch(`/homework/testteacher/teststudent/${lessonId}/${homeworkId}`).send({
                    assignment: "new assignment",
                    completed: true,
                    _token: token
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                homework: {
                    id: homeworkId,
                    lesson_id: lessonId,
                    assignment: "new assignment",
                    completed: true
                }
            });
        });

        test("cannot update homework without correct info", async function () {
            const resp = await request(app)
                .patch(`/homework/testteacher/teststudent/${lessonId}/${homeworkId}`).send({
                    completed: 84,
                    _token: token
                });

            expect(resp.status).toEqual(400);

        });

    });
});

afterAll(async function () {
    await db.end();
});