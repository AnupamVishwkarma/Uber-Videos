# Users API - /users/register

POST /users/register

Description
- Registers a new user and returns an auth token.

Request
- Content-Type: application/json
- Body JSON schema:

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

Required fields & validation
- `fullname.firstname`: string, required, minimum 3 characters
- `fullname.lastname`: string, required, minimum 3 characters
- `email`: string, required, must be a valid email
- `password`: string, required, minimum 6 characters

Responses
- 201 Created: user successfully created
  - Body: `{ user, token }` (the `user` object excludes the password; `token` is a JWT)
- 400 Bad Request: validation errors
  - Body: `{ errors: [ ... ] }` (array of validation error objects from express-validator)
- 500 Internal Server Error: unexpected server error

Examples

Curl example:

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane.doe@example.com",
    "password": "s3cret123"
  }'
```

Successful response (201):

```json
{
  "user": {
    "_id": "<id>",
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane.doe@example.com",
    "socketId": ""
  },
  "token": "<jwt-token>"
}
```

Notes
- Password is hashed before saving; the returned `user` does not include the password.
- Token expiration: 1 hour (JWT configured in the model).
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

---

# Users API - /users/login

POST /users/login

Description
- Authenticate a user and return an auth token.

Request
- Content-Type: application/json
- Body JSON schema:

```json
{
  "email": "string",
  "password": "string"
}
```

Required fields & validation
- `email`: string, required, must be a valid email
- `password`: string, required, minimum 6 characters

Responses
- 200 OK: authentication successful
  - Body: `{ user, token }` (the `user` object excludes password)
- 400 Bad Request: validation errors
  - Body: `{ errors: [ ... ] }`
- 401 Unauthorized: invalid credentials (user not found or wrong password)
  - Body: `{ message: "Authentication failed. ..." }`
- 500 Internal Server Error: unexpected server error

Examples

Curl example:

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@example.com",
    "password": "s3cret123"
  }'
```

Successful response (200):

```json
{
  "user": {
    "_id": "<id>",
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane.doe@example.com",
    "socketId": ""
  },
  "token": "<jwt-token>"
}
```

Notes
- The route loads the user with `select('+password')` then calls the instance method `comparePassword(password)` to verify credentials.
- Passwords are hashed in storage and never returned to clients.
- Token expiration: 1 hour (JWT configured in the model).

