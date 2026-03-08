# School Management API

A RESTful API built with **Node.js**, **Express.js**, and **MySQL** to manage school data. Users can add new schools and retrieve a list of schools sorted by proximity to a given location.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Postman Collection](#postman-collection)

---

## Features

- Add new schools with name, address, latitude, and longitude.
- List all schools sorted by distance from a user-specified location (Haversine formula).
- Input validation on all endpoints.
- Auto-creation of database and table on first run.

---

## Tech Stack

| Layer      | Technology       |
|------------|------------------|
| Runtime    | Node.js          |
| Framework  | Express.js       |
| Database   | MySQL            |
| ORM/Driver | mysql2 (promise) |

---

## Project Structure

```
school-management-api/
├── config/
│   └── db.js                  # MySQL connection pool
├── controllers/
│   └── schoolController.js    # Request handlers (addSchool, listSchools)
├── models/
│   └── schoolModel.js         # DB initialization (create database & table)
├── routes/
│   └── schoolRoutes.js        # Route definitions
├── .env                       # Environment variables (not committed)
├── .env.example               # Template for environment variables
├── .gitignore
├── index.js                   # Entry point
├── package.json
├── School_Management_API.postman_collection.json
└── README.md
```

---

## Prerequisites

- **Node.js** v16+ and npm
- **MySQL** 5.7+ running locally or on a remote server

---

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd school-management-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your MySQL credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=school_management
   DB_PORT=3306
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   The server will:
   - Create the `school_management` database if it doesn't exist.
   - Create the `schools` table if it doesn't exist.
   - Start listening on the configured port (default: 3000).

   For development with auto-reload:

   ```bash
   npm run dev
   ```

---

## API Endpoints

### 1. Add School

| Field     | Value              |
|-----------|--------------------|
| Endpoint  | `/addSchool`       |
| Method    | `POST`             |
| Content-Type | `application/json` |

**Request Body:**

```json
{
    "name": "Springfield Elementary School",
    "address": "123 Main St, Springfield, IL",
    "latitude": 39.7817,
    "longitude": -89.6501
}
```

**Success Response (201):**

```json
{
    "success": true,
    "message": "School added successfully.",
    "data": {
        "id": 1,
        "name": "Springfield Elementary School",
        "address": "123 Main St, Springfield, IL",
        "latitude": 39.7817,
        "longitude": -89.6501
    }
}
```

**Validation Error (400):**

```json
{
    "success": false,
    "errors": [
        "name is required and must be a non-empty string.",
        "latitude must be a valid number between -90 and 90."
    ]
}
```

---

### 2. List Schools

| Field     | Value              |
|-----------|--------------------|
| Endpoint  | `/listSchools`     |
| Method    | `GET`              |

**Query Parameters:**

| Param     | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| latitude  | number | Yes      | User's latitude    |
| longitude | number | Yes      | User's longitude   |

**Example Request:**

```
GET /listSchools?latitude=39.7817&longitude=-89.6501
```

**Success Response (200):**

```json
{
    "success": true,
    "count": 2,
    "data": [
        {
            "id": 1,
            "name": "Springfield Elementary School",
            "address": "123 Main St, Springfield, IL",
            "latitude": 39.7817,
            "longitude": -89.6501,
            "distance_km": 0,
            "created_at": "2026-03-07T12:00:00.000Z"
        },
        {
            "id": 2,
            "name": "Shelbyville High School",
            "address": "456 Oak Ave, Shelbyville, IL",
            "latitude": 39.4064,
            "longitude": -88.7902,
            "distance_km": 82.34,
            "created_at": "2026-03-07T12:01:00.000Z"
        }
    ]
}
```

---

## Database Schema

```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Deployment

### Option A – Railway / Render

1. Push the repo to GitHub.
2. Connect the repo to [Railway](https://railway.app) or [Render](https://render.com).
3. Add environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `PORT`) in the dashboard.
4. Deploy — the service will auto-build and start.

### Option B – AWS EC2 / VPS

1. SSH into the server and clone the repo.
2. Install Node.js and MySQL.
3. Run `npm install` and configure `.env`.
4. Use **PM2** to keep the process alive:
   ```bash
   npm install -g pm2
   pm2 start index.js --name school-api
   pm2 save
   ```

---

## Postman Collection

Import the file `School_Management_API.postman_collection.json` into Postman:

1. Open Postman → **Import** → select the JSON file.
2. Set the `baseUrl` collection variable to your host (e.g., `http://localhost:3000`).
3. Run the requests to test.

---

## License

ISC
