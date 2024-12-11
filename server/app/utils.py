import datetime
from .config import Config
from jwt import ExpiredSignatureError, InvalidTokenError, decode, encode

def format_date(date):
    return date.strftime('%Y-%m-%d')

def generate_token(user_id):
    return encode({'user_id': user_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, Config.SECRET_KEY, algorithm='HS256')


def verify_token(token):
    try:
        return decode(token, Config.SECRET_KEY, algorithms=['HS256'])
    except ExpiredSignatureError:
        return None
    except InvalidTokenError:
        return None
