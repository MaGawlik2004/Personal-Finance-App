from Transaction import Transaction

class TransactionRegistry:
    def __init__(self):
        self.transactions = {}

    def add_transaction(self, transaction):
        self.transactions[str(transaction.transaction_id)] = transaction

    def find_transaction_by_id(self, id):
        return self.transactions.get(str(id))

    def remove_transaction(self, id):
        transaction = self.find_transaction_by_id(id)
        if transaction:
            del self.transactions[str(id)]
            return True
        else:
            return None
        
    def count_registry(self):
        return len(self.transactions)

    def clear_registry(self):
        self.transactions.clear()