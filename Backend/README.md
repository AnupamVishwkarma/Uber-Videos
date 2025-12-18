# Users API — /users/register 🔐

## Description
Register a new user and return an authentication token.

- **Endpoint:** `POST /users/register`
- **Purpose:** Create a new user account and return a JWT auth token.

---

## Request
- **Headers**
  - `Content-Type: application/json`

- **Body (JSON)**

The endpoint expects a JSON payload with the following properties:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "supersecret"
}
```

- **Validation rules**
  - `email` — must be a valid email address (required)
  - `fullname.firstname` — string, minimum length 3 (required)
  - `password` — string, minimum length 6 (required)
  - `fullname.lastname` — required by the database schema but not explicitly validated in the current routes (recommended to validate)

---

## Responses

### Success (201 Created) ✅
Returns the created `user` object and a JWT `token`.

Example:

```json
HTTP/1.1 201 Created
{
  "user": {
    "_id": "64a0b1f3f1e7c3e1a2b3c4d5",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": "",
    "__v": 0
  },
  "token": "<jwt-token-here>"
}
```

> Note: The actual `user` object returned may vary depending on the model's `select` options and mongoose behavior. Passwords should never be returned to the client.


### Validation error (400 Bad Request) ⚠️
Returns an array of validation errors when the request payload fails express-validator checks.

Example:

```json
HTTP/1.1 400 Bad Request
{
  "errors": [
    {
      "value": "jo",
      "msg": "First name must be at least 3 characters",
      "param": "fullname.firstname",
      "location": "body"
    },
    {
      "value": "not-an-email",
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Server error (500 Internal Server Error)
If something goes wrong on the server (e.g., database error), a generic 500 response may be returned.


---

## Example cURL

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "supersecret"
  }'
```

---

## Notes & Recommendations 💡
- Add explicit validation for `fullname.lastname` to prevent database validation errors.
- Ensure `JWT_SECRET` is set in environment variables and is secure.
- Consider returning a sanitized user object (exclude internal fields) to clients.

---

If you'd like, I can also add a unit/integration test or update the route validators to include `lastname` validation. ✨
