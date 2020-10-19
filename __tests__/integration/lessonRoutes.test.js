const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const Teacher = require("../../models/teacher");
const Student = require("../../models/student");
const Lesson = require("../../models/lesson");

let token;
let lessonId;
describe("lesson Routes Test", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM teachers");
        await db.query("DELETE FROM students");
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
        let l = await Lesson.create("testteacher", "teststudent");
        lessonId = l.id;
        const res = await request(app).post("/teachers/login").send({
            username: "testteacher",
            password: "123"
        });
        token = res.body.token;
    });


    describe("get lessons/:teacher_username/:student_username", function () {
        test("can get lessons by teacher and student username", async function () {
            const resp = await request(app)
                .get("/lessons/testteacher/teststudent").send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                lessons: [{
                    id: lessonId,
                    teacher_username: "testteacher",
                    student_username: "teststudent",
                    date: expect.any(String),
                    homework: expect.any(Array),
                    notes: expect.any(Array)
                }]
            });
        });
        test("return 401 if not authorized ", async function () {
            const resp = await request(app)
                .get("/lessons/notauser/teststudent").send({ _token: token });

            expect(resp.status).toEqual(401);
        });
    });

    describe("post /lessons/:teacher_username/:student_username", function () {
        test("can create new lesson ", async function () {
            const resp = await request(app)
                .post("/lessons/testteacher/teststudent").send({ _token: token });

            expect(resp.status).toEqual(201);
            expect(resp.body).toEqual({
                lesson: {
                    id: expect.any(Number),
                    teacher_username: "testteacher",
                    student_username: "teststudent",
                    date: expect.any(String),
                    homework: expect.any(Array),
                    notes: expect.any(Array)
                }
            });
        });
    });

    describe("get lessons/:teacher_username/:student_username/:id", function () {
        test("can get lesson by id", async function () {
            const resp = await request(app)
                .get(`/lessons/testteacher/teststudent/${lessonId}`).send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                lesson: {
                    id: lessonId,
                    teacher_username: "testteacher",
                    student_username: "teststudent",
                    date: expect.any(String),
                    homework: expect.any(Array),
                    notes: expect.any(Array)
                }
            });
        });
        test("return 404 if not found ", async function () {
            const resp = await request(app)
                .get("/lessons/testteacher/teststudent/0").send({ _token: token });

            expect(resp.status).toEqual(404);
        });
    });
    describe("delete lessons/:teacher_username/:student_username/:id", function () {
        test("can delete a lesson ", async function () {
            const resp = await request(app)
                .delete(`/lessons/testteacher/teststudent/${lessonId}`).send({ "_token": token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "lesson deleted"
            });
        });
        test("return 401 if not authorized ", async function () {
            const resp = await request(app)
                .delete(`/lessons/notauser/teststudent/${lessonId}`).send({ "_token": token });

            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            });
        });
    });
    describe("patch lessons/:teacher_username/:student_username/:id", function () {
        test("can update a lesson ", async function () {
            const resp = await request(app)
                .patch(`/lessons/testteacher/teststudent/${lessonId}`).send({
                    date: new Date(),
                    _token: token
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                lesson: {
                    id: lessonId,
                    teacher_username: "testteacher",
                    student_username: "teststudent",
                    date: expect.any(String),
                    homework: expect.any(Array),
                    notes: expect.any(Array)
                }
            });
        });

        test("cannot update lesson without correct info", async function () {
            const resp = await request(app)
                .patch(`/lessons/testteacher/teststudent/${lessonId}`).send({
                    teacher_username: 84,
                    _token: token
                });

            expect(resp.status).toEqual(400);

        });

    });
});

afterAll(async function () {
    await db.end();
});