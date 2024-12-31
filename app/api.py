from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/transcations', methods=['POST'])
def create_transaction():
    data = request.get_json()
    print(f"Create transaction request: {data}")
    transaction = data
    return 

