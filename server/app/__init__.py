from flask import Flask
from flask_cors import CORS
from .config import Config
from .routes import auth,user,instructor

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
    app.config.from_object(Config)

    app.register_blueprint(instructor.instructorBp)
    app.register_blueprint(user.userBp)
    app.register_blueprint(auth.bp)

    return app
