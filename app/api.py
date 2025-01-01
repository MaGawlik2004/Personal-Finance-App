from flask import Flask, request, jsonify
from Transaction import Transaction
from TransactionRegistry import TransactionRegistry

app = Flask(__name__)

transaction_registry = TransactionRegistry()

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    try:
        data = request.get_json()
        transaction = Transaction(
            data['transaction_id'],
            data['name'],
            data['type'],
            data['amount'],
            data['currency'],
            data['date']
        )
        transaction_registry.add_transaction(transaction)
        return jsonify({"message": "Transaction Created"}),201
    except KeyError as e:
        return jsonify({'error': f'Missing parametr: {str(e)}'}), 400
    
@app.route('/api/transactions/<transaction_id>', methods=['PATCH'])
def update_transaction(transaction_id):
    data = request.get_json()
    if not data:
        return jsonify ({'error': 'Invalid JSON data'}), 400
        
    transaction = transaction_registry.find_transaction_by_id(transaction_id)
    if not transaction:
        return jsonify ({'error': 'Transaction Not Found'}), 404
        
    if 'name' in data:
        transaction.name = data['name']
    if 'type' in data:
        transaction.type = data['type']
    if 'amount' in data:
        transaction.amount = data['amount']
    if 'currency' in data:
        transaction.currency = data['currency']
    if 'date' in data:
        transaction.date = data['date']
    return jsonify({'message': 'Transaction Updated'}), 200

@app.route('/api/transactions/<transaction_id>', methods=['GET'])
def get_transaction_by_id(transaction_id):
    transaction = transaction_registry.find_transaction_by_id(transaction_id)

    if not transaction:
        return jsonify({'error': 'Transaction Not Found'}), 404
    else:
        return jsonify({
            'transaction_id': transaction.transaction_id,
            'name': transaction.name,
            'type': transaction.type,
            'amount': transaction.amount,
            'currency': transaction.currency,
            'date': transaction.date
        }), 200


@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    delete = transaction_registry.remove_transaction(transaction_id)
    if delete:
        return jsonify({'message': 'Transaction Deleted'}), 200
    else:
        return jsonify({'error': 'Transaction Not Found'}), 404



if __name__ == "__main__":
    app.run(debug=True)
