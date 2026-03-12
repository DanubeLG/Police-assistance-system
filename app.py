import psycopg2

from flask import Flask, request, jsonify
from flask import render_template
from flask_cors import CORS
from flask_cors import cross_origin

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# ----------------------
# Load Local Model
# ----------------------
model_name = "TheBloke/gpt4all-lora-7b"  # or your local path
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Use GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

app = Flask(__name__)
CORS(app)

def ask_llm(prompt, max_tokens=200):
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_new_tokens=max_tokens)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)


def get_db():
    db_url="postgresql://root:gpJyxnlfoUCX9RorIolq0khn7phiJerT@dpg-d6nqo49aae7s738jok60-a.oregon-postgres.render.com/miniproject_dp02"
    conn=psycopg2.connect(db_url)
    return conn

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

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/profile1")
def check():
    return render_template("profile1.html")

@app.route("/chatbot1")
def check1():
    return render_template("chatbot1.html")

@app.route("/next-question", methods=["POST"])
def next_question():
    case_data = request.json
    prompt = f"""
You are an AI police assistant analyzing a case.

Current case data:
{case_data}

Suggest the next step, question to ask, or evidence to check.
Keep it concise.
"""
    response = ask_llm(prompt)
    return jsonify({"question": response})


if __name__ == "__main__":
    app.run(port=5000)


