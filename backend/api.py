import bcrypt
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import send_file
from flask import send_from_directory
from backend.database import Database
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000/*"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000", logger=True, engineio_logger=True)

db = Database()

logging.basicConfig(
    filename = "backend.log",
    level = logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# Login Registration Endpoints
@app.route('/api/user/register', methods = ['PUT'])
def register_account():
    data = request.get_json()
    logging.info(f"PUT request from the address {request.remote_addr}")

    if find_email(data.get('email')):
        logging.error(f'Error during user registration: There is already an account with the same pesel.')
        return jsonify({'error': 'There is already an account with the same pesel.'}), 409
    
    hash_password = password_hashing(data.get('password'))
    
    db.add_user(data.get('email'), data.get('name'), hash_password)
    socketio.emit('registration_status', {'status': 'success', 'message': 'Account created.'}, to=None)
    socketio.emit('test_event', {'message': 'Test Message'})
    logging.info(f'User registration with email {data.get('email')} was successful.')
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

    logging.info(f"POST request from the address {request.client.host}")

    if find_email(data.get('email')) == False:
        socketio.emit('login_status',{'status': 'error', 'message': 'Account with this email does not exist.'})
        logging.error(f'Error during user login: Account with this email does not exist.')
        return jsonify({'error': 'Account with this email dose not exist.'}), 409

    result = db.fetch_user_password(data.get('email'))
    
    if result:
        hashed_password = result[0]
        
        if bcrypt.checkpw(data.get('password').encode('utf-8'), hashed_password.encode('utf-8')):
            socketio.emit('login_status', {'status': 'success', 'message': 'Login successful'})
            logging.info(f'User login with email {data.get('email')} was successful.')
            return jsonify({'message': 'Login successful'}), 200
        else:
            socketio.emit('login_status', {'status': 'error', 'message': 'Invalid email or password'})
            logging.error(f'Error during user login: Invalid email or password')
            return jsonify({'error': 'Invalid email or password'}), 401
    else:
        socketio.emit('login_status', {'status': 'error', 'message': 'Invalid email or password'})
        logging.error(f'Error during user login: Invalid email or password')
        return jsonify({'error': 'Invalid email or password'}), 401
    
def password_hashing(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


# Transactions Endpoints
@app.route('/api/user/<user_email>/transaction', methods = ['PUT'])
def add_transaction(user_email):
    data = request.get_json()

    logging.info(f"PUT request from the address {request.client.host}")

    db.add_transaction(data.get('amount'), data.get('category'), data.get('description'), data.get('date'), user_email)
    socketio.emit('add_transaction_status', {'status': 'success', 'message': 'Transaction added successfuly.'})
    logging.info(f"User {user_email} Adding Transaktion {data.get('description')}: Transaction added successfuly.")
    return jsonify({'message': 'Transaction Added.'}), 201

@app.route('/api/user/<user_email>/transaction', methods = ['GET'])
def get_transactions(user_email):
    transactions = db.get_transactions_by_user(user_email)

    logging.info(f"GET request from the address {request.client.host}")

    if not transactions:
        logging.error(f'Error during fetchin transactions from user {user_email}: No transactions found for this user.')
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
    
    logging.info(f'Fetchin user{user_email} Transactions: was successful.')
    return jsonify(result), 200

@app.route('/api/user/<user_email>/transaction/<transaction_id>', methods = ['DELETE'])
def delete_transaction(user_email, transaction_id):
    transaction = db.get_transaction_by_id(transaction_id, user_email)

    logging.info(f"DELETE request from the address {request.client.host}")

    if not transaction:
        logging.error(f'Error during deleteing user {user_email} transaction {transaction_id}: Transaction not found or does not belong to the user.')
        return jsonify({'error': 'Transaction not found or does not belong to the user.'}), 404
    
    db.delete_transaction(transaction_id, user_email)
    socketio.emit('delete_transaction_status', {'status': 'success', 'message': 'Transaction deleted successfuly.'})
    logging.info(f'Deleteing user {user_email} transaction {transaction_id}: Transaction deleted successfully.')
    return jsonify({'message': 'Transaction deleted successfully.'}), 200

@app.route('/api/user/<user_email>/transaction/<transaction_id>', methods = ['GET'])
def get_transaction_by_id(user_email, transaction_id):
    transaction = db.get_transaction_by_id(transaction_id, user_email)

    logging.info(f"GET request from the address {request.client.host}")

    if transaction:
        logging.info(f'Getting transaction {transaction_id} from user {user_email}: Success')
        return jsonify(transaction), 200
    else:
        logging.error(f'Error during getting transaction {transaction_id} from user {user_email}: Transaction not found')
        return jsonify({'error': 'Transaction not found'}), 404

@app.route('/api/user/<user_email>/transaction/<transaction_id>', methods = ['PUT'])
def update_transaction(user_email, transaction_id):
    data = request.get_json()
    logging.info(f"PUT request from the address {request.client.host}")
    db.update_transaction(transaction_id, data.get('amount'), data.get('category'), data.get('description'), data.get('date'), user_email)
    socketio.emit('update_transaction_status', {'status': 'success', 'message': 'Transaction updated successfuly.'})
    logging.info(f'Updateing transaction {transaction_id} from user {user_email}: Transaction updated')
    return jsonify({'message': 'Transaction updated'}), 200

@app.route('/api/user/<user_email>/transaction/category/<category>', methods = ['GET'])
def get_amount_for_category(user_email, category):
    logging.info(f"GET request from the address {request.client.host}")
    amount = db.get_amounts_from_transactions(user_email, category)
    logging.info(f'Get amount for category {category} from user {user_email}: Success')
    return jsonify({"totalAmount": amount}), 200

@app.route('/api/user/<user_email>/transaction/category', methods = ['GET'])
def get_amount_from_all_transaction_except_revenue(user_email):
    logging.info(f"GET request from the address {request.client.host}")
    amount = db.get_amount_from_all_transaction_except_revenue(user_email)
    logging.info(f'Get amount for all transaction except revenue from user {user_email}: Success')
    return jsonify({'totalAmount': amount}), 200

@app.route('/api/raport/<user_email>', methods = ['GET'])
def get_raport(user_email):
    logging.info(f"GET request from the address {request.client.host}")
    try:
        pdf_filename = get_pdf(user_email)

        if not os.path.exists(pdf_filename):
            logging.error(f'Error durign getting raport for user {user_email}: File {pdf_filename} was not found.')
            return jsonify({'error': f'File {pdf_filename} was not found.'}), 404

        file_url = f"http://localhost:8000/reports/{os.path.basename(pdf_filename)}"
        logging.info(f'Getting report for user {user_email}: Success')
        return jsonify({'file_url': file_url}), 200

    except FileNotFoundError as e:
        logging.error(f'Error: {str(e)}')
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        logging.error(f'An error occurred.: {str(e)}')
        return jsonify({'error': f'An error occurred.: {str(e)}'}), 500
    
def get_pdf(user_email):
    output_dir = os.path.abspath('./reports')
    os.makedirs(output_dir, exist_ok=True) 
    pdf_filename = os.path.join(output_dir, f'Use_Raport_{user_email}.pdf')
    pdf = canvas.Canvas(pdf_filename, pagesize=letter)
    width, height = letter

    income_amount = db.get_amounts_from_transactions(user_email, 'Revenue')
    expences_amount = db.get_amount_from_all_transaction_except_revenue(user_email)
    balance = income_amount - expences_amount

    pdf.setFont("Helvetica", 12)
    pdf.drawString(100, height - 100, f'Income: {income_amount}')
    pdf.drawString(100, height - 120, f'Expences: {expences_amount}')
    pdf.drawString(100, height - 140, f'Balance: {balance}')

    pdf.line(100, height - 150, 400, height - 150)

    category_list = ['Maintenance', 'Clothes', 'Education', 'Hobby', 'Cosmetics', 'Children', 'Pets', 'Home', 'Insurance', 'Transport', 'Health', 'Vacation']
    category_amount = []
    for category in category_list:
        amount = db.get_amounts_from_transactions(user_email, category)
        category_amount.append({
            'category': category,
            'amount': amount
        })
    
    data = [('Category', 'Amount'),
            (f"{category_amount[0].get('category')}", f"{category_amount[0].get('amount')}"),
            (f"{category_amount[1].get('category')}", f"{category_amount[1].get('amount')}"),
            (f"{category_amount[2].get('category')}", f"{category_amount[2].get('amount')}"),
            (f"{category_amount[3].get('category')}", f"{category_amount[3].get('amount')}"),
            (f"{category_amount[4].get('category')}", f"{category_amount[4].get('amount')}"),
            (f"{category_amount[5].get('category')}", f"{category_amount[5].get('amount')}"),
            (f"{category_amount[6].get('category')}", f"{category_amount[6].get('amount')}"),
            (f"{category_amount[7].get('category')}", f"{category_amount[7].get('amount')}"),
            (f"{category_amount[8].get('category')}", f"{category_amount[8].get('amount')}"),
            (f"{category_amount[9].get('category')}", f"{category_amount[9].get('amount')}"),
            (f"{category_amount[10].get('category')}", f"{category_amount[10].get('amount')}"),
            (f"{category_amount[11].get('category')}", f"{category_amount[11].get('amount')}")
            ]
    
    x_start = 100
    y_start = height - 170
    for row in data:
        for i, item in enumerate(row):
            pdf.drawString(x_start + i * 100, y_start, item)
        y_start -= 20

    pdf.save()

    return pdf_filename

from flask import send_from_directory

@app.route('/reports/<filename>', methods=['GET'])
def serve_report(filename):
    logging.info(f"GET request from the address {request.client.host}")
    reports_dir = os.path.abspath('./reports')
    logging.info(f'Serving Report {filename}: Success')
    return send_from_directory(reports_dir, filename)

if __name__ == "__main__":
     socketio.run(app, host='0.0.0.0', port=8000, debug=True)
