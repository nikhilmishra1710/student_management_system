from flask import Blueprint, request, jsonify
from ..models import Database
from ..utils import generate_token,verify_token

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/check', methods=['GET'])
def check():
    return jsonify({'message': 'Server is running'}), 200

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    db = Database()
    user = db.fetch_one("SELECT * FROM Users WHERE username=%s AND password=%s", (username, password))
    db.close()

    if user:
        token = generate_token(user[0])
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role_id = data.get('role_id')

    db = Database()
    db.execute_query("INSERT INTO Users (username, password, role_id) VALUES (%s, %s, %s)", (username, password, role_id))
    db.close()

    return jsonify({'message': 'User created successfully'}), 201

@bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

@bp.route('/verify',methods=['GET'])
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