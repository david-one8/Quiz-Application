# QuizNova

QuizNova is a full-stack online quiz management system built with Next.js App Router, MongoDB, NextAuth, and Tailwind CSS. It supports administrator bootstrap, teacher and student role management, quiz creation, question management, quiz attempts, and result tracking.

This README is written so a new user can clone the repository, configure it, and run the project locally from scratch.

## Features

- First-run admin bootstrap flow
- Role-based access for `ADMIN`, `TEACHER`, and `STUDENT`
- Admin user management dashboard
- Teacher/admin quiz creation and publishing
- Question bank management
- Student registration and login
- Quiz attempt flow with timed submission
- Attempt history and results dashboard
- MongoDB-backed persistence

## Tech Stack

- Next.js 16
- React 19
- NextAuth
- MongoDB with Mongoose
- Tailwind CSS 4
- Zod + React Hook Form

## Prerequisites

Before running the app, install:

- Node.js 20+  
  Node.js 22 was used during local verification.
- npm
- MongoDB

You can use either:

- A local MongoDB server, for example `mongodb://127.0.0.1:27017/quiznova`
- MongoDB Atlas with a cloud connection string

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd online-quiz-management-system
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a local `.env` file from `.env.example`.

```bash
cp .env.example .env
```

If you are on PowerShell and `cp` does not behave as expected, use:

```powershell
Copy-Item .env.example .env
```

Update the values in `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/quiznova
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_long_random_secret
```

### Environment Variable Notes

- `MONGODB_URI`  
  MongoDB connection string for your local or cloud database.

- `NEXTAUTH_URL`  
  The base URL of the running app. For local development this must match the exact origin you are using, for example `http://localhost:3000`.

- `NEXTAUTH_SECRET`  
  A secret used to sign sessions and auth tokens.

Generate a strong secret with one of the following:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

or in PowerShell:

```powershell
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 4. Start the Development Server

```bash
npm run dev
```

Open:

[http://localhost:3000](http://localhost:3000)

## 5. Complete First-Time Setup

If the database does not yet contain an admin account, the app will automatically redirect to:

- `/setup`

Use that page to create the first `ADMIN` user.

Important:

- This setup flow is available only until the first admin is created.
- After setup is complete, the app switches to normal login/register behavior.
- Visiting `/setup` after initialization redirects to `/dashboard` for signed-in users and `/login` for signed-out users.

## 6. First-Run Workflow

After the first admin account is created:

1. Sign in as the admin.
2. Open `Dashboard -> Users`.
3. Create teacher and student accounts as needed.
4. Teachers or admins can create quizzes and questions.
5. Students can register normally or be created by an admin.
6. Published quizzes appear on the public quizzes page.

## Roles and Access

### Admin

- Create and manage users
- Create and manage quizzes
- Create and manage questions
- View attempts and results
- Access all dashboard areas

### Teacher

- Create and manage their own quizzes
- Add and manage questions for their quizzes
- View attempts/results related to their quizzes

### Student

- Register and log in
- Browse published quizzes
- Attempt published quizzes
- View their own attempts and results

## Available Scripts

```bash
npm run dev
```

Runs the app in development mode.

```bash
npm run build
```

Builds the app for production.

```bash
npm run start
```

Runs the production build locally.

```bash
npm run lint
```

Runs ESLint.

## Running a Production Build Locally

To test the production version on your machine:

```bash
npm run build
npm run start
```

Then open:

[http://localhost:3000](http://localhost:3000)

## Project Structure

High-level structure:

```text
app/
  (auth)/               Login and registration pages
  api/                  Route handlers / backend APIs
  dashboard/            Protected dashboard pages
  quizzes/              Public quiz browsing and attempt pages
  setup/                First-run admin bootstrap page

components/
  auth/                 Login/register client forms
  layout/               Sidebar, header, and mobile nav
  quiz/                 Quiz and question UI
  setup/                Setup form
  ui/                   Reusable UI primitives
  users/                Admin user-management UI

lib/
  auth.js               NextAuth configuration
  bootstrap.js          App initialization and setup helpers
  db.js                 DB access abstraction
  mongodb.js            Mongoose connection helper
  models.js             Mongoose models
  session.js            Session and role helpers
  validations.js        Zod schemas
```

## Important Product Behavior

### No Mock Seed Data

This project is intended to run without built-in mock data. On a fresh database:

- the app redirects to `/setup`
- you create the first admin manually
- admins create other users from the dashboard
- quizzes and questions are created through the UI

### Public Registration

Public registration creates `STUDENT` accounts only.

If you want a `TEACHER` or another `ADMIN`, create them from:

- `Dashboard -> Users`

## Troubleshooting

### The app keeps redirecting to `/setup`

This means no admin account exists in the connected MongoDB database.

Fix:

- open `/setup`
- create the first admin account

### I cannot log in after cloning the project

Check:

- MongoDB is running and reachable
- `.env` exists
- `NEXTAUTH_URL` is correct
- `NEXTAUTH_SECRET` is set
- at least one user exists in the database

### MongoDB connection errors

Verify:

- your `MONGODB_URI`
- local MongoDB service is running
- Atlas IP allowlist and credentials are correct

### Auth/session issues

If auth behaves unexpectedly:

- confirm `NEXTAUTH_URL` matches the exact local origin you are using
- set a valid `NEXTAUTH_SECRET`
- restart the dev server after changing `.env`

### Dashboard pages say access denied

Role-based access is enforced. Check that the logged-in user has the correct role:

- `ADMIN` for user management
- `ADMIN` or `TEACHER` for quiz/question management
- `STUDENT` for public quiz-taking flows

## Local Setup Checklist

Use this quick checklist when onboarding a new machine:

- Clone repository
- Run `npm install`
- Copy `.env.example` to `.env`
- Set `MONGODB_URI`
- Set `NEXTAUTH_URL`
- Set `NEXTAUTH_SECRET`
- Run `npm run dev`
- Open `http://localhost:3000`
- Create the first admin at `/setup`
- Log in and start using the dashboard

## Notes for Contributors

- Dynamic routes in this project use Next.js 16 behavior, so route `params` must be awaited where applicable.
- The app uses server components for many read-heavy pages and route handlers for write actions and protected operations.
- Role enforcement is centralized through session helpers and route/page guards.

## License

Add your preferred license here if you plan to distribute the project publicly.
