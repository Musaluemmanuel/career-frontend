# CareerPath AI

CareerPath AI is a student-focused career and education guidance app. Students can
explore interests, ask questions about courses and study options, and request
recommendations with or without sharing grades.

The app is split into two independently versioned projects:

- `frntend/` - static web interface, served from `index.html`.
- `backend/` - Flask API for accounts, chat, recommendations, and reports.

## Features

- Account registration, email verification, sign-in, and Google sign-in.
- Conversational career exploration and optional interest discovery.
- Course and institution recommendations with optional grades and study-level
  preferences.
- Optional PDF, image, and video attachments in chat.
- Saved conversations in the browser and generated reports.
- Responsive interface with a dark navy accent theme.

See the [User Guide](USER_GUIDE.md) for instructions on using the app.

## Run locally

### Backend

Use Python 3.10 or later. From the backend directory:

```powershell
cd ..\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Create a `.env` file in `backend/` and add the credentials for the services you
intend to use:

```dotenv
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
MAIL_USERNAME=your_email_address
MAIL_PASSWORD=your_email_app_password
# Optional; defaults to a local SQLite database.
DATABASE_URL=sqlite:///local_test.db
```

The Groq key enables text chat and recommendations. The Gemini key enables
attachment analysis. Mail credentials are needed for email verification and
other email features. Keep `.env` private and never commit real credentials.

Start the API:

```powershell
python app.py
```

The development server listens on port `5001` by default. `DATABASE_URL` can be
set to a PostgreSQL connection string for a configured database.

### Frontend

In a second terminal, from the frontend directory:

```powershell
python -m http.server 8765
```

Open <http://127.0.0.1:8765/> in a browser. The frontend currently has its API
base URL set in `index.html` and `login.html` to the hosted CareerPath AI
service. To use a local backend instead, update both `API_URL` constants to
`http://127.0.0.1:5001`.

The frontend loads Bootstrap, Font Awesome, Google Fonts, and other browser
libraries from external CDNs, so those resources require an internet connection.

## Tests

The backend tests use Python's built-in `unittest` runner. From the backend
directory:

```powershell
python -m unittest discover -s tests -v
```

The tests cover chat and recommendation behavior, optional grades, and course
catalogue discovery and verification.

## Deployment notes

The frontend is static HTML and can be served by a static hosting provider. The
backend must run as a separate Flask service and be configured with the
credentials for the features it provides. Configure production secrets in the
hosting provider's environment settings, not in source files or committed
configuration.

## Project layout

```text
frntend/
  index.html       Main dashboard and chat
  login.html       Sign-in, registration, and verification
  reports.html     Saved reports view
  README.md        Project setup and developer notes
  USER_GUIDE.md    Student-facing usage instructions
../backend/
  app.py           Flask API
  utils/           AI, database, and course discovery helpers
  tests/           Backend unit tests
```
