DROP DATABASE IF EXISTS student_management_system;
CREATE DATABASE student_management_system;
USE student_management_system;
CREATE TABLE user_roles(
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    typename VARCHAR(10),
    description VARCHAR(30)
);
CREATE TABLE users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(50) UNIQUE,
    phone VARCHAR(10),
    password VARCHAR(75),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);
CREATE TABLE departments(
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25),
    hod INT
);
CREATE TABLE students(
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE instructors(
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT,
    user_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
ALTER TABLE departments
ADD CONSTRAINT fk_hod FOREIGN KEY (hod) REFERENCES instructors(instructor_id);
CREATE TABLE courses(
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    description VARCHAR(100),
    credits INT,
    department_id INT,
    instructor_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
);
CREATE TABLE exams(
    exam_id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE,
    type VARCHAR(30),
    time VARCHAR(30),
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
CREATE TABLE enrollments(
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
CREATE TABLE marks(
    mark_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    score DOUBLE,
    exam_id INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id)
);
INSERT INTO user_roles(typename, description)
VALUES ("STUDENT", "basic level user"),
    ("INSTRUCTOR", "medium level user"),
    ("ADMIN", "high level user");
INSERT INTO users (
        first_name,
        last_name,
        email,
        phone,
        password,
        role_id
    )
VALUES (
        'Alice',
        'Doe',
        'alice.doe@example.com',
        '1234567890',
        'password1',
        1
    ),
    -- Student
    (
        'Bob',
        'Smith',
        'bob.smith@example.com',
        '0987654321',
        'password2',
        2
    ),
    -- Instructor
    (
        'Charlie',
        'Brown',
        'charlie.brown@example.com',
        '1122334455',
        'password3',
        2
    ),
    -- Instructor
    (
        'Diana',
        'Ross',
        'diana.ross@example.com',
        '5566778899',
        'password4',
        2
    ),
    -- Instructor
    (
        'Eve',
        'Taylor',
        'eve.taylor@example.com',
        '3344556677',
        'password5',
        3
    ),
    -- Admin
    (
        'John',
        'Doe',
        'john.doe@example.com',
        '1122334455',
        'password6',
        1
    );
-- student
INSERT INTO departments (name)
VALUES ('Computer Science'),
    ('Mathematics'),
    ('Physics');
INSERT INTO instructors (department_id, user_id)
VALUES (1, 2),
    (2, 3),
    (3, 4);
INSERT INTO courses (
        name,
        description,
        credits,
        department_id,
        instructor_id
    )
VALUES (
        'Introduction to Programming',
        'Learn the basics of programming',
        3,
        1,
        1
    ),
    (
        'Calculus I',
        'Learn the basics of calculus',
        3,
        2,
        2
    ),
    (
        'Physics I',
        'Learn the basics of physics',
        3,
        3,
        3
    ),
    (
        'Physics II',
        'Learn more about physics after physics-I',
        4,
        3,
        3
    );
UPDATE departments
SET hod = 1
WHERE dept_id = 1;
UPDATE departments
SET hod = 2
WHERE dept_id = 2;
UPDATE departments
SET hod = 3
WHERE dept_id = 3;
INSERT INTO students(user_id)
VALUES (1),
(6);
INSERT INTO enrollments(student_id, course_id, enrollment_date)
VALUES (1, 1, "2024-08-18"),
    (1, 3, "2024-08-18"),
    (2, 1, "2024-08-11");
INSERT INTO exams(date, course_id, time, type)
VALUES("2024-08-17", 1, "09:00AM - 10:00AM", "Quiz"),
    ("2024-08-25", 1, "01:00PM - 04:00PM", "MidSem-1"),
    ("2024-08-27", 2, "12:00PM - 03:00PM", "MideSem-1"),
    ("2024-08-26", 3, "11:00AM - 02:00PM", "MideSem-1");
INSERT INTO marks(student_id, score, exam_id)
VALUES(1, 10.0, 1);
SELECT *
FROM students;
SELECT enrollments.enrollment_id,
    courses.course_id,
    courses.name,
    courses.description,
    courses.credits,
    departments.name,
    users.first_name,
    users.last_name
FROM enrollments
    JOIN courses ON enrollments.course_id = courses.course_id
    JOIN departments ON courses.department_id = departments.dept_id
    JOIN instructors ON courses.instructor_id = instructors.instructor_id
    JOIN users ON instructors.user_id = users.user_id
WHERE student_id = 1;
SELECT exams.exam_id,
    courses.name,
    exams.date,
    exams.time,
    exams.type
FROM exams
    JOIN courses ON exams.course_id = courses.course_id
    JOIN enrollments ON exams.course_id = enrollments.course_id
WHERE enrollments.student_id = 1
    AND exams.date > "2021-05-01";
SELECT *
from marks;