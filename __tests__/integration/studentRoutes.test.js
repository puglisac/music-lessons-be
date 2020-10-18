const request = require("supertest");

const app = require("../../app");
const db = require("../../db");
const Teacher = require("../../models/teacher")
const Student = require ("../../models/student")

let token;
describe("student Routes Test", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM teachers");
        await db.query("DELETE FROM students")
        let s = await Student.register(
            "teststudent",
            "123",
            "test student",
            "test@test.com"
        );
        const res = await request(app).post("/students/login").send({
            username: "teststudent",
            password: "123"
        });
        token = res.body.token
    });


    describe("get students/:username", function() {
        test("can get student by username", async function() {
            const resp = await request(app)
                .get("/students/teststudent").send({_token: token})

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                student: {
                    username: "teststudent",
                    full_name: "test student",
                    email: "test@test.com",
                    teacher_username: null
                }
            });
        });
        test("return 404 if not found ", async function() {
            const resp = await request(app)
                .get("/students/notauser").send({_token: token})

            expect(resp.status).toEqual(404);
            expect(resp.body).toEqual({
                status: 404,
                message: `No such user: notauser`
            });
        });
    });

    describe("post /students/signup", function() {
        test("can create new student ", async function() {
            const resp = await request(app)
                .post("/students/signup").send({
                    username: "newstudent",
                    password: "password",
                    full_name: "new student",
                    email: "test.student@email.com"
                });

            expect(resp.status).toEqual(201);
            expect(resp.body).toEqual({
                token: expect.any(String)

            });
        });

        test("cannot create new student without correct info", async function() {
            const resp = await request(app)
                .post("/students/signup").send({
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
    describe("delete students/:username", function() {
        test("can delete a student ", async function() {
            const resp = await request(app)
                .delete(`/students/teststudent`).send({ "_token": token })

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                message: "student deleted"
            });
        });
        test("return 401 if not authorized ", async function() {
            const resp = await request(app)
                .delete("/students/notauser").send({ "_token": token })

            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            });
        });
    });
    describe("patch students/:username", function() {
        test("can update a student ", async function() {
            const resp = await request(app)
                .patch(`/students/teststudent`).send({
                    full_name: "new name",
                    _token: token
                });

            expect(resp.status).toEqual(200);
            expect(resp.body).toEqual({
                student: {
                    username: "teststudent",
                    full_name: "new name",
                    email: "test@test.com",
                    teacher_username: null
                }
            });
        });

        test("cannot update student without correct info", async function() {
            const resp = await request(app)
                .patch(`/students/teststudent`).send({
                    full_name: 84,
                    _token: token
                });

            expect(resp.status).toEqual(400);

        });
        test("return 401 if not authorized ", async function() {
            const resp = await request(app)
                .patch("/students/notauser").send({ "_token": token })

            expect(resp.status).toEqual(401);
            expect(resp.body).toEqual({
                status: 401,
                message: "Unauthorized"
            });
        });
    });
});

afterAll(async function() {
    await db.end();
});