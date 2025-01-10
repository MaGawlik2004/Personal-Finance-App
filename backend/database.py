import sqlite3

class Database:
    def __init__(self, db_name = 'FinMate.db'):
        self.db_name = db_name
        self.connection = sqlite3.connect(self.db_name)
        self.create_tables()
    
    def create_tables(self):
        cursor = self.connection.cursor()

        cursor.execute('''CREATE TABLE IF NOT EXISTS User(
                       email STRING PRIMARY KEY,
                       name STRING NOT NULL,
                       password STRING NOT NULL,
                    )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS Transactions(
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       amount INTEGER NOT NULL,
                       category STRING NOT NULL,
                       description STRING NOT NULL,
                       date DATE
                    )''')
        self.connection.commit()

if __name__ == "__main__":
    db = Database()
    print("Utworzono bazę danych i tabele.")
