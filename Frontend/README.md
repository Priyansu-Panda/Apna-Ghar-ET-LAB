# 🏠 Apna Ghar — Frontend

A full-featured **React** web application for a property rental platform. Built with **React**, **React Router**, **Axios**, and **Bootstrap**. It connects to the Apna Ghar Express/MongoDB backend and supports two distinct user roles: **Landlords** (property owners) and **Tenants** (property seekers).

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Routing | React Router DOM v6 |
| HTTP Requests | Axios |
| Styling | Bootstrap 5 + custom CSS |
| Icons | react-icons (Font Awesome set) |
| Dev Server | Vite with proxy |

---

## 📁 Project Structure

```
Frontend/src/
├── main.jsx                   # React entry point — mounts <App /> to DOM
├── App.jsx                    # Root router — all route definitions live here
├── index.css                  # Global base styles
├── App.css                    # App-level animations and shared components
│
├── api/
│   ├── client.js              # Axios instance (base URL + credentials)
│   ├── auth.js                # Auth functions: login, register, logout, session
│   └── properties.js          # Property CRUD functions + data mapper
│
├── components/
│   ├── ProtectedRoute.jsx     # Route guard — checks session before rendering
│   ├── LandlordNavbar.jsx     # Navbar for landlord pages (with logout)
│   ├── TenantNavbar.jsx       # Navbar for tenant pages (with logout)
│   └── Footer.jsx             # Global footer rendered on all pages
│
├── pages/
│   ├── Splash.jsx             # Landing animation page (auto-redirects to login)
│   ├── Login.jsx              # Login page (tenant / landlord role selector)
│   ├── Register.jsx           # Registration page (tenant / landlord role selector)
│   │
│   ├── landlord/
│   │   ├── LandlordDashboard.jsx   # Overview: stats, recent bookings, quick actions
│   │   ├── MyProperty.jsx          # Full property list with search, filter, delete
│   │   ├── AddProperty.jsx         # Create / Edit property form with image upload
│   │   ├── BookingRequests.jsx     # Review, approve or reject tenant applications
│   │   ├── LandlordProfile.jsx     # View and edit landlord profile details
│   │   └── LandlordMaintenance.jsx # Manage tenant maintenance complaints
│   │
│   └── tenant/
│       ├── TenantDashboard.jsx     # Property browsing with filters and favorites
│       ├── PropertyDetails.jsx     # Full detail page for a single property
│       ├── TenantProfile.jsx       # View and edit tenant profile details
│       └── TenantMaintenance.jsx   # Submit and track maintenance requests
│
└── data/
    ├── dashboard.js           # Static mock data used by dashboard widgets
    └── properties.js          # Static mock property fallback data
```

---

## ⚙️ Environment & Configuration

