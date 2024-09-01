from flask import Blueprint, request, jsonify
from ..models import Database
from ..utils import generate_token, verify_token
import datetime

adminBp = Blueprint('admin', __name__, url_prefix='/api/admin')

@adminBp.route('/check', methods=['GET'])
def check():
    return jsonify({'message': 'Server is running'}), 200


@adminBp.route('/fetchStudents', methods=['GET'])
def getStudents():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
    
        students = db.fetch_all("""SELECT users.user_id, students.student_id, users.first_name, users.last_name ,users.email FROM students
                                JOIN users ON users.user_id = students.user_id 
                                ;""")
        db.close()
        return jsonify({'students': students}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get subjects'}), 500

@adminBp.route('/fetchInstructors', methods=['GET'])
def getInstructors():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        
        teachers = db.fetch_all("""SELECT users.user_id, instructors.instructor_id, users.first_name, users.last_name, users.email FROM instructors

JOIN users ON instructors.user_id=users.user_id
;""")
        db.close()
        return jsonify({'teachers': teachers}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get grades'}), 500

@adminBp.route('/fetchSubjects', methods=['GET'])
def getSubjects():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        subjects = db.fetch_all("""SELECT courses.course_id, courses.name, courses.description, instructors.instructor_id, users.first_name, users.last_name, courses.credits, departments.dept_id, departments.name FROM courses
LEFT JOIN departments ON courses.department_id=departments.dept_id
LEFT JOIN instructors ON courses.instructor_id=instructors.instructor_id
LEFT JOIN users ON instructors.user_id=users.user_id
;""")
        print(subjects,"\n\n")
        db.close()
        return jsonify({'subjects': subjects}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get subjects'}), 500

@adminBp.route('/updateRoll', methods=['POST'])
def unenroll():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        first_name = request.json['first_name']
        last_name = request.json['last_name']
        email = request.json['email']
        user_id = request.json['user_id']
        db = Database()
        db.execute_query("""UPDATE users 
                         SET first_name=%s, last_name=%s, email=%s
                         WHERE user_id=%s;""",
                         (first_name, last_name, email, user_id))
        db.close()
        return jsonify({'message': 'Unenrolled successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to unenroll'}), 500

@adminBp.route('/updateInst', methods=['POST'])
def updateInst():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        first_name = request.json['first_name']
        last_name = request.json['last_name']
        email = request.json['email']
        user_id = request.json['user_id']
        db = Database()
        db.execute_query("""UPDATE users 
                         SET first_name=%s, last_name=%s, email=%s
                         WHERE user_id=%s;""",
                         (first_name, last_name, email, user_id))
        db.close()
        return jsonify({'message': 'Unenrolled successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to unenroll'}), 500

@adminBp.route('/addSubject', methods=['POST'])
def addSubject():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        name = request.json['name']
        description = request.json['description']
        deptId = request.json['deptId']
        credits = request.json['credits']
        exists = db.fetch_one("SELECT * FROM departments WHERE dept_id=%s;", (deptId,))
        if not exists:
            return jsonify({'message': 'Department does not exist'}), 400
        db.execute_query("INSERT INTO courses (name,description,department_id,credits) VALUES (%s,%s,%s,%s);",
                         (name, description,deptId, credits))
        db.close()
        return jsonify({'message': 'Subject added successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add subject'}), 500

@adminBp.route('/updateSubject', methods=['POST'])
def updateSubject():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        course_id = request.json['subjectId']
        name = request.json['name'].strip()
        description = request.json['description'].strip()
        instructor_id = request.json['instructorId']
        dept_id = request.json['deptId']
        exists = db.fetch_one("SELECT * FROM instructors WHERE instructor_id=%s;", (instructor_id,))
        credits = request.json['credits']
        if not exists and (instructor_id == '' or instructor_id == 'null' or instructor_id == 'undefined' or instructor_id == None or instructor_id.isnumeric() == False):
            instructor_id = None
        if not db.fetch_one("SELECT * FROM departments WHERE dept_id=%s;", (dept_id,)):
            dept_id = None
        db.execute_query("UPDATE courses SET name=%s,description=%s,instructor_id=%s,credits=%s,department_id=%s WHERE course_id=%s;",
                         (name, description, instructor_id, credits,dept_id, course_id))
       
        db.close()
        return jsonify({'message': 'Subject updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to update subject'}), 500

@adminBp.route('/fetchDepartments', methods=['GET'])
def getDepartments():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        departments = db.fetch_all("""SELECT departments.dept_id, departments.name, departments.hod, users.first_name, users.last_name FROM departments
                                   LEFT JOIN instructors ON departments.hod=instructors.instructor_id
                                   LEFT JOIN users ON instructors.user_id=users.user_id
                                   ;""")
        db.close()
        return jsonify({'departments': departments}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get departments'}), 500
    
@adminBp.route('/addDepartment', methods=['POST'])
def addDepartment():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        name = request.json['name']
        hod = request.json['hodId']
        exists = db.fetch_one("SELECT * FROM instructors WHERE instructor_id=%s;", (hod,))
        if not exists:
            hod = None
        db.execute_query("INSERT INTO departments (name,hod) VALUES (%s,%s);",
                         (name, hod))
        db.close()
        return jsonify({'message': 'Department added successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add department'}), 500
    
@adminBp.route('/updateDepartment', methods=['POST'])
def updateDepartment():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        dept_id = request.json['deptId']
        name = request.json['name']
        hod = request.json['hodId']
        exists = db.fetch_one("SELECT * FROM instructors WHERE instructor_id=%s;", (hod,))
        if not exists:
            hod = None
        db.execute_query("UPDATE departments SET name=%s,hod=%s WHERE dept_id=%s;",
                         (name, hod, dept_id))
        db.close()
        return jsonify({'message': 'Department updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to update department'}), 500