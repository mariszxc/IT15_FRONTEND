# API Documentation

## Overview
This document describes the backend API consumed by the School Dashboard frontend.

- API Base URL (frontend config):
  - `VITE_API_URL` (preferred), or
  - `VITE_BACKEND_URL + /api`, or
  - `/api` fallback
- Default local backend URL used by weather fallback logic: `http://127.0.0.1:8000/api`
- Content type: `application/json`
- Auth: Bearer token via `Authorization: Bearer <token>`

---

## Authentication

### POST /api/register
Registers a new user account.

**Request Body**
```json
{
  "name": "Juan Dela Cruz",
  "email": "juan@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

**Success Response (201/200)**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "Juan Dela Cruz",
    "email": "juan@example.com"
  },
  "token": "<bearer_token>"
}
```

---

### POST /api/login
Logs in a user and returns a token.

**Request Body**
```json
{
  "email": "student@example.com",
  "password": "password"
}
```

**Success Response (200)**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Student User",
    "email": "student@example.com"
  },
  "token": "<bearer_token>"
}
```

**Error Response (401)**
```json
{
  "message": "Invalid credentials"
}
```

---

### GET /api/me
Returns the authenticated user.

**Headers**
- `Authorization: Bearer <token>`

**Success Response (200)**
```json
{
  "data": {
    "id": 1,
    "name": "Student User",
    "email": "student@example.com"
  }
}
```

---

### POST /api/logout
Revokes the current user token.

**Headers**
- `Authorization: Bearer <token>`

**Success Response (200)**
```json
{
  "message": "Logged out successfully"
}
```

---

## Dashboard

### GET /api/dashboard
Returns dashboard metrics used for charts/cards.

**Headers**
- `Authorization: Bearer <token>`

**Success Response (200)**
```json
{
  "data": {
    "monthly_enrollment": [
      { "month": "Jan", "count": 120 }
    ],
    "course_distribution": [
      { "course": "BSIT", "count": 220 }
    ],
    "attendance": {
      "present": 92,
      "absent": 8
    }
  }
}
```

---

## Students

### GET /api/students
Returns a list of students.

**Headers**
- `Authorization: Bearer <token>`

**Query Parameters**
- `per_page` (number, optional) — frontend currently uses `500`

**Success Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "student_number": "123456",
      "first_name": "Maris",
      "last_name": "Bautista",
      "email": "maris@example.com"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 500,
    "total": 500
  }
}
```

Notes:
- Frontend accepts either paginated shape (`{ data: [...] }`) or plain array (`[...]`).

---

### GET /api/students/{id}
Returns one student profile.

**Headers**
- `Authorization: Bearer <token>`

**Success Response (200)**
```json
{
  "data": {
    "id": 1,
    "student_number": "123456",
    "first_name": "Maris",
    "last_name": "Bautista",
    "email": "maris@example.com"
  }
}
```

---

### POST /api/students
Creates a new student record.

**Headers**
- `Authorization: Bearer <token>`

**Request Body**
```json
{
  "first_name": "Maris",
  "last_name": "Bautista",
  "email": "maris@example.com"
}
```

**Success Response (201/200)**
```json
{
  "message": "Student created successfully",
  "data": {
    "id": 501,
    "student_number": "654321",
    "first_name": "Maris",
    "last_name": "Bautista",
    "email": "maris@example.com"
  }
}
```

**Validation Error (422)**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

---

## Courses

### GET /api/courses
Returns course offerings for Program/Course pages.

**Headers**
- `Authorization: Bearer <token>`

**Query Parameters**
- `per_page` (number, optional) — frontend currently uses `100`

