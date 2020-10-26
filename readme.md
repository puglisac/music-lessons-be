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


### Users

- **POST /users**  
  Create a new user and return a JWT which includes the username and whether or not the user is an admin.

```
/users
body: {"username": "user",
          "password": "password",
          "first_name": "user",
          "last_name": "name",
          "email": "test.user@email.com",
          "photo_url": "https://image",
          "is_admin": false}
```

- **POST /login**  
  Authenticate a user and return a JSON Web Token which contains a payload with the username and is_admin values.

```
/users
body: {"username": "newuser",
          "password": "password"}
```

- **GET /users**  
  Return the username, first_name, last_name and email of the user objects.

```
/users
```

- **GET /users/[username]**  
  Return all the fields for a user excluding the password and an array of job applications.

```
/users/username
```

- **PATCH /users/[username]**  
  Update an existing user and return the updated user excluding the password.

```
/users/username
body: {"first_name": "new",
          "last_name": "name",
          "email": "test.user@email.com",
          "photo_url": "https://newimage",
          "is_admin": true}
```

- **DELETE /users/[username]**  
  Remove an existing user and return a message.

```
/users/username
body: {"_token": token}
```

## Running Tests

From the command line:

`npm test`

### Tokens

The following routes need a valid JWT:

- GET /jobs
- GET /jobs/[id]
- POST /jobs/apply
- GET /companies
- GET /companies/[handle]
- PATCH /users/[username]
- DELETE /users/[username]

The following routes need a valid JWT AND the user must be an admin:

- POST /companies
- POST /jobs
- PATCH /jobs/apply
- PATCH /companies/[handle]
- DELETE /companies/[handle]
- PATCH /jobs/[id]
- DELETE /jobs/[id]

## Built Using

- NodeJS - backend
- ExpressJS - framework
- PostgreSQL - database
- Node-pg - connecting to database
- JSONSchema - API validation
- Jest/Supertest - testing
- Bcrypt - password hashing
- Jsonwebtoken - JWT authentication
