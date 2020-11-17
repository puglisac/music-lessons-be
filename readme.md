## Music Lessons

This is a RESTful API created for private music teachers.  Teachers and students can create an account and keep track of lessons.  Teachers can add lessons with notes and homework assignments that the students can see.

## Endpoints

### Lessons

- **GET lessons/:teacher_username/:student_username**  
returns all lessons for a teacher and student

```
/lessons/teacher/student
 body: {"_token": token}

```

**search** If the query string parameter is passed, a filtered list of lessons matching the date requested is returned.

```
/lessons/teacher/student/?search=05/09/2020
body: {
	"search":"05/09/2020"
	"_token": token
}
```

- **POST /lessons/:teacher_username/:student_username**  
create a new lesson for a teacher and student.

```
/lessons/teacher/student
 body: {"_token": teacherToken} 
```

- **GET /lessons/:teacher_username/:student_username/:id**  
  Return a single lesson found by its id.

```
/lessons/teacher/student/1
body: {"_token": token}

```

- **PATCH /lessons/:teacher_username/:student_username/:id**  
  Update an existing lesson and return the updated lesson.

```
/lessons/teacher/student/1
 body: {
		"date":"2012-04-21T18:25:43-05:00",
		"_token": teacherToken
		}
```

- **DELETE /lessons/:teacher_username/:student_username/:id**  
  Remove an existing lesson and return a message.

```
/lessons/teacher/student/1
 body: {"_token": teacherToken}
```

### Homework

- **GET homework/:teacher_username/:student_username/:lesson_id**  
returns all homework for a lesson

```
/homework/teacher/student/1
 body: {"_token": token}

```

- **POST /homework/:teacher_username/:student_username/:lesson_id**  
creates new homework for a lesson.

```
/homework/teacher/student/1
 body: {
 		"assignment":"homework assignment",
 		"_token": teacherToken
 		} 
```

- **GET /homework/:teacher_username/:student_username/:lesson_id/:id**  
  Return a single homework found by its id.

```
/lessons/teacher/student/1/1
body: {"_token": token}

```

- **PATCH /homework/:teacher_username/:student_username/:lesson_id/:id**  
  Update an existing homework and return the updated lesson.

```
/lessons/teacher/student/1
 body: {
		"assignment":"new assignment text",
		"_token": teacherToken
		}
```

- **DELETE /homework/:teacher_username/:student_username/:lesson_id/:id**  
  Remove an existing homework and return a message.

```
/lessons/teacher/student/1/1
 body: {"_token": teacherToken}
```

### Notes

- **GET notes/:teacher_username/:student_username/:lesson_id**  
returns all notes for a lesson

```
/notes/teacher/student/1
 body: {"_token": token}

```

- **POST /notes/:teacher_username/:student_username/:lesson_id**  
creates new note for a lesson.

```
/notes/teacher/student/1
 body: {
 		"note":"note text",
 		"_token": teacherToken
 		} 
```

- **GET /notes/:teacher_username/:student_username/:lesson_id/:id**  
  Return a single note found by its id.

```
/notes/teacher/student/1/1
body: {"_token": token}

```

- **PATCH /notes/:teacher_username/:student_username/:lesson_id/:id**  
  Update an existing note and return the updated lesson.

```
/notes/teacher/student/1
 body: {
		"note":"new note text",
		"_token": teacherToken
		}
```

- **DELETE /notes/:teacher_username/:student_username/:lesson_id/:id**  
  Remove an existing note and return a message.

```
/notes/teacher/student/1/1
 body: {"_token": teacherToken}
```


### Students

- **POST /students/signup**  
  Create a new student and return a JWT which includes the username.

```
/students/signup
body: {
		"username": "student",
		"password": "password", 
		"full_name": "Full Name",
		"email": "email@email.com"
		}
```

- **POST /login**  
  Authenticate a student and return a JSON Web Token which contains a payload with the username.

```
/students/login
body: {
		"username": "student",
  		"password": "password"
  		}
```

- **GET /students/:username**  
  Return the username, full_name, email and teacher_username of a student.

```
/students/student
body: {"_token": token}
```

- **PATCH /students/:username**  
  Update an existing student and return the updated studnet excluding the password.

```
/students/student
body: {
		"full_name": "new name",
       "email": "test.user@email.com",
		"teacher_username": "teacher",
		"_token": token
		}
```

- **DELETE /students/:username**  
  Remove an existing student and return a message.

```
/students/student
body: {"_token": token}
```

### Teachers

- **POST /teachers/signup**  
  Create a new teacher and return a JWT which includes the username.

```
/teachers/signup
body: {
		"username": "teacher",
		"password": "password", 
		"full_name": "Full Name",
		"email": "email@email.com"
		}
```

- **POST /teachers/login**  
  Authenticate a teacher and return a JSON Web Token which contains a payload with the username.

```
/teachers/login
body: {
		"username": "teacher",
  		"password": "password"
  		}
```

- **GET /teachers/:username**  
  Return the username, full_name, email and teacher_username of a teacher.

```
/teachers/teacher
body: {"_token": token}
```

- **PATCH /teachers/:username**  
  Update an existing teacher and return the updated teacher excluding the password.

```
/teachers/teacher
body: {
		"full_name": "new name",
       "email": "test.user@email.com",
		"teacher_username": "teacher",
		"_token": token
		}
```

- **DELETE /teachers/:username**  
  Remove an existing teacher and return a message.

```
/teachers/:username
body: {"_token": token}
```
- **PATCH /teachers/:username/add_student**  
  Add an existing student to the teacher.  Updates the "teacher_username" column of the student.

```
/teachers/teacher/add_student
body: {
		"student_username": "student",
		"_token": token
		}
```

- **PATCH /teachers/:username/remove_student**  
  Remove an existing student from the teacher.  Updates the "teacher_username" column of the student.

```
/teachers/teacher/remove_student
body: {
		"student_username": "student",
		"_token": token
		}
```

## Installation
To install, follow these steps:

Via Downloading from GitHub:

Download this repository onto your machine by clicking the "Clone or Download" button or Fork the repo into your own Github account
Download and extract the zip file to a directory of your choice.  

Via command line:

`$ git clone https://github.com/puglisac/music-lessons-be.git`  

Install dependencies

`npm install`  

[Install PostgreSQL](https://www.postgresql.org/download/) if you do not have it.

Create and setup a database and test database
```
$ createdb music-lessons
$ psql music-lessons < data.sql
$ createdb music-lessons-test
$ psql music-lessons-test < data.sql
```
Start the server on port 5000:

```
$ node server.js
```

## Running Tests

From the command line:

`npm test`

### Tokens

All routes except the login and signup routes require a valid JWT.

The following routes require the token to be from a teacher:

- POST /lessons/:teacher_username/:student_username/
- PATCH /lessons/:teacher_username/:student_username/:id
- DELETE /lessons/:teacher_username/:student_username/:id
- POST /homewok/:teacher_username/:student_username/:lesson_id
- DELETE /lessons/:teacher_username/:student_username/:lesson_id/:id
- POST /notes/:teacher_username/:student_username/:lesson_id
- PATCH /notes/:teacher_username/:student_username/:lesson_id/:id
- DELETE /notes/:teacher_username/:student_username/lesson_id/:id

## Built Using

- NodeJS - backend
- ExpressJS - framework
- PostgreSQL - database
- Node-pg - connecting to database
- JSONSchema - API validation
- Jest/Supertest - testing
- Bcrypt - password hashing
- Jsonwebtoken - JWT authentication
