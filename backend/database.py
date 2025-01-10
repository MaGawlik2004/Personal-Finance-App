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
                       amount INTEGER NOT NULL,
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
    
    def add_transaction(self, amount = str, category = str, description = str, date = str, user_id = str):
        cursor = self.connection.cursor()
        cursor.execute("INSERT INTO Transactions (amount, category, description, date, user_id) VALUES (?, ?, ?, ?, ?)", (amount, category, description, date, user_id))
        self.connection.commit()
        print(f'Zapisano transakcje do bazy danych.')
    
    def fetch_user_password(self, email = str):
        cursor = self.connection.cursor()
        cursor.execute('SELECT password FROM User WHERE email = ?', (email,))
        result = cursor.fetchall()
        return result[0] if result else None

    def fetch_user_(self, user_id = str):
        cursor = self.connection.cursor()
        cursor.execute('SELECT ')
        return cursor.fetchall()
    
    def check_if_email_has_account(self, email = str) -> bool:
        cursor = self.connection.cursor()
        cursor.execute('SELECT email FROM User WHERE email = ?', (email,))
        result = cursor.fetchall()
        return result[0] if result else None


if __name__ == "__main__":
    db = Database()
    print("Utworzono bazę danych i tabele.")
