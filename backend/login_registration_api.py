import bcrypt
from flask import Flask, request, jsonify
from backend.database import Database

app = Flask(__name__)

db = Database()
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
    
@app.route('/api/user/register', methods = ['GET'])
def login_account():
    pass
    
def password_hashing(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

if __name__ == "__main__":
    app.run(debug=True)