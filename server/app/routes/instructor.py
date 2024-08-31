from flask import Blueprint, request, jsonify
from ..models import Database
from ..utils import generate_token, verify_token
import datetime

instructorBp = Blueprint('instructor', __name__, url_prefix='/api/instructor')


@instructorBp.route('/check', methods=['GET'])
def check():
    return jsonify({'message': 'Server is running'}), 200


@instructorBp.route('/fetchSubject', methods=['GET'])
def getSubjects():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        inst_id = db.fetch_one(
            "SELECT * FROM instructors WHERE user_id=%s", (verified_token['user_id'],))[0]
        subjects = db.fetch_all("""SELECT courses.course_id, courses.name, courses.credits, departments.name FROM courses
                                JOIN departments ON courses.department_id = departments.dept_id 
                                WHERE courses.instructor_id = %s;""", (inst_id,))
        db.close()
        return jsonify({'subjects': subjects}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get subjects'}), 500


@instructorBp.route('/fetchStudents', methods=['POST'])
def getStudents():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        course_id = request.json['subject']
        students = db.fetch_all("""SELECT students.student_id, courses.course_id, users.first_name, users.last_name, users.email, enrollments.enrollment_id FROM enrollments
JOIN courses ON enrollments.course_id=courses.course_id
JOIN students ON enrollments.student_id=students.student_id
JOIN users ON students.user_id=users.user_id
WHERE enrollments.course_id=%s
ORDER BY students.student_id;""", (course_id,))
        db.close()
        return jsonify({'students': students}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get grades'}), 500


@instructorBp.route('/fetchExams', methods=['POST'])
def getExams():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        date = datetime.datetime.now().strftime('%Y-%m-%d')
        db = Database()
        course_id = request.json['subject']
        exams = db.fetch_all("""SELECT exams.exam_id, exams.date, exams.time, exams.type FROM exams
JOIN courses ON exams.course_id=courses.course_id
WHERE exams.course_id=%s AND exams.date > %s;""", (course_id, date))
        db.close()
        return jsonify({'exams': exams}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get exams'}), 500


@instructorBp.route('/fetchPastExams', methods=['POST'])
def getPastExams():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        date = datetime.datetime.now().strftime('%Y-%m-%d')
        db = Database()
        course_id = request.json['subject']
        exams = db.fetch_all("""SELECT exams.exam_id, exams.date, exams.time, exams.type FROM exams
JOIN courses ON exams.course_id=courses.course_id
WHERE courses.course_id=%s AND exams.date <= %s;""", (course_id, date))
        db.close()
        return jsonify({'pastexams': exams}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get past exams'}), 500


@instructorBp.route('/fetchPastExamScores', methods=['POST'])
def getPastExamScores():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        exam_id = request.json['examId']
        exams = db.fetch_all("""SELECT students.student_id, users.first_name, users.last_name, courses.name, exams.exam_id, exams.type, exams.date, marks.score
FROM enrollments
JOIN students ON enrollments.student_id = students.student_id
JOIN users ON students.user_id = users.user_id
JOIN courses ON enrollments.course_id = courses.course_id
LEFT JOIN exams ON courses.course_id = exams.course_id
LEFT JOIN marks ON exams.exam_id = marks.exam_id AND marks.student_id = students.student_id
WHERE 
     exams.exam_id = %s
     ORDER BY students.student_id;
""", (exam_id,))
        db.close()
        return jsonify({'scores': exams}), 200
    except Exception as e:

        return jsonify({'message': 'Failed to get past exams'}), 500


@instructorBp.route('/fetchPerf', methods=['POST'])
def getPerf():
    try:
        print(request.json)
        print(request.headers.get('Authorization'))
        token = request.headers.get('Authorization')[7:]
        subject_id = request.json['subject']
        verified_token = verify_token(token)
        print(verified_token, subject_id)
        db = Database()
        student_id = db.fetch_one(
            "SELECT * FROM students WHERE user_id=%s", (verified_token['user_id'],))[0]
        print("student_id", student_id)

        print("subject_id", subject_id)
        perf = db.fetch_all("""SELECT exams.date, exams.time, marks.score FROM marks
JOIN exams ON marks.exam_id=exams.exam_id
WHERE marks.student_id=%s AND exams.course_id=%s;""", (student_id, subject_id))
        db.close()
        return jsonify({'perf': perf}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get performance'}), 500


@instructorBp.route('/fetchLeftSubjects', methods=['GET'])
def fetchLeftSubjects():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()

        subjects = db.fetch_all(
            """SELECT * FROM courses WHERE instructor_id IS NULL;""")
        db.close()
        print(subjects)
        return jsonify({'subjects': subjects}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get subjects'}), 500


@instructorBp.route('/enroll', methods=['POST'])
def enroll():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        student_id = db.fetch_one(
            "SELECT * FROM students WHERE user_id=%s", (verified_token['user_id'],))[0]
        print(request.json)
        course_id = request.json['subject']
        date = datetime.datetime.now().strftime('%Y-%m-%d')
        db.execute_query("INSERT INTO enrollments (student_id,course_id,enrollment_date) VALUES (%s,%s,%s);",
                         (student_id, course_id, date))
        db.close()
        return jsonify({'message': 'Enrolled successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to enroll'}), 500


@instructorBp.route('/unenroll', methods=['POST'])
def unenroll():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        enrollment_id = request.json['enrollmentId']
        db.execute_query("DELETE FROM enrollments WHERE enrollment_id=%s;",
                         (enrollment_id,))
        db.close()
        return jsonify({'message': 'Unenrolled successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to unenroll'}), 500


@instructorBp.route('/addExam', methods=['POST'])
def addExam():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        course_id = request.json['subject']
        date = request.json['date']
        time = request.json['time']
        typename = request.json['name']
        db.execute_query("INSERT INTO exams (course_id,date,time,type) VALUES (%s,%s,%s,%s);",
                         (course_id, date, time, typename))
        db.close()
        return jsonify({'message': 'Exam added successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add exam'}), 500


@instructorBp.route('/updateScore', methods=['POST'])
def updateMarks():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        print(request.json)
        db = Database()
        exam_id = request.json['examId']
        student_id = request.json['studentId']
        score = float(request.json['score'])

        print("exam id:", exam_id, student_id, score)

        data = db.fetch_one(
            "SELECT * FROM marks WHERE exam_id=%s AND student_id=%s;", (exam_id, student_id))
        print("data", data)
        if data is None:
            db.execute_query("INSERT INTO marks (exam_id,student_id,score) VALUES (%s,%s,%s);",
                             (exam_id, student_id, score))
            db.close()
            return jsonify({'message': 'Marks updated successfully'}), 200

        row = db.execute_query("UPDATE marks SET score=%s WHERE exam_id=%s AND student_id=%s;",
                               (score, exam_id, student_id))
        print("rows affected", row)
        db.close()
        return jsonify({'message': 'Marks updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to update marks'}), 500


@instructorBp.route('/addSubject', methods=['POST'])
def addSubject():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        course_id = request.json['subjectID']
        inst_id = db.fetch_one(
            "SELECT * FROM instructors WHERE user_id=%s", (verified_token['user_id'],))[0]
        db.execute_query("UPDATE courses SET instructor_id=%s WHERE course_id=%s;",
                         (inst_id, course_id))
        db.close()
        return jsonify({'message': 'Subject added successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add subject'}), 500


@instructorBp.route('/removeSubject', methods=['POST'])
def removeSubject():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        course_id = request.json['subjectId']
        db.execute_query("UPDATE courses SET instructor_id=NULL WHERE course_id=%s;",
                         (course_id,))
        db.close()
        return jsonify({'message': 'Subject removed successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to remove subject'}), 500


@instructorBp.route('/checkStudent', methods=['POST'])
def checkStudent():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        print(request.json)
        student_id = request.json['studentId']
        course_id = request.json['subjectId']
        data = db.fetch_one(
            "SELECT * FROM enrollments WHERE student_id=%s AND course_id=%s;", (student_id, course_id))
        print(data)
        if data:
            db.close()
            # return jsonify({'message': 'Student not enrolled'}), 200
            return jsonify({'enrolled': True, 'data': {'data': data, 'exists': True}}), 200
        else:
            exists = db.fetch_one(
                "SELECT * FROM students WHERE student_id=%s;", (student_id,))
            if not exists:
                db.close()
                return jsonify({'enrolled': False, 'data': {'exists': False, 'message': 'Student does not exist'}}), 200
            student_data = db.fetch_one("""SELECT student_id, users.first_name, users.last_name, users.email FROM students
                                        JOIN users ON students.user_id=users.user_id
                                        WHERE student_id=%s;""", (student_id,))
            db.close()
            return jsonify({'enrolled': False,  'data': {'data': student_data, 'exists': True}}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to check student'}), 500


@instructorBp.route('/addStudent', methods=['POST'])
def addStudent():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        student_id = request.json['studentId']
        course_id = request.json['subjectId']
        date = datetime.datetime.now().strftime('%Y-%m-%d')
        db.execute_query("INSERT INTO enrollments (student_id,course_id,enrollment_date) VALUES (%s,%s,%s);",
                         (student_id, course_id, date))
        db.close()
        return jsonify({'message': 'Student added successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to add student'}), 500

@instructorBp.route('/deleteExam', methods=['POST'])
def deleteExam():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        exam_id = request.json['examId']
        db.execute_query("DELETE FROM exams WHERE exam_id=%s;",
                         (exam_id,))
        db.close()
        return jsonify({'message': 'Exam deleted successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to delete exam'}), 500
    
@instructorBp.route('/updateExam', methods=['POST'])
def updateExam():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print("ve", verified_token)
        db = Database()
        print(request.json,"\n\n\n")
        exam_id = request.json['examId']
        date = request.json['date']
        time = request.json['time']
        typename = request.json['name']
        db.execute_query("UPDATE exams SET date=%s,time=%s,type=%s WHERE exam_id=%s;",
                         (date, time, typename, exam_id))
        db.close()
        return jsonify({'message': 'Exam updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to update exam'}), 500