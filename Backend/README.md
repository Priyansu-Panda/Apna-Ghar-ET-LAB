# 🏠 Apna Ghar — Backend API

A RESTful backend for **Apna Ghar**, a property rental platform that connects property **Owners** with **Tenants**. Built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **ImageKit** for image storage.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB (via Mongoose) |
| Auth | JSON Web Tokens (JWT) + Cookies |
| Password Hashing | bcryptjs |
| Image Upload | Multer + ImageKit (@imagekit/nodejs) |
| Dev Server | Nodemon |

---

## 📁 Project Structure

```
Apna Ghar/
├── server.js                    # Entry point — starts Express & connects to DB
├── .env                         # Environment variables (not committed)
├── .gitignore
├── package.json
└── src/
    ├── app.js                   # Express app setup, middleware, and route mounting
    ├── db/
    │   └── db.js                # MongoDB connection logic
    ├── models/
    │   ├── user.model.js        # Mongoose schema for Users
    │   └── property.model.js    # Mongoose schema for Properties
    ├── controllers/
    │   ├── auth.controller.js   # Register, Login, Logout logic
    │   └── property.controller.js # Property CRUD logic
    ├── routes/
    │   ├── auth.routes.js       # Auth route definitions
    │   └── property.routes.js   # Property route definitions
    ├── middleware/
    │   └── auth.middleware.js   # JWT verification & role-based guards
    └── services/
        └── storage.service.js   # ImageKit file upload helper
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project with the following keys:

```env
PORT=3000
DB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
IMAGEKIT_PUBLIC_KEY=<your_imagekit_public_key>
IMAGEKIT_PRIVATE_KEY=<your_imagekit_private_key>
IMAGEKIT_URL_ENDPOINT=<your_imagekit_url_endpoint>
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## 🗃️ Database Models

### User Model (`user.model.js`)

Represents a registered user of the platform.

| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | String | ✅ | - |
| `email` | String | ✅ | Unique |
| `phone` | String | ✅ | Unique |
| `password` | String | ✅ | Stored as bcrypt hash |
| `role` | String | ❌ | Enum: `"owner"` or `"tenant"`. Default: `"tenant"` |
| `createdAt` | Date | — | Auto-managed by timestamps |
| `updatedAt` | Date | — | Auto-managed by timestamps |

---

### Property Model (`property.model.js`)

Represents a property listed on the platform.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | ✅ | Name of the property |
| `description` | String | ✅ | Detailed description |
| `location` | String | ✅ | Address/area of the property |
| `price` | Number | ✅ | Monthly rent |
| `amenities` | [String] | ✅ | List of amenities (e.g. `["WiFi", "Parking"]`) |
| `ownerId` | ObjectId | ✅ | References the `User` who listed it |
| `images` | [ImageObject] | ✅ | Array of image objects (see below) |
| `availableRooms` | Number | ✅ | Count of rooms available |
| `status` | String | ❌ | Enum: `"Available"` or `"Occupied"`. Default: `"Available"` |
| `createdAt` | Date | — | Fixed default timestamp |

#### Image Object (inside `images` array)
Each element in the `images` array is an embedded object with the following fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | ✅ | Image title / caption |
| `uri` | String | ✅ | Public URL of the image (from ImageKit) |
| `ownerId` | ObjectId | ✅ | References the `User` who uploaded it |

---

## 🔐 Authentication System

Authentication uses **JWT tokens stored in HTTP-only cookies**. On login or registration, a signed token is set via `res.cookie("token", token)`, and all protected routes read it back from `req.cookies.token`.

### Middleware Guards (`auth.middleware.js`)

Three middleware guards protect routes based on user identity and role:

| Middleware | Who can pass | Used on |
|---|---|---|
| `authUser` | Any logged-in user (owner or tenant) | `GET /properties` |
| `authOwner` | Only users with `role: "owner"` | `POST`, `PUT`, `DELETE` on properties |
| `authTenant` | Only users with `role: "tenant"` | *(For future tenant-specific routes)* |

All guards:
1. Extract the JWT from `req.cookies.token`
2. Verify and decode it using `JWT_SECRET`
3. Fetch the user from MongoDB by `decode.id`
4. Attach the user object to `req.user` and call `next()`

---

## 🛣️ API Reference

### Auth Routes (`/`)

#### `POST /register`
Registers a new user.

**Request Body (JSON):**
```json
{
  "username": "Ali",
  "email": "ali@example.com",
  "phone": "03001234567",
  "password": "secret123",
  "role": "owner"
}
```

