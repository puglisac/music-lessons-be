const db = require("../../db");
const Teacher = require("../../models/teacher");

describe("Test user class", function() {

    beforeEach(async function() {
        await db.query("DELETE FROM teachers");

        let t = await Teacher.register(
            "testing",
            "123",
            "test teacher",
            "test@test.com"
        );

    });
    test("can get teacher by username", async function() {
        let t = await Teacher.get("testing");

        expect(t).toEqual({
            "username": "testing",
            "full_name": "test teacher",
            "email": "test@test.com", 
            "students": expect.any(Array)
        });
    });

    test("can register a teacher", async function() {
        let t = await Teacher.register(
            "testteacher",
            "123",
            "test teacher2",
            "test2.user@test.com"
        );

        expect(t).toEqual({
            "username": "testteacher",
            "full_name": "test teacher2",
            "email": "test2.user@test.com"    
        });
    });


});
afterAll(async function() {
    await db.end();
});