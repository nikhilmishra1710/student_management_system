from flask import Blueprint, request, jsonify
from ..models import Database
from ..utils import generate_token, verify_token
import datetime

userBp = Blueprint('user', __name__, url_prefix='/api/user')


@userBp.route('/check', methods=['GET'])
def check():
    return jsonify({'message': 'Server is running'}), 200


@userBp.route('/fetchSubject', methods=['GET'])
def getSubjects():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        student_id = db.fetch_one(
            "SELECT * FROM students WHERE user_id=%s", (verified_token['user_id'],))[0]
        subjects = db.fetch_all("""SELECT enrollments.enrollment_id, courses.course_id, courses.name, courses.description, courses.credits, departments.name, users.first_name, users.last_name FROM enrollments 
JOIN courses ON enrollments.course_id=courses.course_id
JOIN departments ON courses.department_id=departments.dept_id
JOIN instructors ON courses.instructor_id=instructors.instructor_id
JOIN users ON instructors.user_id=users.user_id
WHERE student_id=%s;""", (student_id,))
        db.close()
        return jsonify({'subjects': subjects}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get subjects'}), 500

@userBp.route('/fetchGrades', methods=['GET'])
def getGrades():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        db = Database()
        student_id = db.fetch_one(
            "SELECT * FROM students WHERE user_id=%s", (verified_token['user_id'],))[0]
        grades = db.fetch_all("""SELECT enrollments.enrollment_id, courses.course_id, courses.name, courses.description, courses.credits, departments.name, users.first_name, users.last_name, grades.grade FROM enrollments
JOIN courses ON enrollments.course_id=courses.course_id
JOIN departments ON courses.department_id=departments.dept_id
JOIN instructors ON courses.instructor_id=instructors.instructor_id
JOIN users ON instructors.user_id=users.user_id
JOIN grades ON enrollments.enrollment_id=grades.enrollment_id
WHERE student_id=%s;""", (student_id,))
        db.close()
        return jsonify({'grades': grades}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get grades'}), 500
    
@userBp.route('/fetchExam', methods=['GET'])
def getExams():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        date = datetime.datetime.now().strftime('%Y-%m-%d')
        db = Database()
        student_id = db.fetch_one(
            "SELECT * FROM students WHERE user_id=%s", (verified_token['user_id'],))[0]
        exams = db.fetch_all("""SELECT exams.exam_id, courses.name, exams.date, exams.time, exams.type FROM exams
JOIN courses ON exams.course_id=courses.course_id
JOIN enrollments ON exams.course_id=enrollments.course_id
WHERE enrollments.student_id=%s AND exams.date > %s;""", (student_id,date))
        db.close()
        return jsonify({'exams': exams}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get exams'}), 500
    
@userBp.route('/fetchPastExam', methods=['GET'])
def getPastExams():
    try:
        token = request.headers.get('Authorization')[7:]
        verified_token = verify_token(token)
        print(verified_token)
        date = datetime.datetime.now().strftime('%Y-%m-%d')
        db = Database()
        student_id = db.fetch_one(
            "SELECT * FROM students WHERE user_id=%s", (verified_token['user_id'],))[0]
        exams = db.fetch_all("""SELECT exams.exam_id, courses.name, exams.date, exams.time, marks.score FROM exams
JOIN courses ON exams.course_id=courses.course_id
JOIN marks ON exams.exam_id=marks.exam_id
WHERE marks.student_id=%s AND exams.date <= %s;""", (student_id,date))
        db.close()
        return jsonify({'pastexams': exams}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get past exams'}), 500
    
@userBp.route('/fetchPerf',methods=['POST'])
def getPerf():
    try:
        print(request.json)
        print(request.headers.get('Authorization'))
        token = request.headers.get('Authorization')[7:]
        subject_id = request.json['subject']
        verified_token = verify_token(token)
        print(verified_token,subject_id)
        db = Database()
        student_id = db.fetch_one(
            "SELECT * FROM students WHERE user_id=%s", (verified_token['user_id'],))[0]
        print("student_id",student_id)
        
        print("subject_id",subject_id)
        perf = db.fetch_all("""SELECT exams.date, exams.time, marks.score FROM marks
JOIN exams ON marks.exam_id=exams.exam_id
WHERE marks.student_id=%s AND exams.course_id=%s;""", (student_id,subject_id))
        db.close()
        return jsonify({'perf': perf}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Failed to get performance'}), 500