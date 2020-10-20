const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const Teacher = require("../../models/teacher");
const Student = require("../../models/student");

let token;
describe("teacher Routes Test", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM teachers");
        let t = await Teacher.register(
            "testteacher",
            "123",
            "test teacher",
            "test@test.com"
        );
        const res = await request(app).post("/teachers/login").send({
            username: "testteacher",
            password: "123"
        });
        token = res.body.token;
    });


    describe("get teachers/:username", function () {
        test("can get teacher by username", async function () {
            const resp = await request(app)
                .get("/teachers/testteacher").send({ _token: token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                teacher: {
                    username: "testteacher",
                    full_name: "test teacher",
                    email: "test@test.com",
                    is_teache: true
                }
            });
        });
        test("return 404 if not found ", async function () {
            const resp = await request(app)
                .get("/teachers/notauser").send({ _token: token });

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                status: 404,
                message: `No such user: notauser`
            });
        });
    });

    describe("post /teachers/signup", function () {
        test("can create new teacher ", async function () {
            const resp = await request(app)
                .post("/teachers/signup").send({
                    username: "newteacher",
                    password: "password",
                    full_name: "new",
                    email: "test.user@email.com"
                });

            expect(resp.status).toEqual(201);
            expect(resp.body).toEqual({
                token: expect.any(String)

            });
        });

        test("cannot create new teacher without correct info", async function () {
            const resp = await request(app)
                .post("/teachers/signup").send({
                    username: "newuser",
                    first_name: "new",
                    last_name: "name",
                    email: "test.user@email.com",
                    photo_url: "",
                    is_admin: true
                });

            expect(resp.status).toEqual(400);

        });

    });
    describe("delete teachers/:username", function () {
        test("can delete a teacher ", async function () {
            const resp = await request(app)
                .delete(`/teachers/testteacher`).send({ "_token": token });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "teacher deleted"
            });
        });
        test("return 401 if not authorized ", async function () {
            const resp = await request(app)
                .delete("/teachers/notauser").send({ "_token": token });

            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            });
        });
    });
    describe("patch teachers/:username", function () {
        test("can update a teacher ", async function () {
            const resp = await request(app)
                .patch(`/teachers/testteacher`).send({
                    full_name: "new name",
                    _token: token
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                teacher: {
                    username: "testteacher",
                    full_name: "new name",
                    email: "test@test.com",
                    is_teacher: true
                }
            });
        });

        test("cannot update teacher without correct info", async function () {
            const resp = await request(app)
                .patch(`/teachers/testteacher`).send({
                    full_name: 84,
                    _token: token
                });

            expect(resp.status).toEqual(400);

        });

    });
    describe("patch teachers/:username/add_student", function () {
        test("can add student to teacher", async function () {
            await db.query("DELETE FROM students");
            let s = await Student.register(
                "teststudent",
                "123",
                "test student",
                "test@test.com"
            );

            const resp = await request(app)
                .patch(`/teachers/testteacher/add_student`).send({
                    student_username: "teststudent",
                    _token: token
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "student added"
            });
        });

        test("can remove student ", async function () {
            const resp = await request(app)
                .patch(`/teachers/testteacher/remove_student`).send({
                    student_username: "teststudent",
                    _token: token
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({ message: "student removed" });

        });
        test("canot add student if student already has teacher", async function () {
            await request(app)
                .patch(`/teachers/testteacher/add_student`).send({
                    student_username: "teststudent",
                    _token: token
                });
            const resp = await request(app)
                .patch(`/teachers/testteacher/add_student`).send({
                    student_username: "teststudent",
                    _token: token
                });

            expect(resp.status).toEqual(401);
        });
    });
    describe("get teachers/:username/students", function () {
        test("can get teacher's students", async function () {
            await db.query("DELETE FROM students");
            let s = await Student.register(
                "teststudent",
                "123",
                "test student",
                "test@test.com"
            );

            await request(app)
                .patch(`/teachers/testteacher/add_student`).send({
                    student_username: "teststudent",
                    _token: token
                });
            const resp = await (await request(app).get("/teachers/testteacher/students").send({ _token: token }));
            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                students: expect.any(Array)
            });
        });
    });
});

afterAll(async function () {
    await db.end();
});