### Vite Proxy (`vite.config.js`)
All API calls from the browser go to `/api/*`. Vite's dev server **intercepts these and forwards them to `http://localhost:3000`**, stripping the `/api` prefix. This completely avoids CORS issues in development.

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### API Client (`api/client.js`)
A single shared Axios instance is created with:
- `baseURL`: defaults to `/api` (uses the Vite proxy), or uses `VITE_API_URL` env var for production.
- `withCredentials: true`: this is critical — it tells Axios to **always send the browser's cookies** (including the JWT token cookie) with every request.

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});
```

---

## 🔐 Authentication System (`api/auth.js`)

This file is the **heart of identity management** on the frontend. It handles all auth API calls and manages local state.

### Role Translation
The backend uses `"owner"` for landlords, but the frontend uses `"landlord"`. Two utility functions handle this mapping:

```js
toBackendRole("landlord")  // → "owner"   (before sending to API)
toFrontendRole("owner")    // → "landlord" (after receiving from API)
```

### `saveAuthUser(user)`
Called after login or register. Normalizes the user's role (`owner` → `landlord`) and saves 3 things to `localStorage`:
- `"user"` → full JSON user object
- `"userRole"` → normalized role string (`"landlord"` or `"tenant"`)
- `"userName"` → the user's display name

### `clearAuthUser()`
Called on logout. Removes all 4 keys (`user`, `userRole`, `userName`, `userToken`) from `localStorage`.

### `register({ name, email, phone, password, role })`
Maps the form's `name` field to `username` (as required by the backend), converts `role` to backend format, calls `POST /register`, and saves the returned user.

### `login({ email, password, role })`
Converts `role` to backend format and calls `POST /login`. Saves the returned user.

### `restoreSession()`
Calls `GET /me`. Used on page refresh by `ProtectedRoute` to verify the JWT cookie is still valid and get the current user back from the server.

### `logout()`
Calls `POST /logout` (backend clears the cookie), then clears `localStorage` regardless of whether the API call succeeds.

### `getDashboardPath(role)`
A utility that returns the correct URL for a given role:
- `"landlord"` or `"owner"` → `"/landlord/dashboard"`
- `"tenant"` → `"/tenant/dashboard"`

---

## 🛡️ Route Protection (`components/ProtectedRoute.jsx`)

This component **wraps every private page** in `App.jsx`. It prevents unauthenticated or wrong-role users from accessing pages directly via URL.

**How it works on every page load / refresh:**

1. It calls `restoreSession()` (hits `GET /me` on the backend).
2. While waiting, it renders `null` (blank screen) to prevent a flash.
3. If the session is **invalid** (cookie expired / not logged in) → redirects to `/login`.
4. If the session is **valid** but the role is **wrong** → redirects to the user's own correct dashboard (e.g., a tenant can't navigate to `/landlord/dashboard`).
5. If everything is valid → renders the actual page (`children`).

```jsx
<ProtectedRoute allowedRole="landlord">
  <LandlordDashboard />
