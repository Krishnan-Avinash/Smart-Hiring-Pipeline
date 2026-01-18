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


## Company APIs
### Create Company
`POST /company/createCompany`

>Bearer Token Required

#### Request Body:
```
{
  "name": "COMPANY 2",
  "description": "abc",
  "websiteUrl": "abab",
  "industry": "abc"
}

```
#### Response:
`200 ok`

### Get Company By Id
`GET /company/getCompanyById/{id}`

Bearer Token Required

#### Response:
```
{
  "companyId": 1,
  "name": "",
  "description": "",
  "websiteUrl": "",
  "industry": "",
  "createdBy": {
    "userId": 3,
    "userName": "",
    "email": "@.com",
    "password": "",
    "role": "RECRUITER",
    "isActive": true,
    "createdAt": "2026-01-13T12:12:59.147194",
    "updatedAt": "2026-01-13T12:12:59.147194"
  },
  "createdAt": "2026-01-13T23:00:11.740013",
  "updatedAt": "2026-01-13T23:34:50.205705",
  "active": true
}
```

### Update Company
`PUT /company/updateCompany/{id}`

>Bearer Token Required

#### Request Body:
```
{
  "name": "",
  "description": "",
  "websiteUrl": "",
  "industry": ""
}
```
#### Response:
`200 OK`

### Get Jobs Of Company
`GET /company/getJobsOfCompany/{id}/jobs`

>Bearer Token Required

#### Response:
`Array of jobId`, `title`, `location` and `status`

## Job APIs

### Create New Job

`POST /jobs/createNewJob`

>Bearer Token Required

#### Request Body:
```
{
  "title": "",
  "description": "",
  "location": "",
  "employmentType": "",
  "experienceMin": 0,
  "experienceMax": 0,
  "requiredSkills": "",
  "prioritySkills": "",
  "status": ""
}
```
#### Response:

- `Job created successfully`
- `Recruiter must be associated with a company to create a job`


### Get Job By Id

`GET /jobs/getJobById/{jobId}`

>Bearer Token Required

#### Response:
```
{
  "jobId": ,
  "company": {
    "companyId": ,
    "name": "",
    "description": "",
    "websiteUrl": "",
    "industry": "",
    "createdBy": {
      "userId": ,
      "userName": "",
      "email": "",
      "password": "",
      "role": "RECRUITER",
      "isActive": true,
      "createdAt": "",
      "updatedAt": ""
    },
    "createdAt": "",
    "updatedAt": "",
    "active": true
  },
  "createdBy": {
    "userId": ,
    "userName": "",
    "email": "",
    "password": "",
    "role": "RECRUITER",
    "isActive": true,
    "createdAt": "",
    "updatedAt": ""
  },
  "title": "",
  "description": "",
  "location": "",
  "employmentType": "",
  "experienceMin": ,
  "experienceMax": ,
  "requiredSkills": "",
  "prioritySkills": "",
  "status": "",
  "createdAt": "",
  "updatedAt": ""
}
```
OR

- `Job not found`

### Update Job By Id

`PUT /jobs/updateJobById/{jobId}`

>Bearer Token Required

#### Request Body:
```
{
  "title": "",
  "description": "",
  "location": "",
  "employmentType": "",
  "experienceMin": ,
  "experienceMax": ,
  "requiredSkills": "",
  "prioritySkills": "",
  "status": ""
}
```
#### Response:

- `Job updated successfully`
- `Job not found`
- `You are not authorized to update it`

#### Delete Job By Id

`DELETE /jobs/deleteJobById/{jobId}`

>Bearer Token Required

#### Response:

- `Job deleted successfully`
- `Job not found or you are not authorized to delete it`

## Application APIs
### Create New Application

`POST /application/createApplication/{jobId}`

>Bearer Token Required

#### Response:

- `Job not found`
- `Candidate profile not found`
- `Application created successfully`

### Get Application

`GET /application/getApplication/{applicationId}`

>Bearer Token Required

#### Response:
```
{
  "applicationId": ,
  "status": "",
  "name": "",
  "email": "@gmail.com",
  "resumeUrl": "",
  "finalScore": ,
  "aiScore": ,
  "keywordScore": 
}
```

#### Error Responses:
- `Application not found`
- `You are not allowed to view this application`


### Get Applications For A Job

`GET /application/getApplicationsForAJob/{jobId}`

>Bearer Token Required

#### Response:
```
[
  {
    "applicationId": ,
    "status": "",
    "name": "",
    "email": "@gmail.com",
    "resumeUrl": "",
    "finalScore": ,
    "aiScore": ,
    "keywordScore": 
  }
]
```
#### Error Responses:
- `Job not found`
- `You are not allowed to view applications for this job`

### Update Application Status

`PATCH /application/updateStatus/{applicationId}`

>Bearer Token Required

#### Request Body:
```
{
  "status": ""
}
```
#### Response:

- `Application not found`
- `You are not allowed to update this application`
- `Application status updated successfully`

## Resume Score APIs
### Create Resume Score

`POST /resumeScore/createNew/{applicationId}`

>Bearer Token Required

#### Response:

- `Recruiter is not associated with a company`
- `Application not found`
- `You are not allowed to score this application`
- `Resume scored successfully`
- `Failed to read resume file`

### Get Resume Score

`GET /resumeScore/getScore/{applicationId}`

>Bearer Token Required

#### Response:
```{
  "keywordScore": ,
  "aiScore": ,
  "finalScore": ,
  "scoredAt": ""
}
```
#### Error Responses:
- `Application not found`
- `You are not allowed to view this resume score`
- `Resume score not found`

## Health API
### Server Health Check

`GET /health`

>No Authentication Required

#### Response:
```
{
  "status": "UP"
}
```