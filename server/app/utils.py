import datetime
import jwt
from .config import Config

def format_date(date):
    return date.strftime('%Y-%m-%d')

def generate_token(user_id):
    return jwt.encode({'user_id': user_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, Config.SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        return jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None

# Other utility functions can be added here
