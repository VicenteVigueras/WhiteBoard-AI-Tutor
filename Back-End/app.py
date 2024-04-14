from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/api_check")
def api_check():
    return jsonify({"success": "API Running"})