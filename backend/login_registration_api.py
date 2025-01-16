import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.database import Database

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000/*"}})

db = Database()

# Login Registration Endpoints
@app.route('/api/user/register', methods = ['PUT'])
def register_account():
    data = request.get_json()

    if find_email(data.get('email')):
        return jsonify({'error': 'There is already an account with the same pesel.'}), 409
    
    hash_password = password_hashing(data.get('password'))
    
    db.add_user(data.get('email'), data.get('name'), hash_password)
    return jsonify({'message': 'Account created.'}), 201
    
def find_email(email = str):
    account = db.check_if_email_has_account(email)
    if account:
        return True
    else:
        return False
    
@app.route('/api/user/login', methods = ['POST'])
def login_account():
    data = request.get_json()

    if find_email(data.get('email')) == False:
        return jsonify({'error': 'Account with this email dose not exist.'}), 409

    result = db.fetch_user_password(data.get('email'))
    
    if result:
        hashed_password = result[0]
        
        if bcrypt.checkpw(data.get('password').encode('utf-8'), hashed_password.encode('utf-8')):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
    
def password_hashing(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


# Transactions Endpoints
@app.route('/api/user/<user_email>/transaction', methods = ['PUT'])
def add_transaction(user_email):
    data = request.get_json()

    db.add_transaction(data.get('amount'), data.get('category'), data.get('storeName'), data.get('date'), user_email)
    return jsonify({'message': 'Transaction Added.'}), 201

@app.route('/api/user/<user_email>/transaction', methods = ['GET'])
def get_transactions(user_email):
    transactions = db.get_transactions_by_user(user_email)

    if not transactions:
        return jsonify({'message': 'No transactions found for this user.'}), 404
    
    result = []
    for transaction in transactions:
        result.append({
            'id': transaction[0],
            'amount': transaction[1],
            'category': transaction[2],
            'description': transaction[3],
            'date': transaction[4],
            'user_id': transaction[5]
        })
    
    return jsonify(result), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
