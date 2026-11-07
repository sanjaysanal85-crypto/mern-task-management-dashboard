# TaskPulse Documentation

Welcome to the **TaskPulse** project documentation.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [REST API Reference](#rest-api-reference)
3. [Database Models](#database-models)
4. [Frontend Component Guide](#frontend-component-guide)
5. [Development & Deployment](#development--deployment)

---

## Architecture Overview

TaskPulse is built on the **MERN** stack:
- **MongoDB**: Database store using Mongoose schemas. Features intelligent automatic fallback to `mongodb-memory-server` in development mode if no local MongoDB instance is active.
- **Express.js**: Node.js web server handling REST endpoints, JSON parsing, CORS, error handling, and audit logging middleware. Runs on port `5001`.
- **React 18**: Client UI built with Vite, CSS Glassmorphic design tokens, and Lucide icons. Runs on port `3000`.
- **Node.js**: Server runtime.

---

## REST API Reference

### Tasks (`/api/tasks`)
- `GET /api/tasks` - Fetch all tasks (Supports query parameters: `search`, `status`, `priority`, `projectId`, `sortBy`).
- `GET /api/tasks/:id` - Fetch single task by ID.
- `POST /api/tasks` - Create a new task.
- `PUT /api/tasks/:id` - Update existing task metadata.
- `PATCH /api/tasks/:id/status` - Move task to new status (Kanban column drop).
- `PATCH /api/tasks/:id/subtasks/:subtaskId` - Toggle subtask completion status.
- `DELETE /api/tasks/:id` - Delete a task.

### Projects (`/api/projects`)
- `GET /api/projects` - Fetch all projects with aggregated task counts.
- `POST /api/projects` - Create a new project category.
- `DELETE /api/projects/:id` - Delete project category.

### Analytics & System (`/api/stats`, `/api/activities`, `/api/seed`)
- `GET /api/stats` - Fetch aggregate summary statistics (totals, completion rate, overdue count).
- `GET /api/activities` - Fetch system audit event stream.
- `DELETE /api/activities` - Clear audit event logs.
- `POST /api/seed` - Reset and seed initial sample dataset.

---

## Database Models

### Task Schema
- `title` (String, required)
- `description` (String)
- `status` (Enum: `todo`, `in_progress`, `review`, `completed`)
- `priority` (Enum: `low`, `medium`, `high`, `urgent`)
- `dueDate` (Date)
- `projectId` (ObjectId ref `Project`)
- `tags` (Array of Strings)
- `subtasks` (Array of `{ text, completed }`)
- `assignee` (`{ name, avatar, role }`)

### Project Schema
- `name` (String, required)
- `description` (String)
- `color` (String, hex color)
- `icon` (String)

### Activity Schema
- `action` (String, required)
- `taskTitle` (String)
- `details` (String)
- `type` (Enum: `create`, `update`, `status`, `delete`, `subtask`)
