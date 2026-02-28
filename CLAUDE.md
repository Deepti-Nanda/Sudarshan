Project name: Sanjeevni
What: Emergency hospital finder app
Team: Sudarshan
Hackathon problem: Health, Life and Human Safety

Stack:
- Frontend: HTML CSS Vanilla JS
- Backend: Node.js Express
- Database: MongoDB Mongoose
- Maps: Google Maps JS API
- SMS: Twilio
- Theme: Dark navy #080C1A, Red accent #FF2D2D
- Fonts: Syne for headings, DM Sans for body

Folder structure:
- frontend/index.html is the main user app
- frontend/hospital-admin.html is the hospital dashboard
- backend/server.js is the entry point
- backend/routes/hospitals.js has the scoring algorithm
- backend/routes/notify.js handles SMS alerts
- backend/routes/admin.js handles hospital status updates
- backend/models/Hospital.js is the MongoDB schema
- backend/data/seed.js has mock data

Rules Claude must follow:
- Never change the color scheme
- Always keep mobile responsive
- Never crash the UI on errors, show toast messages instead
- Demo must always work without API keys using mock fallback data
- Always give complete updated files not partial snippets