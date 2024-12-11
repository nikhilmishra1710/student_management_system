-- DROP DATABASE IF EXISTS student_management_system2;
-- CREATE DATABASE student_management_system2;
-- USE student_management_system2;

-- CREATE TABLE user_roles(
--     role_id INT PRIMARY KEY AUTO_INCREMENT,
--     typename VARCHAR(50),
--     description VARCHAR(100)
-- );

-- INSERT INTO user_roles(typename,description) VALUES
-- ("STUDENT","basic level user"),
-- ("INSTRUCTOR","medium level user"),
-- ("SUPER_ADMIN","high level user");

-- CREATE TABLE users(
--     user_id INT AUTO_INCREMENT PRIMARY KEY,
--     first_name VARCHAR(30),
--     last_name VARCHAR(30),
--     email VARCHAR(50) UNIQUE,
--     phone VARCHAR(10),
--     password VARCHAR(75),
--     role_id INT,
--     FOREIGN KEY (role_id) REFERENCES user_roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- CREATE TABLE departments(
--     dept_id INT PRIMARY KEY AUTO_INCREMENT,
--     name VARCHAR(25),
--     hod INT
-- );

-- CREATE TABLE students(
--     student_id INT PRIMARY KEY AUTO_INCREMENT,
--     user_id INT,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- CREATE TABLE instructors(
--     instructor_id INT PRIMARY KEY AUTO_INCREMENT,
--     department_id INT,
--     user_id INT,
--     FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE SET NULL ON UPDATE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- CREATE TABLE courses(
--     course_id INT PRIMARY KEY AUTO_INCREMENT,
--     name VARCHAR(50),
--     description VARCHAR(100),
--     credits INT,
--     department_id INT,
--     instructor_id INT,
--     FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE CASCADE ON UPDATE CASCADE,
--     FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id) ON DELETE SET NULL ON UPDATE CASCADE
-- );

-- CREATE TABLE exams(
--     exam_id INT PRIMARY KEY AUTO_INCREMENT,
--     date DATE,
--     type VARCHAR(30),
--     time VARCHAR(30),
--     course_id INT,
--     FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- CREATE TABLE enrollments(
--     enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
--     student_id INT,
--     course_id INT,
--     enrollment_date DATE,
--     FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
--     FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- CREATE TABLE marks(
--     mark_id INT PRIMARY KEY AUTO_INCREMENT,
--     student_id INT,
--     score DOUBLE,
--     exam_id INT,
--     FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE,
--     FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- ALTER TABLE departments
-- ADD CONSTRAINT fk_hod
-- FOREIGN KEY (hod)
-- REFERENCES instructors(instructor_id)
-- ON DELETE CASCADE ON UPDATE CASCADE;

-- -- Load data back into each table from CSV files
-- -- LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/user_roles.csv' INTO TABLE user_roles FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
-- LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/users.csv' INTO TABLE users FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
-- LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/students.csv' INTO TABLE students FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
-- insert into departments(name) values
-- ('Computer Science'),
-- ('Mathematics'),
-- ('Physics'),
-- ('Mathematics');
-- LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/instructors.csv' INTO TABLE instructors FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
-- LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/courses.csv' INTO TABLE courses FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
-- LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/exams.csv' INTO TABLE exams FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
-- LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/enrollments.csv' INTO TABLE enrollments FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
-- LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/marks.csv' INTO TABLE marks FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';

-- CREATE TABLE permissions (
--     permission_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(50) NOT NULL UNIQUE,
--     description VARCHAR(100)
-- );

-- INSERT INTO permissions (name, description) VALUES
-- ('VIEW_STUDENTS', 'Permission to view students'),
-- ('VIEW_INSTRUCTORS','Permission to view instructors'),
-- ('VIEW_COURSES', 'Permission to view courses'),
-- ('VIEW_DEPARTMENTS', 'Permission to view departments'),
-- ("VIEW_ADMIN_GROUPS",'Permission to view admin groups'),
-- ("UPDATE_STUDENTS","Permission to update students records"),
-- ("UPDATE_INSTRUCTORS","Permission to update instructors"),
-- ("UPDATE_COURSES","Permission to update courses data"),
-- ("UPDATE_DEPARTMENTS","Permission to update departments data"),
-- ("UPDATE_ADMIN_GROUPS","PPeermission to update admin_groups"),
-- ('ADD_STUDENTS', 'Permission to add new students'),
-- ('ADD_INSTRUCTORS', 'Permission to add new instructors'),
-- ('ADD_COURSES', 'Permission to add new courses'),
-- ('ADD_DEPARTMENTS', 'Permission to add new departments'),
-- ('ADD_ADMIN_GROUPS', 'Permission to add new admin groups'),
-- ('DELETE_STUDENTS', 'Permission to delete students'),
-- ('DELETE_INSTRUCTORS', 'Permission to delete instructors'),
-- ('DELETE_COURSES', 'Permission to delete courses'),
-- ('DELETE_DEPARTMENTS', 'Permission to delete departments'),
-- ('DELETE_ADMIN_GROUPS', 'Permission to delete admin groups'),
-- ("FULL_ACCESS",'Permission to edit super admin group and access to all data');

-- CREATE TABLE role_permissions (
--     role_permission_id INT AUTO_INCREMENT PRIMARY KEY,
--     role_id INT,
--     permission_id INT,
--     FOREIGN KEY (role_id) REFERENCES user_roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE,
--     FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE ON UPDATE CASCADE,
--     UNIQUE (role_id, permission_id)
-- );

-- INSERT INTO role_permissions(role_id,permission_id) VALUES
-- (3,21);

SELECT name FROM permissions JOIN role_permissions ON role_permissions.permission_id = permissions.permission_id WHERE role_permissions.role_id = 4;