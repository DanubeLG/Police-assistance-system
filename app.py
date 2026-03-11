import psycopg2
from psycopg2.extras import RealDictCursor

from flask import Flask, request, jsonify, render_template
from flask import render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db():
    db_url =r"postgresql://root:gpJyxnlfoUCX9RorIolq0khn7phiJerT@dpg-d6nqo49aae7s738jok60-a/miniproject_dp02"
    conn = psycopg2.connect(db_url)
    return conn


@app.route("/users", methods=["GET"])
def get_users():

    db = get_db()
    cursor = db.cursor(cursor_factory=RealDictCursor)

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
    cursor = db.cursor(cursor_factory=RealDictCursor)

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


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/profile1")
def check():
    return render_template("profile1.html")


@app.route("/chatbot(1)")
def check1():
    return render_template("chatbot(1).html")


if __name__ == "__main__":
    app.run(debug=True)
