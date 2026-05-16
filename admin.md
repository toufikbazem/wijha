# Admin Panel Implementation

---

# 🚨 IMPORTANT ARCHITECTURE CONSTRAINT

## Backend + Frontend Separation

- The **backend remains the SAME project** as the current job platform
- The **admin frontend is a COMPLETELY SEPARATE PROJECT**
  - Independent React application
  - Separate repository or folder
  - Communicates only via API

---

# 1. Project Analysis (MANDATORY FIRST STEP)

Analyze the existing backend project:

- Current folder structure
- Existing APIs (public + internal)
- Authentication system
- Database schema
- Role handling (if exists)

Then define:

- How to safely integrate admin features into existing backend
- Required modifications without breaking current system

---

# 2. Backend Architecture Requirements (SAME PROJECT)

You MUST extend the existing backend with:

## Rules:

- Must NOT mix with public APIs
- Must use dedicated admin middleware
- Must implement RBAC (role-based access control)
- Only admin roles can access these routes

---

# 3. Implementation Plan (STEP-BY-STEP)

Provide a clear plan:

1. Backend analysis
2. Admin role system design
3. Admin authentication system
4. Admin API architecture setup
5. Database adjustments (if required)
6. Each admin module implementation
7. Testing & security validation
8. Frontend integration contract (API documentation)

---

# 4. Frontend Admin Panel (SEPARATE PROJECT)

## IMPORTANT:

- This is a completely independent React project
- It ONLY consumes backend APIs
- No shared frontend code with main project

---

## Frontend Structure Requirements

Design a full admin UI with:

- Layout (sidebar + topbar)
- Authentication pages
- Protected routes system
- API service layer (axios/fetch wrapper)
- State management (if needed)
- follow the existing project structure

---

# 5. Admin Dashboard Section

Display:

- Total job seekers (new today)
- Total employers (new today)
- Total job posts (new today)
- Total applications (new today)
- Total subscriptions (new today)
- Total profile access (new today)

---

# 6. Job Seekers Management

## Key Concept:

Two types of profiles:

1. Registered users
2. Admin-created profiles (no account)

---

## Users List

- List job seekers
- Search + filters
- Link → detailed management page

---

## Job Seeker Management (Tabs)

### Tabs:

- Profile
- Account
- Applications
- Saved

---

### Profile Tab

- Full profile view
- Edit profile
- Change status
- Works for both registered and non-registered users

---

### Account Tab (only registered users)

- Email
- Email verification status
- Edit email/password
- Change verification state

---

### Applications Tab (only registered users)

- List applications
- Remove application

---

### Saved Tab (only registered users)

- List saved jobs
- Remove saved jobs

---

# 7. Employers Management

## Employers List

- Basic info
- Search + filters
- Link → employer details

---

## Employer Management Tabs

- Profile
- Account
- Job Posts
- Profile Access
- Subscription

---

### Profile Tab

- Company info
- Edit data
- Change status

### Job Posts Tab

- Employer job listings
- Search + filters
- Link to job details

### Profile Access Tab

- Accessed profiles list
- Search + filters
- Change access state

### Subscription Tab

- Subscription history
- Manage status

### Account Tab

- Email
- Password
- Verification status

---

# 8. Job Post Management

## List Page

- All job posts
- Search + filters
- Link to details

## Features

- Admin can create job posts

---

## Job Post Detail (Tabs)

- Job Post Info
- Applicants

---

### Job Post Info

- Edit job
- Change status

### Applicants

- List applicants
- Link to profile

---

# 9. Applications Management

- Global list of applications
- Search + filters
- View details

---

# 10. Profile Access Management

- List all profile access records
- Search + filters
- Manage access state

---

# 11. Subscription Management

## Tabs:

- Subscriptions
- Plans

---

### Subscriptions

- List subscriptions
- Search + filters
- Create subscription manually

### Plans

- Create/edit plans
- Pricing management

---

# 12. Admin Authentication (Backend)

- Secure login
- JWT/session auth
- Role validation
- Protected routes
- Logout
- Session expiration

---

# 13. Expected Deliverables

You must output:

## Backend

- Admin architecture design
- API structure
- Middleware design
- Database changes
- Full endpoint list

## Frontend (SEPARATE PROJECT)

- Folder structure
- Pages list
- Components structure
- API integration layer
- Routing system
- Auth flow

## System Design

- Full admin architecture
- Security model
- Data flow between frontend and backend

---

# ⚠️ Constraints

- Backend = same project (extend only)
- Frontend = completely separate project
- Strict API separation required
- Must use RBAC everywhere
- Must ensure scalability and pagination for large datasets

---

If anything in the current backend structure is unclear, ask clarifying questions, do not write any code.
