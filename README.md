# CareerPath AI

CareerPath AI is a student-focused career and education guidance app. Students can
explore interests, ask questions about courses and study options, and request
recommendations with or without sharing grades.

The app is split into two independently versioned projects:

- `frntend/` - static web interface, served from `index.html`.
- `backend/` - Django API for accounts, chat, recommendations, and reports.

## Features

- Account registration, email verification, sign-in, and Google sign-in.
- Conversational career exploration and optional interest discovery.
- Course and institution recommendations with optional grades and study-level
  preferences.
- Optional PDF, image, and video attachments in chat.
- Saved conversations in the browser and generated reports.
- Responsive interface with a blue-and-green accent theme.

See the [User Guide](USER_GUIDE.md) for instructions on using the app.

## Run locally

### Backend

Use Python 3.10 or later. From the frontend project directory, move into
`backend/`:

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

Apply database migrations and start the Django API:

```powershell
python manage.py migrate
python manage.py runserver 0.0.0.0:5001
```

The development server listens on port `5001`. `DATABASE_URL` can be set to a
PostgreSQL connection string; SQLite is used by default. On an existing
deployment, the startup command uses Django's `--fake-initial` option to adopt
the existing `user` and `student_log` tables without recreating them.

Set `DJANGO_SECRET_KEY` to a private, randomly generated value in production.
The backend runs Django through Gunicorn using `careerpath.wsgi:application`.

### Frontend

In a second terminal, from the frontend directory:

```powershell
python -m http.server 8765
```

Open <http://127.0.0.1:8765/> in a browser. The frontend currently has its API
base URL set in `index.html`, `login.html`, and `reports.html` to the hosted
CareerPath AI service. To use a local backend instead, update each `API_URL` to
`http://127.0.0.1:5001`.

The frontend loads Bootstrap, Font Awesome, Google Fonts, and other browser
libraries from external CDNs, so those resources require an internet connection.

## Branding assets

The official CareerPath AI image is stored in
[`icons/careerpath-logo.png`](icons/careerpath-logo.png). Login, dashboard,
chat, reports, manifest, favicon, and Apple touch-icon references use this
asset. When replacing the image, update all PWA icon sizes and increment the
service-worker `CACHE_NAME` so browsers invalidate the previous cached logo.

## Tests

The backend tests use Python's built-in `unittest` runner. From the backend
directory:

```powershell
python manage.py test
python -m unittest discover -s tests -v
```

The Django tests cover API requests, account flows, image upload validation,
and CORS. The `unittest` suite covers AI chat and recommendation behavior,
optional grades, and course catalogue discovery and verification.

## Deployment notes

The frontend is static HTML and can be served by a static hosting provider. The
backend must run as a separate Django service and be configured with the
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
  manage.py        Django management commands
  careerpath/      Django settings and WSGI entry point
  api/             Django models, routes, and tests
  app.py           Previous Flask implementation, retained during migration
  utils/           AI, database, and course discovery helpers
  tests/           Backend unit tests
```
