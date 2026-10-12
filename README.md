# COMP 3123 — Assignment 1 (Backend)

**Student:** Omar Butt — **101550625**
**Course:** COMP 3123 — Full Stack Development
**Repository:** https://github.com/omarbutt401-del/101550625_Comp3123_Assigment1

A secure RESTful backend API built with Node.js, Express, and MongoDB that provides user registration, JWT-based authentication, and full CRUD operations on employees with strict per user ownership enforcement.

---

## 1. Project Purpose

Demonstrate a production-style REST API that:
- Registers users with hashed passwords (bcrypt)
- Authenticates users via JWT (username or email)
- Lets each authenticated user manage only their own employees
- Applies input validation, Helmet security headers, and per-endpoint rate limiting
- Logs requests and errors locally (Winston)
- Exposes a `/health` endpoint

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (local `mongodb://127.0.0.1:27017`) |
| ODM | Mongoose |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password hashing | `bcryptjs` |
| Validation | `express-validator` |
| Security | `helmet`, `express-rate-limit`, `cors` |
| Logging | `winston`, `morgan` |
| Config | `dotenv` |

---

## 3. Project Structure

```
101550625_Comp3123_Assigment1/
├── config/
│   ├── db.js                 # Mongoose connection
│   └── logger.js             # Winston logger (file + console)
├── controllers/
│   ├── userController.js     # signup, login
│   └── employeeController.js # CRUD, owner-scoped
├── middleware/
│   ├── auth.js               # JWT verification
│   └── rateLimiter.js        # authLimiter + apiLimiter
├── models/
│   ├── User.js               # username, email, password (hashed)
│   └── Employee.js           # employee fields + owner ref
├── routes/
│   ├── userRoutes.js         # /api/v1/user/*
│   └── employeeRoutes.js     # /api/v1/emp/*
├── validators/
│   ├── userValidator.js
│   └── employeeValidator.js
├── logs/                     # app.log, error.log (git-ignored)
├── screenshots/              # Postman evidence
├── server.js                 # App entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 4. Installation

```bash
# 1. Clone
git clone https://github.com/omarbutt401-del/101550625_Comp3123_Assignment1.git
cd 101550625_Comp3123_Assignment1

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# then edit .env and set JWT_SECRET + MONGODB_URI

# 4. Start MongoDB (macOS Homebrew)
brew services start mongodb-community@7.0

