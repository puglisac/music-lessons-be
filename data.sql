

CREATE TABLE teachers
(
    username text PRIMARY KEY,
    password text NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE
);
CREATE TABLE students
(
    username text PRIMARY KEY,
    password text NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    teacher_username text REFERENCES teachers (username) ON DELETE SET NULL
);

CREATE TABLE lessons
(
    id serial PRIMARY KEY,
    date timestamptz NOT NULL,
    teacher_username text REFERENCES teachers (username) ON DELETE CASCADE,
    student_username text REFERENCES students (username) ON DELETE CASCADE 
);

CREATE TABLE notes
(
    id serial PRIMARY KEY, 
    lesson_id integer REFERENCES lessons (id) ON DELETE CASCADE,
    note text NOT NULL
);

CREATE TABLE homework
(
    id serial PRIMARY KEY, 
    lesson_id integer REFERENCES lessons (id) ON DELETE CASCADE,
    assignment text NOT NULL, 
    completed boolean NOT NULL
);
