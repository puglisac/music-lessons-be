const db = require("../../db");
const Student = require("../../models/student");

describe("Test student class", function() {

    beforeEach(async function() {
        await db.query("DELETE FROM students");

        let s = await Student.register(
            "testing",
            "123",
            "test student",
            "test@test.com"
        );

    });
    test("can get student by username", async function() {
        let s = await Student.get("testing");

        expect(s).toEqual({
            "username": "testing",
            "full_name": "test student",
            "email": "test@test.com", 
            "teacher_username": null
        });
    });

    test("can register a student", async function() {
        let s = await Student.register(
            "teststudent",
            "123",
            "test student2",
            "test2.user@test.com"
        );

        expect(s).toEqual({
            "username": "teststudent",
            "full_name": "test student2",
            "email": "test2.user@test.com"    
        });
    });


});
afterAll(async function() {
    await db.end();
});