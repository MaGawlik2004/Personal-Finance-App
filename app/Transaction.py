class Transaction:
    def __init__(self, transaction_id, name, type, amount, currency, date):
        self.transaction_id = transaction_id
        self.name = name
        self.type = type
        self.amount = amount
        self.currency = currency
        self.date = date

    def __repr__(self):
        return f"Transaction(id={self.transaction_id}, name={self.name}, amount={self.amount}, currency={self.currency})"
