class TransactionRegistry:
    def __init__(self):
        self.transactions = []

    def add_transaction(self,transaction):
        self.transactions.append(transaction)

    def find_transaction_by_id(self, id):
        for transaction in self.transactions:
            if transaction['transaction_id'] == id:
                return transaction
        return None
    
    def remove_transaction(self, id):
        transaction = self.find_transaction_by_id(id)
        if transaction:
            self.transactions.remove(transaction)
            return True
        else:
            return False
        
    def count_registry(self):
        return len(self.transactions)
    
    def clear_registry(self):
        self.transactions.clear()