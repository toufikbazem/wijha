## Context

I am building a job search web application using:

- Frontend: React ( TypeScript)
- State management: Redux
- Backend: Node.js + Express

Requirements:

1. Protect Routes (Frontend)

Implement route protection for:
Authenticated routes (only accessible when user is logged in)
Non-authenticated routes (like login/register pages should not be accessible when logged in)

Redirect:
Unauthenticated users → /login
Authenticated users trying to access public routes → /dashboard

2. Session Handling & Auto Logout
   Check both:
   Redux state
   Authentication token stored in cookies
   If the token is missing or expired:
   Automatically log out the user
   Clear Redux state
   Remove any stored tokens/cookies
   Redirect to /login

## Before Coding

First, explain:

- Analyze the current project structure.
- Detailed explanation of approach, do not write any code.
