from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="root123",
        database="users"
    )

@app.route("/users", methods=["GET"])
def get_users():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT uid, post, password FROM users ORDER BY post")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    uid = data.get("uid")
    password = data.get("password")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE uid=%s AND password=%s",
        (uid, password)
    )
    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user:
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "fail"})

if __name__ == "__main__":
    app.run(debug=True)

