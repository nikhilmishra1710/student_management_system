import mysql.connector
from .config import Config

class Database:
    def __init__(self):
        print("host",Config.MYSQL_HOST,
            "user",Config.MYSQL_USER,
            "password",Config.MYSQL_PASSWORD,
            "database",Config.MYSQL_DB)
        self.conn = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DB
        )
        self.cursor = self.conn.cursor()
        print('Database connection established')

    def execute_query(self, query, params=None):
        self.cursor.execute(query, params)
        self.conn.commit()
        return self.cursor.rowcount

    def fetch_all(self, query, params=None):
        self.cursor.execute(query, params)
        return self.cursor.fetchall()

    def fetch_one(self, query, params=None):
        self.cursor.execute(query, params)
        return self.cursor.fetchone()

    def close(self):
        self.cursor.close()
        self.conn.close()

# Define specific functions for CRUD operations here
