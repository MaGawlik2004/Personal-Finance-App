import sqlite3

class Database:
    def __init__(self, db_name = 'FinMate.db'):
        self.db_name = db_name
        self.connection = sqlite3.connect(self.db_name, check_same_thread=False)
        self.create_tables()
    
    def create_tables(self):
        cursor = self.connection.cursor()

        cursor.execute('''CREATE TABLE IF NOT EXISTS User(
                       email STRING PRIMARY KEY,
                       name STRING NOT NULL,
                       password STRING NOT NULL
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS Transactions(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       amount NUMERIC NOT NULL,
                       category STRING NOT NULL,
                       description STRING NOT NULL,
                       date TEXT NOT NULL,
                       user_id STRING NOT NULL,
                       FOREIGN KEY(user_id) REFERENCES User(email)
                    )''')
        self.connection.commit()

    def add_user(self, email = str, name = str, password = str):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO User (email, name, password) VALUES(?, ?, ?)", (email, name, password))
        self.connection.commit()
        print(f'Zarejestrowano uytkownika {name} do bazy danych.')
    
    def add_transaction(self, amount, category = str, description = str, date = str, user_id = str):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO Transactions (amount, category, description, date, user_id) VALUES (?, ?, ?, ?, ?)", (amount, category, description, date, user_id))
        self.connection.commit()
        print(f'Zapisano transakcje do bazy danych.')

    def update_transaction(self, transaction_id, amount, category = str, description = str, date = str, user_id = str):
        cursor = self.connection.cursor()
        cursor.execute("UPDATE Transactions SET amount = ?, category = ?, description = ?, date = ? WHERE user_id = ? AND id = ?", (amount, category, description, date, user_id, transaction_id))
        self.connection.commit()
        print(f'Zmodyfikowano transakcje {transaction_id}.')
        
    def fetch_user_password(self, email = str):
        cursor = self.connection.cursor()
        cursor.execute('SELECT password FROM User WHERE email = ?', (email,))
        result = cursor.fetchall()
        return result[0] if result else None

    def get_transactions_by_user(self, user_id = str):
        cursor = self.connection.cursor()
        cursor.execute("SELECT * FROM Transactions WHERE user_id = ?", (user_id,))
        transactions = cursor.fetchall()
        return transactions
    
    def check_if_email_has_account(self, email = str) -> bool:
        cursor = self.connection.cursor()
        cursor.execute('SELECT email FROM User WHERE email = ?', (email,))
        result = cursor.fetchall()
        return result[0] if result else None
    
    def get_transaction_by_id(self, transaction_id, email):
        cursor = self.connection.cursor()
        cursor.execute('SELECT * FROM Transactions WHERE user_id = ? AND id = ?', (email, transaction_id))
        result = cursor.fetchall()
        if not result:
            return None  # Zwróć None, jeśli nie znaleziono transakcji
        
        # Upewnij się, że indeksy odpowiadają poprawnym danym z bazy danych
        transaction = {
            'id': result[0][0],  # Zakładając, że ID jest pierwszym polem w tabeli
            'amount': result[0][1],
            'category': result[0][2],
            'description': result[0][3],
            'date': result[0][4],
        }
        
        return transaction
    
    def get_amounts_from_transactions(self, email, category):
        cursor = self.connection.cursor()
        cursor.execute('SELECT amount FROM Transactions WHERE user_id = ? AND category = ?', (email, category))
        result = cursor.fetchall()
        if not result:
            return 0  # Zwróć 0, jeśli nie znaleziono transakcji
        sum = 0
        for row in result:
            sum += row[0]  # row[0] to wartość kwoty z transakcji
        return sum
    
    def delete_transaction(self, transaction_id, email):
        cursor = self.connection.cursor()
        cursor.execute('DELETE FROM Transactions WHERE user_id = ? AND id = ?', (email, transaction_id))
        self.connection.commit()


if __name__ == "__main__":
    db = Database()
    print("Utworzono bazę danych i tabele.")