**What Happens:**
1. Checks if a user already exists with the same `email` or `phone` using `findOne`.
2. Hashes the password using `bcrypt` (salt rounds: 10).
3. Creates the user in MongoDB.
4. Signs a JWT (`expiresIn: "1d"`) with the user's `_id`.
5. Sets the token as a cookie and responds with user data + token.

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "token": "<jwt>"
}
```

---

#### `POST /login`
Logs in an existing user.

**Request Body (JSON):**
```json
{
  "email": "ali@example.com",
  "password": "secret123"
}
```
> You can also pass `phone` instead of `email`.

**What Happens:**
1. Looks up user by `email` OR `phone`.
2. Compares the submitted password with the stored bcrypt hash using `bcrypt.compare()`.
3. If valid, signs a JWT and sets it as a cookie.

**Response:** `201 OK`
```json
{
  "message": "User logged in successfully",
  "user": { ... },
  "token": "<jwt>"
}
```

---

#### `POST /logout`
Logs out the current user by clearing the auth cookie.

**Response:** `200 OK`
```json
{ "message": "User logged out successfully" }
```

---

### Property Routes (`/properties`)

All property routes require the user to be **logged in**. Write operations (create, update, delete) additionally require the user to have the `owner` role.

---

#### `GET /properties`
Fetches all listed properties.

**Auth:** Any logged-in user (`authUser`)

**Response:** `200 OK`
```json
{
  "message": "Properties fetched successfully",
  "properties": [ ... ]
}
```

---

#### `GET /properties/:id`
Fetches a single property by its MongoDB `_id`.

**Auth:** Any logged-in user (`authUser`)

**Response:** `200 OK`
```json
{
  "message": "Property fetched successfully",
  "property": { ... }
}
```

---

#### `POST /properties`
Creates a new property listing with image uploads.

**Auth:** Owners only (`authOwner`)

**Request:** `multipart/form-data` *(use Postman → form-data)*

| Key | Type | Required | Notes |
|---|---|---|---|
| `title` | Text | ✅ | Property title |
| `description` | Text | ✅ | |
| `location` | Text | ✅ | |
| `price` | Text | ✅ | Monthly rent amount |
| `amenities` | Text | ✅ | Comma-separated or JSON array |
| `availableRooms` | Text | ✅ | Number of rooms |
| `status` | Text | ❌ | `"Available"` or `"Occupied"` |
| `images` | File | ✅ | Upload up to **10 image files** |

**What Happens:**
1. Multer receives the uploaded files into memory (`memoryStorage`).
2. Each file's buffer is base64-encoded and uploaded to **ImageKit** under the `apna_ghar/` folder.
3. For each uploaded file, an image object `{ title, uri, ownerId }` is constructed.
4. The property is created in MongoDB with the `ownerId` taken securely from `req.user._id` (not from the request body).

**Response:** `201 Created`
```json
{
  "message": "Property created successfully",
  "property": { ... }
}
```

---

#### `PUT /properties/:id`
Updates an existing property.

**Auth:** Owners only (`authOwner`)

**Request:** `multipart/form-data`

You can update any text field (title, description, location, price, amenities, availableRooms, status). Optionally, attach up to 10 new images under the `images` key to add them to the property's image gallery.

**Security Rules enforced:**
- Only the **original owner** of the property can update it. If a different owner attempts this, they receive a `403 Forbidden` response.
- `ownerId` is deleted from the request body before updating — users cannot transfer property ownership via the API.
- The `images` field from the request body is always deleted. Images can only be added by uploading real files.

**What Happens if files are uploaded:**
1. The new images are uploaded to ImageKit.
2. Image objects `{ title, uri, ownerId }` are created for each.
3. MongoDB's `$push` operator is used with `$each` to safely *append* the new images to the existing array (not overwrite it).

**Response:** `200 OK`
```json
{
  "message": "Property updated successfully",
  "updatedProperty": { ... }
}
```

---

#### `DELETE /properties/:id`
Deletes a property listing.

**Auth:** Owners only (`authOwner`)

**Security Rules enforced:**
- Only the **original owner** of the property can delete it.

**What Happens:**
1. Finds the property by `id`.
2. Compares `property.ownerId` with `req.user._id`.
3. If authorized, deletes the document using `findByIdAndDelete`.

**Response:** `200 OK`
```json
{
  "message": "Property deleted successfully",
  "property": { ... }
}
```

---

## 🖼️ Image Upload Flow (ImageKit)

Images are **never stored on the server's disk**. The flow is:

```
Client uploads file(s)
        ↓
Multer (memoryStorage) → file stored in RAM as Buffer
        ↓
storage.service.js → buffer.toString("base64") → sent to ImageKit API
        ↓
ImageKit stores the file and returns a public URL (result.url)
        ↓
URL is saved in MongoDB as the image's "uri" field
```

This makes the server **stateless** and image storage **infinitely scalable**.

---

## 🔒 Security Highlights

- Passwords are **never stored in plain text** — bcrypt with 10 salt rounds is used.
- Auth tokens are stored in **cookies**, not `localStorage`, reducing XSS exposure.
- `ownerId` is always assigned from the **verified JWT** (`req.user._id`), never trusted from client input.
- Only the **creator** of a property can update or delete it (ownership check).
- Image data can only enter the database through a **real file upload** — not raw text from the request body.
