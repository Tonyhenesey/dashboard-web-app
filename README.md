📋 Wymagania

Aby uruchomić projekt, upewnij się, że masz zainstalowane:

Node.js

npm

🚀 Uruchamianie aplikacji

1️⃣ Backend

Otwórz terminal.

Przejdź do katalogu backend/:

cd backend/

npm isntall

Uruchom serwer backendu:

npm start

2️⃣ Frontend

Otwórz nową konsolę.

Przejdź do katalogu frontend/:

cd frontend/

npm install

Uruchom aplikację frontendową:

npm start

🔧 Konfiguracja zmiennych środowiskowych

Aby poprawnie uruchomić aplikację, utwórz plik .env w katalogu backend/ i uzupełnij go danymi zgodnie z poniższymi instrukcjami.

🔑 Konfiguracja GitHub OAuth

Aby uzyskać dane wymagane do logowania przez GitHub, wykonaj następujące kroki:

Wejdź na stronę GitHub Developer Settings.

Kliknij "New OAuth App".

Wypełnij formularz:

Application name – dowolna nazwa aplikacji.

Homepage URL – http://localhost:3000 (lub adres Twojej aplikacji).

Authorization callback URL – http://localhost:3000/auth/github/callback.

Po zapisaniu otrzymasz Client ID i Client Secret.

Dodaj te dane do pliku .env:

GITHUB_CLIENT_ID=twoj_client_id GITHUB_CLIENT_SECRET=twoj_client_secret GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

🌦 API Pogodowe – Dobrapogoda24 -

Aby uzyskać klucz API:

Zarejestruj się na stronie dostawcy API https://dobrapogoda24.pl/api-pogoda

Po zalogowaniu znajdź sekcję dotyczącą kluczy API.

Skopiuj wygenerowany klucz i dodaj do .env:

DOBRAPOGODA24_API_KEY=twoj_klucz_api

💰 API Walutowe – CurrencyFreaks

Aby uzyskać klucz API:

Zarejestruj się na https://currencyfreaks.com/.

Po zalogowaniu znajdź klucz API na swoim koncie.

Skopiuj go i dodaj do .env:

CURRENCYFREAKS_API_KEY=twoj_klucz_api

🔧 Ustawienia aplikacji

Upewnij się, że masz ustawiony numer portu w pliku .env:

PORT=3000

Jeśli używasz systemu kontroli wersji (np. Git), pamiętaj, aby dodać .env do .gitignore, aby nie udostępniać kluczy API publicznie.

🛠 Technologia

Projekt został zbudowany przy użyciu:

JavaScript (Node.js, Express, React)

npm - do zarządzania pakietami