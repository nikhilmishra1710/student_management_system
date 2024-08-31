from flask import Blueprint, request, jsonify
from ..models import Database
from ..utils import generate_token, verify_token

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/check', methods=['GET'])
def check():
    return jsonify({'message': 'Server is running'}), 200


@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email').strip(" ")
        password = data.get('password').strip(" ")

        db = Database()
        user = db.fetch_one(
            "SELECT * FROM Users WHERE email=%s AND password=%s", (email, password))
        
        print(user)
        if user:
            
            token = generate_token(user[0])
            user_role = db.fetch_one("SELECT * FROM user_roles WHERE role_id=%s", (user[6],))
            print(user_role)
            db.close()
            return jsonify({'token': token , 'role': user_role[1],'name': user[1]+" "+user[2] }), 200
        else:
            db.close()
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'Login failed'}), 500

@bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        fname = data.get('fname').strip()
        sname = data.get('sname').strip()
        email = data.get('email').strip()
        phone = data.get('phone').strip()
        password = data.get('password').strip()
        role = data.get('type').strip()

        db = Database()

        role_data = db.fetch_one(
            "SELECT * FROM user_roles where typename=%s", (role,))
        role_id = role_data[0]
        db.execute_query("INSERT INTO Users (first_name, last_name, email, phone, password, role_id) VALUES (%s, %s, %s, %s, %s, %s)", (fname, sname, email, phone, password, role_id))
        db.close()
        
        return jsonify({'message': 'User created'}), 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'User creation failed'}), 500


@bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200


@bp.route('/verify', methods=['GET'])
def verify():
    token = request.headers.get('Authorization')
    if token:
        if token.startswith('Bearer '):
            token = token[7:]
        else:
            return jsonify({'message': 'Token is invalid'}), 401
        user_id = verify_token(token)
        if user_id:
            return jsonify({'message': 'Token is valid'}), 200
        else:
            return jsonify({'message': 'Token is invalid'}), 401

    else:
        return jsonify({'message': 'Token is invalid'}), 401