# 5. Run the server
npm start          # production
npm run dev        # dev (nodemon)
```

Server starts at **http://localhost:8081**.

---

## 5. Environment Variables

Create a `.env` in the project root:

```env
PORT=8081
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/comp3123_assignment1
JWT_SECRET=<long-random-string>
JWT_EXPIRES_IN=2h
```

See `.env.example` for a template. **Never commit `.env`.**

---

## 6. API Endpoints

Base URLs: `/api/v1/user`, `/api/v1/emp`

### User

| # | Method | Endpoint | Auth | Status | Purpose |
|---|---|---|---|---|---|
| 1 | POST | `/api/v1/user/signup` | No | 201 | Register a new user |
| 2 | POST | `/api/v1/user/login`  | No | 200 | Authenticate and receive JWT |

**Signup body:**
```json
{ "username": "alice", "email": "alice@example.com", "password": "pass1234" }
```
**Login body:**
```json
{ "usernameOrEmail": "alice", "password": "pass1234" }
```
**Login response:**
```json
{ "status": true, "message": "Authentication successful.", "jwt": "eyJ..." }
```

### Employee (all require `Authorization: Bearer <jwt>`)

| # | Method | Endpoint | Status | Purpose |
|---|---|---|---|---|
| 3 | GET | `/api/v1/emp/employees` | 200 | List **own** employees |
| 4 | POST | `/api/v1/emp/employees` | 201 | Create employee |
| 5 | GET | `/api/v1/emp/employees/{eid}` | 200 | Get one **own** employee |
| 6 | PUT | `/api/v1/emp/employees/{eid}` | 200 | Update **own** employee |
| 7 | DELETE | `/api/v1/emp/employees?eid={eid}` | 204 | Delete **own** employee |

**Create body:**
```json
{
  "first_name": "John", "last_name": "Doe",
  "email": "john@example.com", "position": "Developer",
  "salary": 75000, "date_of_joining": "2024-01-15",
  "department": "Engineering"
}
```

### Utility

| Method | Endpoint | Status | Purpose |
|---|---|---|---|
| GET | `/health` | 200 | Server + DB status |

---

## 7. Authentication

1. **Signup** → creates user with bcrypt-hashed password.
2. **Login** → verifies credentials → returns a JWT signed with `JWT_SECRET`, expiring in 2h.
3. Client sends the JWT on every protected call:
   ```
   Authorization: Bearer <jwt>
   ```
4. `middleware/auth.js` verifies:
   - Header present and well-formed → else **401**
   - Signature/expiry valid → else **401**
   - On success, sets `req.user.id` for downstream handlers.

---

## 8. Authorization (Per-User Ownership)

Every employee document carries a `user` reference to the creating user:

```js
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```

Every employee query filters by the **authenticated user**:

```js
Employee.find({ user: req.user.id })
Employee.findOne({ _id: eid, user: req.user.id })
Employee.findOneAndDelete({ _id: eid, user: req.user.id })
```

**The client-supplied `eid` alone is never trusted.** A user attempting to access another user's employee gets **404 Not Found** — verified by cross-user tests (Section 14b in the Postman collection).

---

## 9. Security

| Feature | Implementation |
|---|---|
| Password hashing | `bcryptjs` pre-save hook (10 salt rounds) — plaintext never stored |
| JWT auth | HS256, 2h expiry, `JWT_SECRET` from env |
| Helmet | HTTP security headers on every response |
| Rate limiting | `authLimiter` (20 req / 15 min) on `/login` and `/signup`; `apiLimiter` (100 req / 5 min) on `/api/*` → returns **429** |
| Input validation | `express-validator` on user and employee payloads |
| ObjectId validation | `mongoose.Types.ObjectId.isValid` guard on `:eid` and `?eid=` |
| Malformed JSON | Custom middleware → **400 Bad Request** JSON |
| Centralized errors | Single error middleware — never leaks stack traces |
| 404 routes | JSON response, not HTML |
| Environment secrets | `.env` (git-ignored) + `.env.example` |

---

## 10. Logging

- **Library:** `winston`
- **Files:** `logs/app.log` (all info), `logs/error.log` (errors only)
- **What is logged:** timestamp, HTTP method, URL, status code, duration, authenticated user ID; plus application and error events
- **What is NOT logged:** passwords, JWT secrets, full tokens, DB credentials
- Console transport enabled only outside production

---

## 11. Health Check

```
GET /health
```
Returns:
```json
{
  "status": "UP",
  "timestamp": "2026-10-12T22:03:43.296Z",
  "uptime": 18.38,
  "database": "CONNECTED"
}
```

---

## 12. Testing

Postman collection included at the project root:

```
101550625_COMP3123_Assignment1.postman_collection.json
```

Covers:
- Signup success + duplicate (**409**)
- Login success + invalid password (**400**)
- Employee CRUD (201 / 200 / 200 / 200 / **204**)
- Missing JWT (**401**), invalid JWT (**401**)
- Invalid ObjectId (**400**), malformed JSON (**400**)
- Cross-user access (**404**)
- Rate limiting (**429**)
- Health check (**200**)

Screenshots of every request/response are provided 

---

## 13. Database

- **Name:** `comp3123_assignment1`
- **Collections:** `users`, `employees`
- **Relationship:** `employees.user → users._id`

Inspect manually:
```bash
mongosh comp3123_assignment1
> db.users.find().pretty()
> db.employees.find().pretty()
```

---

## 14. Author

**Omar Butt** — 101550625
COMP 3123 — Fall 2026