**Success Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "code": "BSIT",
      "name": "BS Information Technology",
      "department": "College of Computing",
      "credits": 152,
      "description": "Program description"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 100,
    "total": 20
  }
}
```

---

## School Days (Academic Calendar)

### GET /api/school-days
Returns school-day calendar rows used in the Academic Calendar modal.

**Headers**
- `Authorization: Bearer <token>`

**Query Parameters**
- `page` (number, optional)
- `per_page` (number, optional) — frontend currently uses `300`

**Success Response (200)**
```json
{
  "data": [
    {
      "date": "2026-03-15",
      "is_school_day": true,
      "is_holiday": false,
      "attendance_count": 450,
      "attendance_rate": 96.8,
      "event": "Midterm Exams"
    }
  ],
  "meta": {
    "total": 220
  }
}
```

---

## Enrollments

### GET /api/enrollments
Returns enrollment records for the authenticated user.

**Headers**
- `Authorization: Bearer <token>`

**Query Parameters**
- `per_page` (number, optional)
- `student_id` (number, optional)
- `student_number` (string, optional)

**Success Response (200)**
```json
{
  "data": [
    {
      "id": "1",
      "studentId": "501",
      "studentNumber": "000501",
      "studentName": "Maris Bautista",
      "batch": "March 2026",
      "submittedAt": "2026-03-15T11:15:00.000000Z",
      "submitted": true,
      "pending": false,
      "approved": true,
      "enrollmentStatus": "Enrolled"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 1
  }
}
```

---

### POST /api/enrollments
Creates or updates (upsert) an enrollment record for a student.

**Headers**
- `Authorization: Bearer <token>`

**Request Body**
```json
{
  "studentId": 501,
  "studentNumber": "000501",
  "studentName": "Maris Bautista",
  "batch": "March 2026",
  "submittedAt": "2026-03-15T11:15:00.000000Z",
  "submitted": true,
  "pending": false,
  "approved": true,
  "enrollmentStatus": "Enrolled"
}
```

**Success Response (200)**
```json
{
  "data": {
    "id": "1",
    "studentId": "501",
    "studentNumber": "000501",
    "studentName": "Maris Bautista",
    "batch": "March 2026",
    "submittedAt": "2026-03-15T11:15:00.000000Z",
    "submitted": true,
    "pending": false,
    "approved": true,
    "enrollmentStatus": "Enrolled"
  }
}
```

---

## Activities

### GET /api/activities
Returns activity logs for the authenticated user.

**Headers**
- `Authorization: Bearer <token>`

**Query Parameters**
- `per_page` (number, optional)

**Success Response (200)**
```json
{
  "data": [
    {
      "id": "12",
      "actor": {
        "id": 1,
        "name": "Student User",
        "email": "student@example.com"
      },
      "action": "Enroll",
      "entity": "Student",
      "description": "Enrolled student Maris Bautista.",
      "metadata": {
        "studentId": 501,
        "studentNumber": "000501",
        "batch": "March 2026"
      },
      "timestamp": "2026-03-15T11:15:00.000000Z"
    }
  ]
}
```

---

### POST /api/activities
Stores a user activity log entry.

**Headers**
- `Authorization: Bearer <token>`

**Request Body**
```json
{
  "action": "Enroll",
  "entity": "Student",
  "description": "Enrolled student Maris Bautista.",
  "metadata": {
    "studentId": 501,
    "studentNumber": "000501",
    "batch": "March 2026"
  },
  "timestamp": "2026-03-15T11:15:00.000000Z"
}
```

**Success Response (200)**
```json
{
  "data": {
    "id": "12",
    "action": "Enroll",
    "entity": "Student",
    "description": "Enrolled student Maris Bautista.",
    "metadata": {
      "studentId": 501,
      "studentNumber": "000501",
      "batch": "March 2026"
    },
    "timestamp": "2026-03-15T11:15:00.000000Z"
  }
}
```

---

## Weather

### GET /api/weather/current
Returns current weather for the selected coordinates.

**Query Parameters**
- `latitude` (number)
- `longitude` (number)

Frontend may also send `lat`/`lon`; client normalizes these to `latitude`/`longitude`.

**Success Response (200)**
```json
{
  "location": {
    "name": "Tagum City"
  },
  "current": {
    "temperature": 31,
    "humidity": 78,
    "wind_speed": 12,
    "weather": {
      "description": "Partly cloudy",
      "icon": "cloud-sun"
    }
  }
}
```

---

### GET /api/weather/forecast
Returns forecast data (used for forecast panel and weather bundle).

**Query Parameters**
- `latitude` (number)
- `longitude` (number)

**Success Response (200)**
```json
{
  "location": {
    "name": "Tagum City"
  },
  "current": {
    "temperature": 31,
    "humidity": 78,
    "wind_speed": 12,
    "weather": {
      "description": "Partly cloudy",
      "icon": "cloud-sun"
    }
  },
  "forecast": [
    {
      "date": "2026-03-16",
      "temperature_min": 25,
      "temperature_max": 32,
      "weather": {
        "description": "Light rain",
        "icon": "cloud-rain"
      }
    }
  ]
}
```

---

## Additional REST Resources (Backend)
These resources are listed in the project README and are expected to support standard REST actions:

- `/api/programs`
- `/api/subjects`

### Database Persistence Notes
- Enrollment records are stored in table: `enrollment_records`.
- Activity logs are stored in table: `activity_logs`.
- Both are tied to authenticated API users and persist in MySQL (`bautista_backend`).

Typical methods:
- `GET /api/{resource}`
- `POST /api/{resource}`
- `GET /api/{resource}/{id}`
- `PUT|PATCH /api/{resource}/{id}`
- `DELETE /api/{resource}/{id}`

---

## Common Error Format
```json
{
  "message": "Human-readable error message",
  "errors": {
    "field_name": ["Validation error details"]
  }
}
```

## Common Status Codes
- `200` OK
- `201` Created
- `401` Unauthorized
- `404` Not Found
- `422` Validation Error
- `429` Too Many Requests (weather endpoints may be throttled)
- `500` Server Error
