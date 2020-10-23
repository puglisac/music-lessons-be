/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const Teacher = require("../models/teacher");
/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
    try {
        const token = req.body._token || req.query._token;
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = payload; // create a current user
        return next();
    } catch (err) {
        return next();
    }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
    if (!req.user) {
        return next({ status: 401, message: "Unauthorized" });
    } else {
        return next();
    }
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
    try {
        if (req.user.username === req.params.username) {
            return next();
        } else {
            return next({ status: 401, message: "Unauthorized" });
        }
    } catch (err) {
        // errors would happen here if we made a request and req.user is undefined
        return next({ status: 401, message: "Unauthorized" });
    }
}
function ensureTeacherOrStudent(req, res, next) {
    try {
        if (req.user.username === req.params.teacher_username || req.user.username === req.params.student_username) {
            return next();
        } else {
            return next({ status: 401, message: "Unauthorized" });
        }
    } catch (err) {
        // errors would happen here if we made a request and req.user is undefined
        return next({ status: 401, message: "Unauthorized" });
    }
}
async function ensureTeacher(req, res, next) {
    try {
        console.log("*******", req.params.username, req.user.username);
        if (req.user.username === req.params.teacher_username) {
            return next();
        } else {
            return next({ status: 401, message: "Unauthorized" });
        }
    } catch (err) {
        // errors would happen here if we made a request and req.user is undefined
        return next({ status: 401, message: "Unauthorized" });
    }
}

/** Middleware: Requires user to be admin. */
// async function ensureAdmin(req, res, next) {
//     try {
//         const u = await User.get(req.user.username);
//         if (u.is_admin) {
//             return next();
//         } else {
//             return next({ status: 401, message: "Unauthorized" });
//         }
//     } catch (err) {
//         // errors would happen here if we made a request and req.user is undefined
//         return next({ status: 401, message: "Unauthorized" });
//     }
// }
// end

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUser,
    ensureTeacherOrStudent,
    ensureTeacher
};