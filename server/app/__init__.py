from flask import Flask
from .config import Config
from .routes import auth

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.register_blueprint(auth.bp)

    return app
