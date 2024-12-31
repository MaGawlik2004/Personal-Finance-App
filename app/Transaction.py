class Transaction:
    def __init__(self,transaction_id, name, typ, ammount, currency, date):
        self.transaction_id = transaction_id
        self.name = name
        self.typ = typ
        self.ammount = ammount
        self.currency = currency
        self.date = date