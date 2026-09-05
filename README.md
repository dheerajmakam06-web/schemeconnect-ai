# SchemeConnect AI

SchemeConnect AI is an intelligent government-benefit discovery platform prototype. It helps citizens find relevant welfare schemes, understand support options, and open official application portals.

## Features

- First-time registration followed by phone/password login
- Password reset with demo OTP recovery
- Logout and session protection
- Multilingual interface: English, Hindi, Marathi, and Tamil
- Profile details for income, caste category, family size, occupation, and parent names
- PIN-protected profile editing
- Personalized scheme recommendations with search and filters
- Saved schemes and application tracking views
- Andhra Pradesh and Telangana scheme shortcuts
- Direct official links for fee reimbursement, Amma Vodi, ePASS, scholarships, hostels, MeeSeva, and other services
- Right-side SchemeGuide AI assistant
- Responsive desktop and mobile layout

## Run Locally

From the project directory:

```powershell
python -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

The application opens on the registration or login page. Returning users log in with the phone number and password saved on that browser.

## GitHub

Repository:

https://github.com/dheerajmakam06-web/schemeconnect-ai

## Important Prototype Notes

- Account data is stored locally in the browser for demonstration purposes.
- Passwords are stored as SHA-256 hashes, but this is not a replacement for server-side authentication.
- OTP recovery currently uses the demo OTP `123456`; a real SMS provider must be connected for production.
- Scheme information links to official government portals. Full automatic scheme synchronization requires an approved government API or data feed.
- Always verify eligibility, documents, deadlines, and application status on the official government portal.
- ## Author ##
- ** MAKAM DHEERAJ NADH **
