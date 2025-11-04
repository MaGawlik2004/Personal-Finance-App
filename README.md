# Personal-Finance-App - Aplikacja do Zarządzania Finansami Osobistymi (Protokoły Sieci Web)

Aplikacja typu **zarządzanie finansami osobistymi** stworzona przez [MaGawlik2004](https://github.com/MaGawlik2004).  
Projekt pozwala na śledzenie przychodów i wydatków, tworzenie budżetu i analizę finansów w sposób przejrzysty i intuicyjny.

---

## Opis projektu

**Personal-Finance-App** to aplikacja, która umożliwia użytkownikowi rejestrowanie i kategoryzowanie swoich przychodów i wydatków, przeglądanie raportów oraz podejmowanie świadomych decyzji finansowych.  
Celem projektu było stworzenie prostego, ale funkcjonalnego narzędzia finansowego — możliwie szybkie uruchomienie, łatwa obsługa i rozbudowa w przyszłości.

---

## Funkcjonalności

- Rejestrowanie przychodów i wydatków z możliwością kategoryzacji  
- Przeglądanie historii i sumarycznych danych (np. miesięczne zestawienia)  
- Dodawanie i edytowanie pozycji finansowych  
- Prosty interfejs użytkownika — łatwa obsługa w przeglądarce  
- Generowanie raportu pdf z wykresem wydatków

---

## Technologie

| Warstwa       | Technologia / narzędzie |
|----------------|--------------------------|
| Frontend       | Next.js, JavaScript, CSS |
| Backend        | Flask, Python |
| Baza danych    | SQLite, PostgreSQL |
| Inne           | REST API |

---

## Użyte języki

![Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=MaGawlik2004&repo=Personal-Finance-App&layout=compact&theme=radical)

---

## Instalacja i uruchomienie

### 1️⃣ Klonowanie repozytorium
```bash
git clone https://github.com/MaGawlik2004/Personal-Finance-App.git
cd Personal-Finance-App
```

### 2️⃣ Uruchomienie backendu (jeśli istnieje)
```bash
cd backend
python api.py
```

### 3️⃣ Uruchomienie frontendu
```bash
cd frontend
npm install
npm start
```
Aplikacja powinna być dostępna pod adresem:
```
http://localhost:3000
```

---

## Struktura katalogów

```
Personal-Finance-App/
│
├── backend/            # Serwer, API, logika operacji finansowych
├── frontend/           # Interfejs użytkownika (JS + CSS)
├── database/           # Pliki bazy danych / migracje (jeśli używane)
├── README.md           # Ten plik 
```

---


## 🙌 Autor

Projekt stworzony przez **[MaGawlik2004](https://github.com/MaGawlik2004)**  
Repozytorium: [Personal-Finance-App](https://github.com/MaGawlik2004/Personal-Finance-App)  