</ProtectedRoute>
```

---

## 📡 Properties API Layer (`api/properties.js`)

This is the data bridge between the backend and all property-related pages.

### `mapProperty(property)`
A **critical normalizer** function. The backend schema and the frontend's display needs don't perfectly match, so this function takes a raw backend property object and transforms it into a consistent frontend shape:

| Backend field | Frontend field | Notes |
|---|---|---|
| `_id` | `id` | MongoDB ObjectId → simple `id` |
| `price` or `rent` | `price` and `rent` | Both set to the same number |
| `ownerId` or `owner` | `owner` | For ownership filtering |
| `images[].uri` | `image` (first), `images` (array) | Extracts URL strings from image objects |
| `amenities` or `features` | `features` and `amenities` | Both point to the same array |
| `status` | `status` | Default: `"Available"` |
| `availableRooms` | `tenants` | Occupied rooms count as tenants |
| `price` | `earnings` | Used in landlord stats |

If no images exist, a fallback Unsplash image URL is used.

### Functions
| Function | Route | Description |
|---|---|---|
| `getAllProperties()` | `GET /properties` | Fetch and map all properties (used by Tenant Dashboard) |
| `getPropertyById(id)` | `GET /properties/:id` | Fetch and map a single property (used by PropertyDetails) |
| `getMyProperties()` | `GET /properties` | Fetch all, then **filter client-side** by logged-in user's `_id` |
| `createProperty(formData)` | `POST /properties` | Send multipart form with images |
| `updateProperty(id, data)` | `PUT /properties/:id` | Update property fields and/or add images |
| `deleteProperty(id)` | `DELETE /properties/:id` | Delete a property by ID |

> **Note on `getMyProperties()`:** It fetches all properties from the backend then filters them in-browser by comparing `property.ownerId` against the user's `_id` stored in `localStorage`. Both values are converted to strings before comparison to handle Mongoose ObjectId vs string type differences.

---

## 🗺️ Routing (`App.jsx`)

`App.jsx` defines all routes using React Router's `<BrowserRouter>` and `<Routes>`.

### Public Routes (no auth needed)
| Path | Component |
|---|---|
| `/` | `Splash` — animates for 3 seconds, then auto-redirects to `/login` |
| `/login` | `Login` |
| `/register` | `Register` |

### Landlord Routes (protected, `allowedRole="landlord"`)
| Path | Component |
|---|---|
| `/landlord/dashboard` | `LandlordDashboard` |
| `/landlord/properties` | `MyProperties` |
| `/landlord/add-property` | `AddProperty` (create mode) |
| `/landlord/add-property?edit=:id` | `AddProperty` (edit mode) |
| `/landlord/requests` | `BookingRequests` |
| `/landlord/profile` | `LandlordProfile` |
| `/landlord/maintenance` | `LandlordMaintenance` |

### Tenant Routes (protected, `allowedRole="tenant"`)
| Path | Component |
|---|---|
| `/tenant/dashboard` | `TenantDashboard` |
| `/tenant/browse` | `TenantDashboard` (same component, separate URL) |
| `/tenant/property/:id` | `PropertyDetails` |
| `/tenant/profile` | `TenantProfile` |
| `/tenant/maintenance` | `TenantMaintenance` |

A `<Footer />` is rendered globally below all routes.

---

## 📄 Pages — Detailed Breakdown

---

### `Splash.jsx`
The very first screen. Shows the "RentEase" branding with three icons and an animated loading bar. After **3 seconds**, `useEffect` fires a `setTimeout` that calls `navigate("/login")`. The timeout is cleaned up properly on unmount to prevent memory leaks.

---

### `Login.jsx`
**Features:**
- Role selector (Tenant / Landlord) — changes which dashboard to redirect to after login.
- Email + Password fields with inline validation.
- Toggle password visibility (eye icon).
- On submit: runs `validateForm()`, then calls `loginUser(formData)` from `api/auth.js`.
- On success: shows "Login successful!" message and navigates to the appropriate dashboard.
- On failure: displays the exact backend error message (e.g., "User Not found", "Incorrect Password") or the Axios network error.

---

### `Register.jsx`
**Features:**
- Role selector (Tenant / Landlord).
- Full Name, Email, Phone, Password, Confirm Password fields.
- Client-side validation (email format, phone length, password match, min 6 chars).
- On submit: calls `registerUser(formData)` from `api/auth.js`, which maps `name` → `username` for the backend.
- On success: auto-navigates to the correct role's dashboard.
- On failure: displays the server error (e.g., "User already exist").

---

### `LandlordDashboard.jsx`
**Live data from backend:**
- Calls `getMyProperties()` on mount to fetch the landlord's own properties.
- Computes live stats from that data:
  - **Total Properties** = `properties.length`
  - **Monthly Revenue** = sum of all property `earnings` (which equals `price`)
  - **Occupancy Rate** = `(occupiedCount / totalCount) * 100`
  - **Available count** = properties where `status === "Available"`

**Static / Mock data:**
- "Recent Booking Requests" section shows 2 hardcoded mock requests (Rahul Verma, Sneha Reddy). This is not yet connected to the backend.
- "Alerts & Notifications" card is static UI.
- "Monthly Expenses" card is static UI.

**Live property preview:**
- Shows the **first 2 of the landlord's real properties** with image, title, location, rent.
- "View" and "Edit" buttons link to `AddProperty` in edit mode: `/landlord/add-property?edit=${property.id}`.

---

### `MyProperty.jsx` (My Properties Page)
**Features:**
- Calls `getMyProperties()` on mount to load the landlord's properties.
- **Search bar**: live filters by `title` or `location` (case-insensitive).
- **Type filter dropdown**: filters by `type` (All / PG / Hostel / Apartment).
- **Stats row** at the top: Total Properties, Monthly Earnings, Occupied Units, Total Tenants — all computed live from the fetched data.
- **Property cards**: each shows image, title, location, rent, type, occupancy, status badge, earnings, tenant count.
- **Delete button**: shows `window.confirm()` dialog → calls `deleteProperty(id)` → removes from local state without page reload.
- **Edit button**: navigates to `AddProperty?edit=${id}`.
- **Empty state**: shows "No properties found" if search/filter yields no results.

---

### `AddProperty.jsx` (Create / Edit Property)
This is the **most complex page** — it handles both creating new properties and editing existing ones.

**How Edit Mode Works:**
- Reads `?edit=<id>` from the URL query string using `useLocation()`.
- If `editId` exists → calls `getPropertyById(editId)` and **pre-fills all form fields** with the existing property data.

**Form Fields:**
- Property Type (PG / Hostel / Apartment / House)
- Occupancy (Single / Double / Triple)
- Property Title
- Location
- Gender Preference (Any / Male / Female)
- Full Address
- Monthly Rent → mapped to `price` in the payload
- Security Deposit (stored locally, not in backend schema)
- Amenities (toggle buttons — WiFi, AC, Laundry, Meals, etc.)
- Description
- Photos (multi-file upload, up to 10)

**Right-side Live Preview:** Updates in real-time as you type — shows title, location, rent, amenities.

**Validation (`validateProperty()`):**
- Requires: `title`, `location`, `rent`, `description`
- Requires at least 1 photo **only when creating** (not when editing)

**Payload Building (`buildPayload()`):**
Creates a `FormData` object (needed for file uploads). Key mappings:
- `rent` → also mapped to `price` (backend schema uses `price`)
- `amenities` → each item appended individually (multipart array format)
- `availableRooms` → hardcoded to `"1"` (as a string)
- `status` → hardcoded to `"Available"` (avoids backend enum error)
- `photos` → appended as `"images"` file entries

**On Submit:**
- Edit mode → `updateProperty(editId, payload)`
- Create mode → `createProperty(payload)`
- On success → shows `alert()` then navigates to `/landlord/properties`
- On failure → shows error from backend response

---

### `BookingRequests.jsx`
**⚠️ This page uses fully static mock data** — no backend connection yet.

**Features:**
- Left panel: list of all requests with status filter tabs (Pending / Approved / Rejected).
- Right panel: full detail view for the selected request — contact info, move-in date, message, property details, document verification checklist.
- **Approve button**: changes the selected request's status to `"approved"` in local React state.
- **Reject button**: changes status to `"rejected"` in local React state.
- **Chat button**: shows `alert("Opening tenant chat...")` placeholder.
- State changes are **in-memory only** — refreshing the page resets everything.

---

### `LandlordProfile.jsx`
**Live data from localStorage:**
Reads the logged-in user's data directly from `localStorage`:
```js
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
```
Displays: `username`, `email`, `phone`, `createdAt` (formatted as "Apr 2026").

**Features (local-only):**
- Tab navigation: Account Info / Security / Notifications.
- **Edit Mode toggle**: enables form fields, lets user change `name`, `email`, `phone`, `address`, `PAN`, `GST`.
- **Save**: calls `setEditMode(false)` + `alert()` — does **not** persist to backend.
- **Notification toggles**: booking alerts, payment alerts, maintenance alerts, promotions — local state only.

---

### `TenantDashboard.jsx`
**Live data from backend:**
- Calls `getAllProperties()` on mount — fetches **all properties** from the DB.
- Stats in the hero section are live: `totalProperties`, `available` count.

**Features:**
- **Hero section** with a background video (`/videos/hero.mp4`), search bar, and live property count stats.
- **Left filter sidebar**:
  - Property Type (All Types / PG / Hostel / Apartment)
  - Gender Preference (Any / Male / Female)
  - Amenity toggles (WiFi, Parking, Meals, AC)
  - Reset All Filters button
- **Live filtering (`filteredProperties`)**: runs entirely client-side. All 4 filters (search, type, gender, amenities) are `AND`-combined — a property must pass all active filters to appear.
- **Favorites (heart icon)**: toggling the heart on a card adds/removes the property's `id` from local `favorites` state. **Not persisted** — resets on page refresh.
- **Property cards**: show image, type badge, title, location, occupancy, gender, amenity chips, star rating (static 4.5), price.
- **"View Details" link**: navigates to `/tenant/property/${item.id}`.

---

### `PropertyDetails.jsx`
**Live data from backend:**
- Reads `:id` from the URL using `useParams()`.
- Calls `getPropertyById(id)` on mount to fetch the specific property.
- Handles `404` specifically with a "Property Not Found" message.

**Features:**
- **Image carousel**: cycles through the property's images with Previous/Next arrow buttons. Auto-plays every 4 seconds (interval managed in `useEffect`). Clicking an image opens a zoom/fullscreen view.
- **Like / Favorite button**: toggles `liked` state locally (heart icon turns red).
- **Share button**: `alert()` placeholder.
- **Tab system**: switches between Description, Amenities, Reviews, Map tabs.
- **Booking Request form**: date picker, message textarea, "Request Booking" button (currently shows `alert()` — not connected to backend booking system yet).
- **Chat widget** (floating button): toggles a chat UI overlay where users can type messages — UI only, no backend.
- **Reviews section**: 2 hardcoded static reviews (Arjun, Sneha).

---

### `TenantProfile.jsx`
**Live data from localStorage:**
Same pattern as `LandlordProfile`. Reads `username`, `email`, `phone`, `createdAt` from the stored user.

**Features:**
- Tab navigation: Profile / Settings / Activity.
- Edit mode with save (local state, not persisted to backend).
- Notification preference toggles (local state).
- "Activity" tab: shows static "Recent Activity" timeline.

---

### `TenantMaintenance.jsx`
**⚠️ Fully client-side — no backend connection.**

**Features:**
- **"New Request" button**: toggles an inline form.
- **Form fields**: Property (read-only, hardcoded), Issue Type dropdown, Priority, Description, optional photo upload.
- **Submit**: validates required fields → creates a new request object with a `Date.now()` ID → prepends to local state array.
- **Stats**: live counts of Open / In Progress / Resolved requests from local state.
- **Search + Filter**: filters by title/property text and by status.
- **Request cards**: each shows title, property, description, submitted date, status/priority badges.
- **View Details modal**: click the eye icon → overlay modal shows full description, status timeline (checklist), and action buttons (Edit / Cancel Request — UI only).
- **Delete**: `window.confirm()` → removes from local array.
- **Emergency Contact** section at bottom.

---

### `LandlordMaintenance.jsx`
**⚠️ Fully client-side — no backend connection.**

**Features:**
- Stats: live Open / In Progress / Resolved counts from local state.
- Search bar + status filter dropdown.
- **Request list**: each card shows status/priority badges, issue title, property, tenant name, room number, date.
- **"Start Work" button**: updates status to `"progress"` in local state.
- **"Resolve" button**: updates status to `"resolved"` in local state.
- **"View" button**: opens a full-screen overlay modal showing all details, description, updates timeline (checklist), and action buttons (Assign Worker, Resolve, Chat Tenant, Call — UI only).

---

## 🧭 Navbars (`LandlordNavbar.jsx` / `TenantNavbar.jsx`)

Both navbars share the same structure:
- **Active link highlighting**: uses `useLocation()` to compare the current URL path against each nav link and applies a highlight style.
- **Mobile responsive**: a hamburger toggle (`FaBars` / `FaTimes`) shows/hides the nav menu on small screens.
- **Logout button**: calls `logout()` from `api/auth.js` (hits `POST /logout`, clears the cookie, clears `localStorage`), then calls `navigate("/login")`.

**Landlord nav links:** Dashboard → Properties → Requests → Maintenance → Profile
**Tenant nav links:** Browse → Maintenance → Profile

---

## 📊 Summary: What's Live vs. What's Static

| Feature | Status | Details |
|---|---|---|
| Register | ✅ Live | Full backend integration |
| Login | ✅ Live | Full backend integration |
| Logout | ✅ Live | Clears cookie + localStorage |
| Session Restore | ✅ Live | Via `GET /me` on every protected route load |
| Browse Properties | ✅ Live | `GET /properties` |
| Property Details Page | ✅ Live | `GET /properties/:id` |
| Landlord Dashboard Stats | ✅ Live | Computed from real properties |
| My Properties Page | ✅ Live | `GET /properties` filtered by owner |
| Add New Property | ✅ Live | `POST /properties` with ImageKit |
| Edit Property | ✅ Live | `PUT /properties/:id` |
| Delete Property | ✅ Live | `DELETE /properties/:id` |
| Profile Pages | 🟡 Partial | Reads from localStorage; save is local-only |
| Booking Requests | 🔴 Static | Hardcoded mock data |
| Landlord Maintenance | 🔴 Static | Client-side state only |
| Tenant Maintenance Submit | 🔴 Static | Client-side state only |
| Favorites / Wishlist | 🔴 Static | Local state, not persisted |
| Property Reviews | 🔴 Static | Hardcoded reviewer data |
| Chat Widget | 🔴 Placeholder | UI only, no backend |
