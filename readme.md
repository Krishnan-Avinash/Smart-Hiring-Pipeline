# Smart Hiring Pipeline

This is a full stack recruitment automation system built using **React.js (Vite)** for frontend and **Spring Boot** for backend.  
The system automates resume screening, candidate ranking, and hiring pipeline movement while retaining human decision control.

---
## ER Diagram

<p align="center">
  <img src="ER_Diagram.jfif" alt="ER Diagram" width="700">
</p>

## Key Features

- Role based authentication (Admin, Recruiter, Candidate)
- Resume based candidate profiling
- Automated candidate ranking
- Recruiter & candidate dashboards
- Secure JWT authentication
- RESTful API architecture
- Scalable database design

---

## Tech Stack

### Frontend
- React.js (Vite)
- Axios
- React Router

### Backend
- Spring Boot
- Spring Security (JWT)
- JPA / Hibernate
- MySQL / PostgreSQL

---
## Project Structure

```
Smart-Hiring-Pipeline

├── backend              # Spring Boot backend service
│   └── demo              # Main Spring Boot application module
│       ├── src           # Source code
│       ├── pom.xml       # Maven configuration
│       └── mvnw          # Maven wrapper
│
├── frontend             # React Vite frontend (to be added)
│
├── ER_Diagram.jfif       # Database ER diagram
├── README.md            # Project documentation
└── .gitignore           # Git ignored files
```

## **API Reference**

## Authentication APIs

### Find User By Email
`GET /user/findUserByEmail/{email}`

#### Response:
```
{
  "userId": 1,
  "userName": "",
  "email": "",
  "password": "",
  "role": "",
  "isActive": true,
  "createdAt": "",
  "updatedAt": ""
}
```
### Create User
`POST /user/createUser`

#### Request Body:
```
{
  "userName": "raj",
  "email": "raj@gmail.com",
  "password": "raj",
  "role": "RECRUITER"
}
```
>Role can be: `ADMIN`, `RECRUITER`, `CANDIDATE`

#### Response:
`201 Created`

### Login User
```POST /auth/login```

#### Request Body:
```
{
  "email": "raj@gmail.com",
  "password": "raj"
}
```
#### Response:
```
{
  "token": "JWT_TOKEN",
  "userId": 3,
  "role": "RECRUITER"
}
```
## User APIs

### Find User By Id
`GET /user/findUserById/{id}`

#### Response:
```
{
  "userId": 3,
  "userName": "raj",
  "email": "raj@gmail.com",
  "password": "encrypted",
  "role": "RECRUITER",
  "isActive": true,
  "createdAt": "2026-01-13T12:12:59",
  "updatedAt": "2026-01-13T12:12:59"
}
```
### Update Password

`PUT /user/updatePassword`

#### Request Body:
```
{
  "userId": 1,
  "password": "abc",
  "confirmPassword": "abc"
}
```
#### Response:

`Password updated successfully`

### Update Active Status

`PUT /user/updateActiveStatus/{id}`

#### Response:
`200 OK`

## Candidate APIs

### Create Candidate

`POST /candidate/createCandidate`

#### Request Body:
```
{
  "resumeUrl": "temp",
  "education": "abc",
  "experienceYears": 1,
  "profileSummary": "abc"
}
```
#### Response:
`200 OK`

### Get Own Details
`GET /candidate/getSelf`

>Bearer Token Required

#### Response:
```
{
  "candidateId": 2,
  "resumeUrl": "temp",
  "education": "abc",
  "experienceYears": 1,
  "profileSummary": "abc"
}
```
### Update Candidate Details
`PUT /candidate/updateDetails`

>Bearer Token Required

#### Request Body:
```
{
  "resumeUrl": "WOHOOOOOOO",
  "education": "abc",
  "experienceYears": 1,
  "profileSummary": "abc"
}
```
#### Response:
```
{
  "candidateId": 2,
  "resumeUrl": "WOHOOOOOOO",
  "education": "abc",
  "experienceYears": 1,
  "profileSummary": "abc"
}
```
## Recruiter APIs

### Create Recruiter
`POST /recruiter/createNewRecruiter`

#### Request Body:
```
{
  "designation": "temp",
  "email": "abc"
}
```
#### Response:
`200 OK`

### Get Recruiter Self

`GET /recruiter/getSelf`

>Bearer Token Required

#### Response:
```
{
  "recruiterId": 1,
  "userId": 3,
  "designation": "WOHOOOOOOOO",
  "email": "abc",
  "companyId": null
}
```
### Update Recruiter Self
`PUT /recruiter/updateSelf`

> Bearer Token Required

#### Request Body:
```
{
  "designation": "NEW DATA",
  "email": "NEW DATA"
}
```
#### Response:
`200 OK`

