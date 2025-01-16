import sqlite3

# Połącz się z bazą danych
conn = sqlite3.connect('FinMate.db')
cursor = conn.cursor()

# Usuń wszystkie rekordy z tabeli
cursor.execute('DELETE FROM User')
cursor.execute('DELETE FROM Transactions')

# Zatwierdź zmiany
conn.commit()

# Zamknij połączenie
conn.close()