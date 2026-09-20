# MERN Auth

A full-stack MERN authentication application with a React/Vite client and an Express API backed by MongoDB. Authentication uses JWTs stored in HTTP-only cookies, with email verification and password-reset OTP flows.

## Features

- User registration and login
- JWT authentication stored in an `httpOnly` cookie
- Logout and authentication checks
- Email verification with a 6-digit OTP
- Password reset with a 6-digit OTP
- Password hashing with `bcryptjs`
- MongoDB persistence with Mongoose
- SMTP email delivery through Brevo
- React client with protected authentication flows
- Axios requests with credentials enabled

## Tech Stack

- Node.js
- Express 5
- MongoDB and Mongoose
- JSON Web Tokens
- Nodemailer
- CORS and cookie-parser

## Project Structure

```text
client/
├── src/
│   ├── Components/  # Shared React components
│   ├── context/     # Authentication context
│   └── pages/       # Login, verification, and reset pages
└── package.json
server/
├── config/          # MongoDB and SMTP configuration
├── controller/      # Authentication handlers
├── middleware/      # JWT authentication middleware
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── server.js        # Express application entry point
└── package.json
```

## Prerequisites

- Node.js 18 or later
- A MongoDB database, local or hosted
- SMTP credentials from Brevo or another compatible SMTP provider

## Installation

1. Clone the repository and enter the project directory.

2. Install the server dependencies:

	 ```bash
	 cd server
	 npm install
	 ```

3. Create `server/.env` with the following values:

	 ```env
	 PORT=4000
	 MONGODB_URL=mongodb://127.0.0.1:27017
	 JWT_SECRET=replace-with-a-long-random-secret
	 SMTP_USER=your-smtp-username
	 SMTP_PASS=your-smtp-password
	 SENDER_EMAIL=your-verified-sender@example.com
	 NODE_ENV=development
	 ```

	Use a MongoDB connection string, including the database name when required by your provider.

4. Start the API:

	 ```bash
	 npm start
	 ```

	 The server is available at `http://localhost:4000` by default.

5. Install and start the client in a second terminal:

	 ```bash
	 cd client
	 npm install
	 npm run dev
	 ```

	 The client is available at `http://localhost:5173` by default. Create `client/.env` if the API runs at another URL:

	 ```env
	 VITE_BACKEND_URL=http://localhost:4000
	 ```

## API Reference

All authentication endpoints are prefixed with `/api/auth`.

### Health Check

```http
GET /
```

Returns `API working` when the server is running.

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
	"name": "Ada Lovelace",
	"email": "ada@example.com",
	"password": "strong-password"
}
```

Successful registration creates a user, sends a welcome email, and sets the authentication cookie.

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
	"email": "ada@example.com",
	"password": "strong-password"
}
```

Successful login sets the authentication cookie. Clients must retain and send this cookie on later protected requests.

### Logout

```http
POST /api/auth/logout
```

Clears the authentication cookie.

### Send Verification OTP

```http
POST /api/auth/send-verify-otp
```

Requires the authentication cookie. The user ID is read from the authenticated JWT. The OTP is valid for 24 hours.

### Verify Email

```http
POST /api/auth/verify-email
Content-Type: application/json
```

```json
{
	"otp": "123456"
}
```

Requires the authentication cookie.

### Check Authentication

```http
GET /api/auth/is-auth
```

Requires the authentication cookie and returns `{ "success": true }` when the JWT is valid.

### Send Password Reset OTP

```http
POST /api/auth/send-reset-otp
Content-Type: application/json
```

```json
{
	"email": "ada@example.com"
}
```

The password-reset OTP is valid for 15 minutes.

### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json
```

```json
{
	"email": "ada@example.com",
	"otp": "123456",
	"newPassword": "new-strong-password"
}
```

## CORS and Cookies

The API accepts browser requests from `http://localhost:5173` and enables credentials. A frontend client must include credentials when calling the API:

```js
fetch("http://localhost:4000/api/auth/login", {
	method: "POST",
	credentials: "include",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ email, password })
});
```

For production, update the CORS origin in `server/server.js` and set `NODE_ENV=production` so cookies use secure cross-site settings.

## Testing with Postman

The repository includes Postman workspace data in `postman/globals/workspace.globals.yaml`. Import it into Postman, start the API, and send requests to `http://localhost:4000`.

When testing protected endpoints, keep cookies enabled in Postman so the JWT cookie from registration or login is sent automatically.

## Security Notes

- Keep `server/.env` out of version control.
- Use a long, unpredictable value for `JWT_SECRET`.
- Use HTTPS in production.
- Use a verified sender address for `SENDER_EMAIL`.
- Never log passwords, JWTs, SMTP credentials, or OTPs in production.

## Available Scripts

Run these commands from the relevant directory:

| Command | Description |
| --- | --- |
| `cd server && npm install` | Install server dependencies |
| `cd server && npm start` | Start the API |
| `cd client && npm install` | Install client dependencies |
| `cd client && npm run dev` | Start the Vite development server |
| `cd client && npm run build` | Build the client for production |
| `cd client && npm run lint` | Run client linting |

## License

This project is available under the ISC license declared in `server/package.json`.
