from flask import Blueprint, request, jsonify
from ..models import Database
from ..utils import generate_token, verify_token
from functools import wraps

adminBp = Blueprint('admin', __name__, url_prefix='/api/admin')


def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                token = request.headers.get('Authorization')[7:]
                verified_token = verify_token(token)
                if not verified_token:
                    return jsonify({'message': 'Unauthorized access'}), 403
                # Fetch user role from the database
                print("verified token:",verified_token,"\n\n")
                db = Database()
                role_id = db.fetch_one("SELECT role_id FROM users WHERE user_id=%s",(verified_token["user_id"],))
                user_roles = db.fetch_all(
                    "SELECT name FROM permissions JOIN role_permissions ON role_permissions.permission_id = permissions.permission_id WHERE role_permissions.role_id = %s;",
                    (role_id[0],)
                )
                print(user_roles)
                db.close()
                if user_roles:
                    for user_role in user_roles:
                        print(user_role)
                        if any(item in user_role for item in required_role):
                            print("At least one item from the tuple is present in the list.")
                            return func(*args, **kwargs)    
                
                    print("No items from the tuple are present in the list.")
                    return jsonify({'message': 'Unauthorized access'}), 403
                else:
                    return jsonify({'message': 'Unauthorized access'}), 403
            except Exception as e:
                print(e)
                return jsonify({'message': 'Failed to authorize user'}), 403
        return wrapper
    return decorator

@adminBp.route('/check', methods=['GET'])
def check():
    return jsonify({'message': 'Server is running'}), 200


@adminBp.route('/fetchStudents', methods=['GET'])
@role_required(["FULL_ACCESS","VIEW_STUDENTS"])
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
@role_required(["FULL_ACCESS","VIEW_INSTRUCTORS"])
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
@role_required(["FULL_ACCESS","VIEW_COURSES"])
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
        print(subjects, "\n\n")
        db.close()
        return jsonify({'subjects': subjects}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get subjects'}), 500


@adminBp.route('/updateRoll', methods=['POST'])
@role_required(["FULL_ACCESS","UPDATE_STUDENTS"])
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
@role_required(["FULL_ACCESS","UPDATE_INSTRUCTORS"])
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
@role_required(["FULL_ACCESS","ADD_COURSES"])
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
        exists = db.fetch_one(
            "SELECT * FROM departments WHERE dept_id=%s;", (deptId,))
        if not exists:
            return jsonify({'message': 'Department does not exist'}), 400
        db.execute_query("INSERT INTO courses (name,description,department_id,credits) VALUES (%s,%s,%s,%s);",
                         (name, description, deptId, credits))
        db.close()
        return jsonify({'message': 'Subject added successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add subject'}), 500


@adminBp.route('/updateSubject', methods=['POST'])
@role_required(["FULL_ACCESS","UPDATE_COURSES"])
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
        exists = db.fetch_one(
            "SELECT * FROM instructors WHERE instructor_id=%s;", (instructor_id,))
        credits = request.json['credits']
        if not exists and (instructor_id == '' or instructor_id == 'null' or instructor_id == 'undefined' or instructor_id == None or instructor_id.isnumeric() == False):
            instructor_id = None
        if not db.fetch_one("SELECT * FROM departments WHERE dept_id=%s;", (dept_id,)):
            dept_id = None
        db.execute_query("UPDATE courses SET name=%s,description=%s,instructor_id=%s,credits=%s,department_id=%s WHERE course_id=%s;",
                         (name, description, instructor_id, credits, dept_id, course_id))

        db.close()
        return jsonify({'message': 'Subject updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to update subject'}), 500


@adminBp.route('/fetchDepartments', methods=['GET'])
@role_required(["FULL_ACCESS","VIEW_DEPARTMENTS"])
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
@role_required(["FULL_ACCESS","ADD_DEPARTMENTS"])
def addDepartment():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        name = request.json['name']
        hod = request.json['hodId']
        exists = db.fetch_one(
            "SELECT * FROM instructors WHERE instructor_id=%s;", (hod,))
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
@role_required(["FULL_ACCESS","UPDATE_DEPARTMENTS"])
def updateDepartment():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        dept_id = request.json['deptId']
        name = request.json['name']
        hod = request.json['hodId']
        exists = db.fetch_one(
            "SELECT * FROM instructors WHERE instructor_id=%s;", (hod,))
        if not exists:
            hod = None
        db.execute_query("UPDATE departments SET name=%s,hod=%s WHERE dept_id=%s;",
                         (name, hod, dept_id))
        db.close()
        return jsonify({'message': 'Department updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to update department'}), 500

@adminBp.route('/fetchAdminGroups',methods=["GET"])
@role_required(["FULL_ACCESS",])
def fetchAdminGroups():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        departments = db.fetch_all("""SELECT * FROM user_roles
                                   WHERE role_id NOT IN (1,2);""")
        db.close()
        print("departments:",departments)
        return jsonify({'adminGroups': departments}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get admin groups'}), 500
   
@adminBp.route('/addGroup',methods=["POST"])   
@role_required(["FULL_ACCESS",])
def addGroup():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        name=request.json["name"]
        description=request.json["description"]
        db = Database()
        db.execute_query("INSERT INTO user_roles (typename,description) VALUES (%s,%s);",(name,description))
        
        db.close()
        return jsonify({'message': 'Group added successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add group'}), 500
 
@adminBp.route('/fetchGroupPermissions',methods=["POST"])
@role_required(["FULL_ACCESS",])
def fetchGroupPermissions():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        groupId=request.json["groupId"]
        print(groupId)
        db = Database()
        permissions = db.fetch_all("""SELECT * FROM permissions JOIN role_permissions ON role_permissions.permission_id = permissions.permission_id WHERE role_permissions.role_id = %s;""",(groupId,))
        allPermissions = db.fetch_all("""SELECT * FROM permissions;""")
        db.close()
        print(permissions)
        return jsonify({'permission': permissions,'allPermissions':allPermissions}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get permissions'}), 500
    
@adminBp.route('/updateGroupPermissions',methods=["POST"])
@role_required(["FULL_ACCESS",])
def updateGroupPermissions():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        groupId=request.json["groupId"]
        permissions=request.json["permissions"]
        db = Database()
        db.execute_query("DELETE FROM role_permissions WHERE role_id=%s;",(groupId,))
        for permission in permissions:
            db.execute_query("INSERT INTO role_permissions (role_id,permission_id) VALUES (%s,%s);",(groupId,permission))
        db.close()
        return jsonify({'message': 'Permissions updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to update permissions'}), 500
    
@adminBp.route('/fetchGroupUsers',methods=["POST"])
@role_required(["FULL_ACCESS",])
def fetchGroupUsers():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        groupId=request.json["groupId"]
        db = Database()
        users = db.fetch_all("""SELECT * FROM users WHERE role_id=%s;""",(groupId,))
        db.close()
        return jsonify({'users': users}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get users'}), 500
    
@adminBp.route('/addGroupUsers',methods=["POST"])
@role_required(["FULL_ACCESS",])
def addGroupUsers():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        groupId=request.json["groupId"]
        userId=request.json["userId"]
        db = Database()
        isStudent = db.fetch_one("SELECT * FROM students WHERE user_id=%s;",(userId,))
        isTeacher = db.fetch_one("SELECT * FROM instructors WHERE user_id=%s;",(userId,))
        if  isStudent and  isTeacher:
            return jsonify({'message': 'User is a student or teacher'}), 400
        db.execute_query("UPDATE users SET role_id=%s WHERE user_id=%s;",(groupId,userId))
        db.close()
        return jsonify({'message': 'User added to group successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add user to group'}), 500