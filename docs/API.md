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
7. [Response Format](#response-format)
8. [Rate Limiting](#rate-limiting)
9. [Unwired Validators](#unwired-validators)

---

## General

| Method | Endpoint   | Auth | Description              |
|--------|------------|------|--------------------------|
| `GET`  | `/`        | No   | Welcome message          |
| `GET`  | `/health`  | No   | Server health check      |
| `GET`  | `/api/v1`  | No   | API v1 info              |

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

| Field              | Type   | Required | Rules                                                                 |
|--------------------|--------|----------|-----------------------------------------------------------------------|
| `email`            | string | Yes      | Valid email address                                                   |
| `password`         | string | Yes      | Min 8 chars; uppercase, lowercase, digit, special char (`@$!%*?&`)    |
| `first_name`       | string | Yes      | Letters and spaces only, 1–100 chars                                  |
| `last_name`        | string | Yes      | Letters and spaces only, 1–100 chars                                  |
| `phone`            | string | Yes      | 10-digit Indian number (starts with 6–9)                              |
| `confirm_password` | string | No       | Must match `password` if provided                                     |

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
|------------|--------|----------|
| `email`    | string | Yes      |
| `password` | string | Yes      |

**Response:** Returns `user` and `token`. Sets `access_token` cookie.

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

| Field    | Type    | Required | Rules              |
|----------|---------|----------|--------------------|
| `name`   | string  | Yes      | 1–255 characters   |
| `status` | boolean | Yes      | Active/inactive    |

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

| Field                   | Type    | Required | Rules           |
|-------------------------|---------|----------|-----------------|
| `name`                  | string  | Yes      | 2–150 characters |
| `commission_percentage` | number  | Yes      | 0–100           |
| `status`                | boolean | Yes      | Active/inactive |

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

| Field            | Type    | Required | Rules              |
|------------------|---------|----------|--------------------|
| `vendor_type_id` | number  | Yes      | Positive integer   |
| `name`           | string  | Yes      | 2–150 characters   |
| `status`         | boolean | Yes      | Active/inactive    |

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
|------------------|--------|----------|------------------|
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

| Field               | Type     | Required | Rules                          |
|---------------------|----------|----------|--------------------------------|
| `user_id`           | number   | Yes      | Positive integer               |
| `address`           | string   | Yes      | 1–255 characters               |
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
|-----------------------|--------|----------|------------------|
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
|---------------------|----------|----------|------------------------------------|
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

| Field                | Type     | Required | Rules                    |
|----------------------|----------|----------|--------------------------|
| `user_id`            | number   | Yes      | Positive integer         |
| `vendor_type_id`     | number   | Yes      | Positive integer         |
| `vendor_categoryids` | number[] | Yes      | Array of category IDs    |

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

| Field             | Type   | Required | Rules                                      |
|-------------------|--------|----------|--------------------------------------------|
| `user_id`         | number | Yes      | Positive integer                           |
| `pricing_details` | array  | Yes      | Array of pricing objects (see below)       |

**Pricing object:**

| Field          | Type   | Required | Allowed values                          |
|----------------|--------|----------|-----------------------------------------|
| `pricing_type` | string | Yes      | `per_hour`, `per_day`, `per_event`      |
| `amount`       | number | Yes      | Positive number                         |

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

| Field        | Type     | Required | Rules                    |
|--------------|----------|----------|--------------------------|
| `user_id`    | number   | Yes      | Positive integer         |
| `image_urls` | string[] | Yes      | Array of valid URIs      |

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

| Field              | Type    | Required | Rules                          |
|--------------------|---------|----------|---------------------------------|
| `unavailable_date` | string  | Yes      | ISO date (`YYYY-MM-DD`)         |
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
    "unavailability": [
      { "id": 1, "unavailable_date": "2026-08-01" }
    ]
  },
  "message": "Vendor unavailability updated successfully",
  "success": true
}
```

---

#### `GET /get-unavailability-by-id/:userId`

Returns the list of unavailable dates for the vendor identified by `userId` (a `users.id`, not a `vendor_profiles.id`). Accessible to any authenticated user, not just the vendor themselves.

---

### General Profile

**Prefix:** `/api/v1/profile/general`

**Role required:** `ADMIN`

#### `GET /get-profile-details`

Returns a summary list of every completed profile for the given role (`vendor`, `agent`, or `admin`), passed as a query param: `?role=vendor`.

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
    "vendor_categories": [
      { "id": 1, "name": "Wedding Photography" }
    ],
    "pricing_details": [
      { "id": 1, "pricing_type": "per_hour", "amount": 500 }
    ],
    "work_gallery": [
      { "id": 1, "image_url": "https://bucket.s3.amazonaws.com/image1.jpg" }
    ],
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
    "service_locations": [
      { "id": 1, "name": "Mumbai" }
    ],
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

## Upload Endpoints

**Prefix:** `/api/v1/upload`  
**Auth:** Required

### `POST /images`

Upload images to S3.

**Content-Type:** `multipart/form-data`

| Field    | Type   | Required | Rules                                                        |
|----------|--------|----------|--------------------------------------------------------------|
| `images` | file[] | Yes      | Up to 10 files; jpeg, png, webp, gif; max 5 MB per file      |
| `folder` | string | No       | S3 folder name; defaults to `"Development_s3"`               |

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Images uploaded successfully",
  "data": {
    "urls": [
      "https://bucket.s3.amazonaws.com/Development_s3/image1.jpg"
    ]
  }
}
```

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

| Code | Meaning                    |
|------|----------------------------|
| 200  | Success                    |
| 201  | Created                    |
| 400  | Bad request / validation   |
| 401  | Unauthorized               |
| 404  | Route not found            |
| 500  | Internal server error      |

---

## Rate Limiting

| Scope                              | Limit                    |
|------------------------------------|--------------------------|
| All `/api/*` routes                | 100 requests / 15 min    |
| `POST /api/v1/auth/admin-login`    | 5 attempts / 15 min      |
| `POST /api/v1/auth/register-admin` | 5 attempts / 15 min      |

Failed login attempts count toward the limit; successful logins do not.

---

## Unwired Validators

The following Joi schemas exist in `src/validators/auth.validator.ts` but are **not yet connected to any route**:

| Schema                 | Body fields                                                              |
|------------------------|--------------------------------------------------------------------------|
| `updateProfileSchema`  | `first_name`, `last_name`, `phone` (at least one required)               |
| `changePasswordSchema` | `old_password`, `new_password`, `confirm_password`                       |
| `resetPasswordSchema`  | `token`, `new_password`, `confirm_password`                              |
| `updateUserStatusSchema` | `status` (`active` \| `inactive` \| `suspended`)                       |

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

GET    /api/v1/profile/general/get-profile-details                          [Auth + ADMIN]
GET    /api/v1/profile/general/get-profile-details-by-id/:profileId         [Auth + ADMIN]

POST   /api/v1/upload/images                   [Auth, multipart]
```
