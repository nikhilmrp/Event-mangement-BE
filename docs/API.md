# Event Management API Documentation

**Base URL:** `/api/v1`  
**Default port:** `5000` (configurable via `PORT` env variable)

---

## Table of Contents

1. [General](#general)
2. [Authentication](#authentication)
3. [Auth Endpoints](#auth-endpoints)
4. [Config Endpoints](#config-endpoints)
5. [Profile Endpoints](#profile-endpoints)
6. [Upload Endpoints](#upload-endpoints)
7. [Agent Client Flow Endpoints](#agent-client-flow-endpoints)
8. [Response Format](#response-format)
9. [Rate Limiting](#rate-limiting)
10. [Unwired Validators](#unwired-validators)

---

## General

| Method | Endpoint  | Auth | Description         |
| ------ | --------- | ---- | ------------------- |
| `GET`  | `/`       | No   | Welcome message     |
| `GET`  | `/health` | No   | Server health check |
| `GET`  | `/api/v1` | No   | API v1 info         |

### Health check response

```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-06-15T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "development"
}
```

---

## Authentication

Protected routes accept authentication via either:

- **Cookie:** `access_token` (set automatically on login)
- **Header:** `Authorization: Bearer <token>`

Login endpoints set an `httpOnly` cookie named `access_token`. Logout endpoints clear this cookie.

**CORS:** Credentials are supported. Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.

---

## Auth Endpoints

**Prefix:** `/api/v1/auth`

### Admin

#### `POST /register-admin`

Register a new admin user.

**Body (JSON):**

| Field              | Type   | Required | Rules                                                              |
| ------------------ | ------ | -------- | ------------------------------------------------------------------ |
| `email`            | string | Yes      | Valid email address                                                |
| `password`         | string | Yes      | Min 8 chars; uppercase, lowercase, digit, special char (`@$!%*?&`) |
| `first_name`       | string | Yes      | Letters and spaces only, 1–100 chars                               |
| `last_name`        | string | Yes      | Letters and spaces only, 1–100 chars                               |
| `phone`            | string | Yes      | 10-digit Indian number (starts with 6–9)                           |
| `confirm_password` | string | No       | Must match `password` if provided                                  |

**Example:**

```json
{
  "email": "admin@example.com",
  "password": "Secure@123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210"
}
```

---

#### `POST /admin-login`

**Body (JSON):**

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |

**Response:** Returns `user` and `token`. Sets `access_token` cookie. `user.profile_id` is the vendor/agent profile's id (`null` for admins, or for a vendor/agent who hasn't created a profile yet).

---

#### `POST /admin-logout`

No body required. Clears the `access_token` cookie.

---

### Vendor

#### `POST /register-vendor`

Same body schema as `POST /register-admin`.

#### `POST /vendor-login`

Same body schema as `POST /admin-login`.

#### `POST /vendor-logout`

No body required. Clears the `access_token` cookie.

---

### Agent

#### `POST /register-agent`

Same body schema as `POST /register-admin`.

#### `POST /agent-login`

Same body schema as `POST /admin-login`.

#### `POST /agent-logout`

No body required. Clears the `access_token` cookie.

---

## Config Endpoints

**Prefix:** `/api/v1/config`  
**Auth:** Required for all endpoints

### Locations

#### `POST /create-location`

**Body (JSON):**

| Field    | Type    | Required | Rules            |
| -------- | ------- | -------- | ---------------- |
| `name`   | string  | Yes      | 1–255 characters |
| `status` | boolean | Yes      | Active/inactive  |

**Example:**

```json
{
  "name": "Mumbai",
  "status": true
}
```

---

#### `GET /get-locations`

No parameters. Returns all locations.

---

### Vendor Types

#### `POST /create-vendor-type`

**Body (JSON):**

| Field                   | Type    | Required | Rules            |
| ----------------------- | ------- | -------- | ---------------- |
| `name`                  | string  | Yes      | 2–150 characters |
| `commission_percentage` | number  | Yes      | 0–100            |
| `status`                | boolean | Yes      | Active/inactive  |

**Example:**

```json
{
  "name": "Photography",
  "commission_percentage": 10.5,
  "status": true
}
```

---

#### `GET /get-vendor-types`

No parameters. Returns all vendor types.

---

### Vendor Categories

#### `POST /create-vendor-category`

**Body (JSON):**

| Field            | Type    | Required | Rules            |
| ---------------- | ------- | -------- | ---------------- |
| `vendor_type_id` | number  | Yes      | Positive integer |
| `name`           | string  | Yes      | 2–150 characters |
| `status`         | boolean | Yes      | Active/inactive  |

**Example:**

```json
{
  "vendor_type_id": 1,
  "name": "Wedding Photography",
  "status": true
}
```

---

#### `GET /get-vendor-catogories-by-vendor-type-id/:vendor_type_id`

**Path params:**

| Param            | Type   | Required | Rules            |
| ---------------- | ------ | -------- | ---------------- |
| `vendor_type_id` | number | Yes      | Positive integer |

**Example:** `GET /api/v1/config/get-vendor-catogories-by-vendor-type-id/1`

---

## Profile Endpoints

**Prefix:** `/api/v1/profile`  
**Auth:** Required for all endpoints below

### Agent Profile

**Prefix:** `/api/v1/profile/agent`

#### `POST /create-agent-profile`

**Body (JSON):**

| Field               | Type     | Required | Rules                            |
| ------------------- | -------- | -------- | -------------------------------- |
| `user_id`           | number   | Yes      | Positive integer                 |
| `address`           | string   | Yes      | 1–255 characters                 |
| `service_locations` | number[] | Yes      | Array of location IDs (integers) |

**Example:**

```json
{
  "user_id": 1,
  "address": "123 Main Street, Mumbai",
  "service_locations": [1, 2, 3]
}
```

---

#### `POST /bank-details/create-bank-details`

**Role required:** `AGENT`

**Body (JSON):**

| Field                 | Type   | Required | Rules            |
| --------------------- | ------ | -------- | ---------------- |
| `user_id`             | number | Yes      | Positive integer |
| `account_holder_name` | string | Yes      | 1–255 characters |
| `account_number`      | string | Yes      | 1–255 characters |
| `ifsc_code`           | string | Yes      | 1–255 characters |
| `bank_name`           | string | Yes      | 1–255 characters |
| `branch_name`         | string | Yes      | 1–255 characters |
| `upi_id`              | string | Yes      | 1–255 characters |
| `contact_number`      | string | Yes      | 1–255 characters |

**Example:**

```json
{
  "user_id": 1,
  "account_holder_name": "John Doe",
  "account_number": "1234567890",
  "ifsc_code": "SBIN0001234",
  "bank_name": "State Bank of India",
  "branch_name": "Mumbai Main",
  "upi_id": "john@upi",
  "contact_number": "9876543210"
}
```

---

### Vendor Profile

**Prefix:** `/api/v1/profile/vendor`

#### `POST /create-vendor-profile`

**Body (JSON):**

| Field               | Type     | Required | Rules                              |
| ------------------- | -------- | -------- | ---------------------------------- |
| `user_id`           | number   | Yes      | Positive integer                   |
| `business_name`     | string   | Yes      | 1–255 characters                   |
| `description`       | string   | Yes      | 1–255 characters                   |
| `address`           | string   | Yes      | 1–255 characters                   |
| `phone_number`      | string   | Yes      | 10-digit Indian number (6–9 start) |
| `email`             | string   | Yes      | Valid email                        |
| `service_locations` | number[] | Yes      | Array of location IDs              |

**Example:**

```json
{
  "user_id": 2,
  "business_name": "Perfect Events Co.",
  "description": "Full-service event planning",
  "address": "456 Business Park, Delhi",
  "phone_number": "9123456789",
  "email": "vendor@example.com",
  "service_locations": [1, 2]
}
```

---

#### `POST /create-service-details`

**Body (JSON):**

| Field                | Type     | Required | Rules                 |
| -------------------- | -------- | -------- | --------------------- |
| `user_id`            | number   | Yes      | Positive integer      |
| `vendor_type_id`     | number   | Yes      | Positive integer      |
| `vendor_categoryids` | number[] | Yes      | Array of category IDs |

**Example:**

```json
{
  "user_id": 2,
  "vendor_type_id": 1,
  "vendor_categoryids": [1, 2, 3]
}
```

---

#### `POST /create-pricing-details`

**Body (JSON):**

| Field             | Type   | Required | Rules                                |
| ----------------- | ------ | -------- | ------------------------------------ |
| `user_id`         | number | Yes      | Positive integer                     |
| `pricing_details` | array  | Yes      | Array of pricing objects (see below) |

**Pricing object:**

| Field          | Type   | Required | Allowed values                     |
| -------------- | ------ | -------- | ---------------------------------- |
| `pricing_type` | string | Yes      | `per_hour`, `per_day`, `per_event` |
| `amount`       | number | Yes      | Positive number                    |

**Example:**

```json
{
  "user_id": 2,
  "pricing_details": [
    { "pricing_type": "per_hour", "amount": 500 },
    { "pricing_type": "per_day", "amount": 5000 },
    { "pricing_type": "per_event", "amount": 25000 }
  ]
}
```

---

#### `POST /upload-work-gallery`

**Body (JSON):**

| Field        | Type     | Required | Rules               |
| ------------ | -------- | -------- | ------------------- |
| `user_id`    | number   | Yes      | Positive integer    |
| `image_urls` | string[] | Yes      | Array of valid URIs |

**Example:**

```json
{
  "user_id": 2,
  "image_urls": [
    "https://bucket.s3.amazonaws.com/image1.jpg",
    "https://bucket.s3.amazonaws.com/image2.jpg"
  ]
}
```

---

#### `POST /bank-details/create-bank-details`

**Role required:** `VENDOR`

Same body schema as agent bank details (`POST /api/v1/profile/agent/bank-details/create-bank-details`).

---

#### `POST /add-unavailability`

Marks or unmarks a date as unavailable for the authenticated vendor (vendor is resolved from the JWT, not the request body). If `status` is `true` the date is added; if `status` is `false` the date is removed (404 if it wasn't marked). Returns the vendor's full current unavailability list.

**Body (JSON):**

| Field              | Type    | Required | Rules                            |
| ------------------ | ------- | -------- | -------------------------------- |
| `unavailable_date` | string  | Yes      | ISO date (`YYYY-MM-DD`)          |
| `status`           | boolean | Yes      | `true` to add, `false` to remove |

**Example:**

```json
{
  "unavailable_date": "2026-08-01",
  "status": true
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "vendor_profile_id": 5,
    "unavailability": [{ "id": 1, "unavailable_date": "2026-08-01" }]
  },
  "message": "Vendor unavailability updated successfully",
  "success": true
}
```

---

#### `GET /get-unavailability-by-id/:userId`

Returns the list of unavailable dates for the vendor identified by `userId` (a `users.id`, not a `vendor_profiles.id`). Accessible to any authenticated user, not just the vendor themselves.

---

#### `GET /get-my-bookings`

**Role required:** `VENDOR`

Returns the events the authenticated vendor has been selected on (vendor resolved from the JWT, not a path/query param), each with client details and the vendor's own `pricing_type`/`amount` for that event. Only the calling vendor's own selection is included — other vendors assigned to the same event are not shown.

**Query params:**

| Param    | Required | Notes                                                                                          |
| -------- | -------- | ------------------------------------------------------------------------------------------------ |
| `status` | No       | Comma-separated list of `draft`, `vendor_selected`, `confirmed`. Omitted → all statuses. Unrecognized value → 400. Note: `draft` never actually matches anything, since a vendor row only exists once an event reaches `vendor_selected`. |

**Example:** `GET /get-my-bookings?status=vendor_selected,confirmed`

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "client": {
        "id": 10,
        "name": "Priya Sharma",
        "email": "priya@example.com",
        "phone": "9876512345",
        "address": "12 MG Road, Bangalore",
        "location": { "id": 1, "name": "Bangalore" }
      },
      "event": {
        "id": 12,
        "event_name": "Priya's Wedding",
        "event_priority": "high",
        "estimated_budget": 500000,
        "preferred_date": "2026-12-21",
        "additional_notes": null,
        "status": "confirmed",
        "total_amount": 15000,
        "payment_receipt_url": "https://bucket.s3.amazonaws.com/payment_receipts/receipt.jpg",
        "confirmed_at": "2026-08-26T11:36:27.000Z"
      },
      "my_selection": { "pricing_type": "per_event", "amount": 15000 }
    }
  ],
  "message": "Bookings fetched successfully",
  "success": true
}
```

---

### General Profile

**Prefix:** `/api/v1/profile/general`

**Role required:** `ADMIN`

#### `GET /get-profile-details`

Returns a summary list of every completed profile for the given role (`vendor`, `agent`, or `admin`), passed as a query param: `?role=vendor`.

Optionally filter by verification status with `?email_verified=true` or `?email_verified=false`. Any other value for `email_verified` returns 400. When omitted, profiles are returned regardless of verification status.

Optionally filter with `?search=<term>` — case-insensitive substring match, applied at the database query level (not in-memory). For `vendor`, matches business name, address, description, email, phone, vendor type, categories, or locations. For `agent`, matches address, locations, name, email, or phone. For `admin`, matches name, email, or phone. Empty/whitespace-only `search` is treated as no filter.

---

#### `GET /get-profile-details-by-id/:profileId?role=vendor|agent`

Returns everything saved so far for a single vendor or agent profile, based on the `role` query param. `profileId` is the `vendor_profiles.id` or `agent_profiles.id` (not a `users.id`), matching the given role. `role=admin` or an invalid/missing role returns 400.

For `role=vendor`, the response includes business details, service details (vendor type + categories), pricing details, work gallery, and bank details. Sections that haven't been completed yet return an empty array (`pricing_details`, `work_gallery`, `vendor_categories`, `service_locations`) or `null` (`vendor_type`, `bank_details`).

**Response (`role=vendor`):**

```json
{
  "statusCode": 200,
  "data": {
    "id": 5,
    "user_id": 2,
    "business_name": "Perfect Events Co.",
    "description": "Full-service event planning",
    "address": "456 Business Park, Delhi",
    "phone_number": "9123456789",
    "email": "vendor@example.com",
    "profile_step": 4,
    "profile_completed": false,
    "vendor_type": { "id": 1, "name": "Photography" },
    "service_locations": [
      { "id": 1, "name": "Delhi" },
      { "id": 2, "name": "Mumbai" }
    ],
    "vendor_categories": [{ "id": 1, "name": "Wedding Photography" }],
    "pricing_details": [{ "id": 1, "pricing_type": "per_hour", "amount": 500 }],
    "work_gallery": [{ "id": 1, "image_url": "https://bucket.s3.amazonaws.com/image1.jpg" }],
    "bank_details": {
      "id": 1,
      "bank_name": "HDFC Bank",
      "account_holder_name": "Perfect Events Co.",
      "account_number": "123456789012",
      "ifsc_code": "HDFC0001234",
      "branch_name": "Connaught Place",
      "upi_id": "vendor@upi",
      "contact_number": "9123456789"
    }
  },
  "message": "Profile details fetched successfully",
  "success": true
}
```

For `role=agent`, the response is a smaller shape — agents don't have business/service/pricing/gallery details, just an address, service locations, and bank details.

**Response (`role=agent`):**

```json
{
  "statusCode": 200,
  "data": {
    "id": 3,
    "user_id": 4,
    "address": "123 Main Street, Mumbai",
    "profile_step": 2,
    "profile_completed": true,
    "service_locations": [{ "id": 1, "name": "Mumbai" }],
    "bank_details": {
      "id": 2,
      "bank_name": "State Bank of India",
      "account_holder_name": "John Doe",
      "account_number": "1234567890",
      "ifsc_code": "SBIN0001234",
      "branch_name": "Mumbai Main",
      "upi_id": "john@upi",
      "contact_number": "9876543210"
    }
  },
  "message": "Profile details fetched successfully",
  "success": true
}
```

---

#### `PATCH /approve-user-profile/:userId`

Marks the user identified by `userId` (a `users.id`) as email-verified, setting `email_verified` to `true`. Returns 404 if the user doesn't exist, 409 if `email_verified` is already `true`, 400 if `userId` isn't numeric.

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "id": 2,
    "email_verified": true
  },
  "message": "User profile approved successfully",
  "success": true
}
```

---

## Upload Endpoints

**Prefix:** `/api/v1/upload`  
**Auth:** Required

### `POST /images`

Upload images to S3.

**Content-Type:** `multipart/form-data`

| Field    | Type   | Required | Rules                                                   |
| -------- | ------ | -------- | ------------------------------------------------------- |
| `images` | file[] | Yes      | Up to 10 files; jpeg, png, webp, gif; max 5 MB per file |
| `folder` | string | No       | S3 folder name; defaults to `"Development_s3"`          |

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Images uploaded successfully",
  "data": {
    "urls": ["https://bucket.s3.amazonaws.com/Development_s3/image1.jpg"]
  }
}
```

---

## Agent Client Flow Endpoints

**Prefix:** `/api/v1/agent-clients`  
**Auth:** Required. **Role required:** `AGENT` or `ADMIN`.

Lets an agent create clients, create events for those clients, browse and assign approved vendors to an event, and confirm the event with a payment receipt. Each step is its own save — clients, events, and vendor selections can be created/edited independently and in any order except where noted.

Clients and events are scoped to the agent that owns them (`agent_profile_id`). **Admins have unrestricted cross-agent access**: `GET`/`PATCH`/vendor-selection/confirm endpoints operate on any agent's data, and `POST` (create) endpoints require an extra `agent_id` field (the target agent's `user_id`) in the body since admin has no `AgentProfile` of their own. Agents never send `agent_id` — it's inferred from their JWT and any value they send is ignored.

An event has a `status` that gates the flow: `draft` → `vendor_selected` (after at least one vendor is saved) → `confirmed` (after the receipt is uploaded and confirm is called). Editing an event's core fields or its vendor selection is blocked once `status` is `confirmed`.

### `GET /clients`

Entry point. Returns the caller's clients (all agents' clients for admin), each with its events nested, each event with its selected vendors nested.

**Response `data`:**

```json
[
  {
    "id": 1,
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "9876543210",
    "address": "12 MG Road, Bangalore",
    "location": { "id": 3, "name": "Bangalore" },
    "events": [
      {
        "id": 5,
        "event_name": "Priya's Wedding",
        "event_priority": "high",
        "estimated_budget": 500000,
        "preferred_date": "2026-12-10",
        "status": "vendor_selected",
        "total_amount": 85000,
        "vendors": [
          { "vendor_profile_id": 9, "business_name": "Grand Caterers", "pricing_type": "per_event", "amount": 85000 }
        ]
      }
    ]
  }
]
```

---

### `POST /clients`

Step 1: create a client.

**Body (JSON):**

| Field         | Type   | Required                | Rules                                              |
| ------------- | ------ | ------------------------ | --------------------------------------------------- |
| `agent_id`    | number | Admin only               | Positive integer; the owning agent's `user_id`      |
| `name`        | string | Yes                      | 1–150 characters                                    |
| `email`       | string | No                       | Valid email address                                 |
| `phone`       | string | Yes                      | 10-digit Indian number (starts with 6–9)             |
| `address`     | string | Yes                      | 1–500 characters (single free-text field)            |
| `location_id` | number | Yes                      | Positive integer, must reference an active location  |

---

### `PATCH /clients/:clientId`

Edit a client. Same body fields as create, all optional (at least one required), no `agent_id`.

---

### `POST /clients/:clientId/events`

Step 2: create an event for a client.

**Body (JSON):**

| Field               | Type   | Required | Rules                                  |
| ------------------- | ------ | -------- | --------------------------------------- |
| `event_name`        | string | Yes      | 1–150 characters                        |
| `event_priority`    | string | Yes      | One of `low`, `moderate`, `high`        |
| `estimated_budget`  | number | Yes      | Positive number                         |
| `preferred_date`    | string | Yes      | ISO date (`YYYY-MM-DD`)                 |
| `additional_notes`  | string | No       | Up to 2000 characters                   |

---

### `PATCH /events/:eventId`

Edit an event's core fields. Same body fields as create, all optional (at least one required). 400s if the event is already `confirmed`.

---

### `GET /events`

List events filtered by status, scoped to the caller (all agents' events for admin). Response shape matches `GET /events/:eventId/preview` per item (an array of `{ client, event, vendors }` objects).

**Query params:**

| Param    | Required | Notes                                                                                          |
| -------- | -------- | ------------------------------------------------------------------------------------------------ |
| `status` | No       | Comma-separated list of `draft`, `vendor_selected`, `confirmed`. Omitted → all statuses. Unrecognized value → 400. |

**Example:** `GET /events?status=draft,vendor_selected`

---

### `GET /vendors/search`

Step 3a: browse approved vendors available for an event's date.

**Query params:**

| Param                 | Required | Notes                                                                 |
| ---------------------- | -------- | ---------------------------------------------------------------------- |
| `location_id`          | Yes      | Used for ranking only — matching vendors are sorted first, never excluded |
| `date`                 | Yes      | ISO date; vendors with a blocked `VendorUnavailability` row on this date are excluded |
| `vendor_type_id`       | No       | Filters candidates to this vendor type                                |
| `vendor_category_id`   | No       | Filters candidates to vendors offering this category                  |

Only vendors with `profile_completed = true` and `email_verified = true` are returned. Each result includes business details, vendor type/categories, and all of the vendor's pricing options (`per_hour`/`per_day`/`per_event`).

---

### `PUT /events/:eventId/vendors`

Step 3b: save (or replace) the event's vendor selection. Re-validates every vendor server-side (still approved, still available on the event's `preferred_date`, offers the chosen `pricing_type`), recalculates and saves `total_amount`, and advances `status` to `vendor_selected` (or back to `draft` if `selections` is empty).

**Body (JSON):**

| Field        | Type  | Required | Rules                                                         |
| ------------ | ----- | -------- | --------------------------------------------------------------- |
| `selections` | array | Yes      | `{ vendor_profile_id: number, pricing_type: "per_hour"\|"per_day"\|"per_event" }[]`; may be empty to clear all vendors |

---

### `GET /events/:eventId/preview`

Step 3c: aggregated view of the client, the event (including `total_amount`), and all selected vendors.

---

### `PATCH /events/:eventId/confirm`

Step 4: upload the payment receipt (via `POST /api/v1/upload/images` first, then pass the returned URL here) and confirm the event. Requires `status = vendor_selected`; sets `status = confirmed` and `confirmed_at`.

**Body (JSON):**

| Field                  | Type   | Required | Rules      |
| ----------------------- | ------ | -------- | ----------- |
| `payment_receipt_url`   | string | Yes      | Valid URL   |

---

## Response Format

All API responses follow a consistent structure via `ApiResponse`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Description of the result",
  "data": {}
}
```

**Error responses:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error message",
  "errors": []
}
```

Common status codes:

| Code | Meaning                  |
| ---- | ------------------------ |
| 200  | Success                  |
| 201  | Created                  |
| 400  | Bad request / validation |
| 401  | Unauthorized             |
| 404  | Route not found          |
| 500  | Internal server error    |

---

## Rate Limiting

| Scope                              | Limit                 |
| ---------------------------------- | --------------------- |
| All `/api/*` routes                | 100 requests / 15 min |
| `POST /api/v1/auth/admin-login`    | 5 attempts / 15 min   |
| `POST /api/v1/auth/register-admin` | 5 attempts / 15 min   |

Failed login attempts count toward the limit; successful logins do not.

---

## Unwired Validators

The following Joi schemas exist in `src/validators/auth.validator.ts` but are **not yet connected to any route**:

| Schema                   | Body fields                                                |
| ------------------------ | ---------------------------------------------------------- |
| `updateProfileSchema`    | `first_name`, `last_name`, `phone` (at least one required) |
| `changePasswordSchema`   | `old_password`, `new_password`, `confirm_password`         |
| `resetPasswordSchema`    | `token`, `new_password`, `confirm_password`                |
| `updateUserStatusSchema` | `status` (`active` \| `inactive` \| `suspended`)           |

These may be added in future releases.

---

## Quick Reference

```
GET    /
GET    /health
GET    /api/v1

POST   /api/v1/auth/register-admin
POST   /api/v1/auth/admin-login
POST   /api/v1/auth/admin-logout
POST   /api/v1/auth/register-vendor
POST   /api/v1/auth/vendor-login
POST   /api/v1/auth/vendor-logout
POST   /api/v1/auth/register-agent
POST   /api/v1/auth/agent-login
POST   /api/v1/auth/agent-logout

POST   /api/v1/config/create-location          [Auth]
GET    /api/v1/config/get-locations            [Auth]
POST   /api/v1/config/create-vendor-type       [Auth]
GET    /api/v1/config/get-vendor-types         [Auth]
POST   /api/v1/config/create-vendor-category   [Auth]
GET    /api/v1/config/get-vendor-catogories-by-vendor-type-id/:vendor_type_id  [Auth]

POST   /api/v1/profile/agent/create-agent-profile                    [Auth]
POST   /api/v1/profile/agent/bank-details/create-bank-details        [Auth + AGENT]

POST   /api/v1/profile/vendor/create-vendor-profile                  [Auth]
POST   /api/v1/profile/vendor/create-service-details                 [Auth]
POST   /api/v1/profile/vendor/create-pricing-details                 [Auth]
POST   /api/v1/profile/vendor/upload-work-gallery                    [Auth]
POST   /api/v1/profile/vendor/bank-details/create-bank-details       [Auth + VENDOR]
POST   /api/v1/profile/vendor/add-unavailability                     [Auth]
GET    /api/v1/profile/vendor/get-unavailability-by-id/:userId       [Auth]
GET    /api/v1/profile/vendor/get-my-bookings                        [Auth + VENDOR]

GET    /api/v1/profile/general/get-profile-details                          [Auth ]
GET    /api/v1/profile/general/get-profile-details-by-id/:profileId         [Auth ]
PATCH  /api/v1/profile/general/approve-user-profile/:userId                 [Auth ]

POST   /api/v1/upload/images                   [Auth, multipart]

GET    /api/v1/agent-clients/clients                          [Auth + AGENT|ADMIN]
POST   /api/v1/agent-clients/clients                          [Auth + AGENT|ADMIN]
PATCH  /api/v1/agent-clients/clients/:clientId                [Auth + AGENT|ADMIN]
POST   /api/v1/agent-clients/clients/:clientId/events         [Auth + AGENT|ADMIN]
PATCH  /api/v1/agent-clients/events/:eventId                  [Auth + AGENT|ADMIN]
GET    /api/v1/agent-clients/events                           [Auth + AGENT|ADMIN]
GET    /api/v1/agent-clients/vendors/search                   [Auth + AGENT|ADMIN]
PUT    /api/v1/agent-clients/events/:eventId/vendors          [Auth + AGENT|ADMIN]
GET    /api/v1/agent-clients/events/:eventId/preview          [Auth + AGENT|ADMIN]
PATCH  /api/v1/agent-clients/events/:eventId/confirm          [Auth + AGENT|ADMIN]
```
