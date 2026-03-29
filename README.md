# VibeConnect

A modern full-stack dating/social platform connecting people across the globe. Built with **Angular 17** and **ASP.NET Core 8**, VibeConnect offers real-time messaging, member discovery, and a seamless user experience.

**Key Highlights:**
- Real-time messaging powered by SignalR
- Smart member discovery with advanced filtering
- Photo management with admin moderation
- Like/match system with notifications  
- Secure JWT-based authentication
- Fully responsive and mobile-friendly
- Docker-ready deployment

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Real-Time Communication](#real-time-communication)
- [Authentication & Authorization](#authentication--authorization)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- **User Registration & Login** — Secure account creation with ASP.NET Core Identity and JWT token authentication.
- **Member Profiles** — Rich user profiles with introduction, interests, city/country, and multiple photos.
- **Photo Upload & Moderation** — Cloudinary-backed image upload with an admin approval workflow before photos go live.
- **Like System** — Toggle likes on other members; view who you liked and who liked you with paginated lists.
- **Real-Time Messaging** — Instant chat powered by SignalR hubs with message threading, read receipts, and soft-delete.
- **Online Presence Tracking** — See who's online in real time via a dedicated SignalR presence hub.
- **Pagination, Filtering & Sorting** — Server-side pagination with custom HTTP headers; filter members by age, gender, and activity.
- **Admin Panel** — Role-based admin area for managing user roles and moderating uploaded photos.
- **Responsive UI** — Bootstrap 5 (Bootswatch) themed Angular SPA with toast notifications, loading spinners, and image galleries.
- **Error Handling** — Global exception middleware on the API; interceptor-based error handling on the client.
- **Unsaved Changes Guard** — Prevents accidental navigation away from the profile edit form.

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **ASP.NET Core 8** | Web API framework |
| **Entity Framework Core 8** | ORM with SQLite provider |
| **ASP.NET Core Identity** | User management, roles, passwords |
| **SignalR** | Real-time WebSocket communication |
| **AutoMapper** | Object-to-object mapping (entities ↔ DTOs) |
| **Cloudinary** | Cloud-based image storage and manipulation |
| **JWT Bearer** | Token-based authentication |
| **SQLite** | Lightweight relational database |

### Frontend

| Technology | Purpose |
|---|---|
| **Angular 17** | SPA framework (standalone components) |
| **Bootstrap 5 / Bootswatch** | Responsive styling and theming |
| **ngx-bootstrap** | Angular-native Bootstrap components (modals, pagination, tabs) |
| **SignalR Client** | Real-time hub connections |
| **ng-gallery** | Photo gallery / lightbox |
| **ng2-file-upload** | Drag-and-drop file upload |
| **ngx-toastr** | Toast notifications |
| **ngx-spinner** | Loading indicator |
| **ngx-timeago** | "5 minutes ago" style time display |

---

## Architecture Overview

```
┌────────────────────┐         ┌─────────────────────────────┐
│   Angular 17 SPA   │◄──HTTP──►   ASP.NET Core 8 Web API   │
│   (port 4200)      │         │   (port 5001 / 5000)        │
│                    │◄──WS───►│                             │
│  Services          │         │  Controllers                │
│  Guards            │         │  SignalR Hubs               │
│  Interceptors      │         │  Middleware                 │
│  Components        │         │  Repository + UoW Pattern   │
└────────────────────┘         └──────────┬──────────────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │   SQLite Database    │
                               │   (dating.db)        │
                               └─────────────────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │   Cloudinary CDN     │
                               │   (Photo Storage)    │
                               └─────────────────────┘
```

The backend follows the **Repository + Unit of Work** pattern to abstract data access. All repositories are injected through a single `IUnitOfWork` interface, ensuring atomic commits and clean separation of concerns.

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- [Angular CLI 17](https://angular.io/cli) (`npm install -g @angular/cli`)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/VIbeConnect.git
cd VIbeConnect

# Navigate to the API project
cd API

# Update appsettings.json with your Cloudinary credentials and a secure TokenKey:
# {
#   "CloudinarySettings": {
#     "CloudName": "your-cloud-name",
#     "ApiKey": "your-api-key",
#     "ApiSecret": "your-api-secret"
#   },
#   "TokenKey": "your-super-secret-token-key-at-least-64-characters-long"
# }

# Apply migrations and run
dotnet restore
dotnet run
```

The API will start at `https://localhost:5001` (or `http://localhost:5000`).  
The database (`dating.db`) is created automatically on first run, and seed data is inserted.

### Frontend Setup

```bash
# From the repo root
cd client

# Install dependencies
npm install

# Start the dev server
ng serve
```

The app will be available at `https://localhost:4200`.

### Docker Setup

The entire application can be run with Docker Compose for a consistent development and deployment experience.

```bash
# Build and start all services (API + client)
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

Services will be available at:
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:5000

**Note:** Ensure your `appsettings.json` is properly configured with Cloudinary credentials before running with Docker.

---

## Configuration

### Backend Configuration (`appsettings.json`)

Create or update `API/appsettings.json` with the following settings:

```json
{
  "CloudinarySettings": {
    "CloudName": "your-cloudinary-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  },
  "TokenKey": "your-super-secret-token-key-minimum-64-characters-for-security",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=dating.db"
  }
}
```

**Required Environment Variables:**
- `CloudName` — Your Cloudinary account cloud name (get from [Cloudinary Dashboard](https://cloudinary.com/console))
- `ApiKey` & `ApiSecret` — Cloudinary API credentials
- `TokenKey` — A secure random string for JWT token signing (at least 64 characters recommended)

### Frontend Configuration

The Angular frontend is configured in `client/src/environments/`. By default, it connects to:
- **Development:** `http://localhost:5000`
- **Production:** Your deployed backend URL

---

## Project Structure

```
VIbeConnect/
├── API/                          # ASP.NET Core backend
│   ├── Controllers/              # API endpoints
│   │   ├── AccountController     #   Register & login
│   │   ├── AdminController       #   Role management & photo moderation
│   │   ├── LikesController       #   Like / unlike members
│   │   ├── MessagesController    #   CRUD messaging
│   │   └── UsersController       #   Profile CRUD & photo management
│   ├── Data/                     # EF Core DbContext, repositories, seeding
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Entities/                 # Domain models (AppUser, Message, Photo, etc.)
│   ├── Extensions/               # Service registration & helper extensions
│   ├── Helpers/                  # AutoMapper profiles, pagination, Cloudinary config
│   ├── Interfaces/               # Repository & service contracts
│   ├── Middleware/                # Global exception handler
│   ├── Services/                 # Cloudinary photo service, JWT token service
│   └── SignalR/                  # Real-time hubs (Presence, Messaging)
│
├── client/                       # Angular 17 frontend
│   └── src/app/
│       ├── _directives/          # Custom attribute directives
│       ├── _forms/               # Reusable form components
│       ├── _guards/              # Route guards (auth, admin, unsaved changes)
│       ├── _interceptors/        # HTTP interceptors (JWT, errors, loading)
│       ├── _models/              # TypeScript interfaces
│       ├── _resolvers/           # Route data resolvers
│       ├── _services/            # Angular services (account, members, messages, etc.)
│       ├── admin/                # Admin panel components
│       ├── home/                 # Landing page
│       ├── lists/                # Liked-members lists
│       ├── members/              # Member list, detail, edit, card, messages, photo editor
│       ├── messages/             # Message inbox/outbox
│       ├── modals/               # Bootstrap modal dialogs
│       ├── nav/                  # Navigation bar
│       └── register/             # Registration form
│
└── VIbeConnect.sln               # Solution file
```

---

## API Endpoints

### Account

| Method | Route | Description |
|---|---|---|
| POST | `/api/account/register` | Register a new user |
| POST | `/api/account/login` | Login and receive JWT |

### Users

| Method | Route | Description |
|---|---|---|
| GET | `/api/users` | List members (paginated, filterable) |
| GET | `/api/users/{username}` | Get member profile |
| PUT | `/api/users` | Update current user profile |
| POST | `/api/users/add-photo` | Upload a photo |
| PUT | `/api/users/set-main-photo/{photoId}` | Set main profile photo |
| DELETE | `/api/users/delete-photo/{photoId}` | Delete a photo |

### Likes

| Method | Route | Description |
|---|---|---|
| POST | `/api/likes/{targetUserId}` | Toggle like on a user |
| GET | `/api/likes/list` | Get IDs of users you liked |
| GET | `/api/likes` | Get liked/liked-by members (paginated) |

### Messages

| Method | Route | Description |
|---|---|---|
| POST | `/api/messages` | Send a message |
| GET | `/api/messages` | Get inbox/outbox (paginated) |
| GET | `/api/messages/thread/{username}` | Get message thread with a user |
| DELETE | `/api/messages/{id}` | Soft-delete a message |

### Admin

| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/users-with-roles` | List users and their roles |
| POST | `/api/admin/edit-roles/{username}` | Assign roles to a user |
| GET | `/api/admin/photos-to-moderate` | Get unapproved photos |
| POST | `/api/admin/approve-photo/{photoId}` | Approve a photo |
| POST | `/api/admin/reject-photo/{photoId}` | Reject and delete a photo |

---

## Real-Time Communication

VibeConnect uses **two SignalR hubs**:

### Presence Hub (`/hubs/presence`)
- Broadcasts `UserIsOnline` / `UserIsOffline` events when users connect or disconnect.
- Provides a `GetOnlineUsers` list to newly connected clients.
- Tracks connections per user in an in-memory `PresenceTracker` (supports multiple tabs/devices).

### Message Hub (`/hubs/message`)
- Users join a **private group** (sorted username pair) when opening a chat.
- Messages are delivered in real time via `NewMessage` events.
- Automatically marks messages as read when the recipient is in the same group.
- Sends `NewMessageReceived` notifications to online users who are **not** in the chat.
- Tracks group membership via database-backed `Group` and `Connection` entities.

---

## Authentication & Authorization

- **JWT Bearer Tokens** — Issued on login/register, attached to every API and SignalR request via an Angular HTTP interceptor.
- **ASP.NET Core Identity** — Manages users, passwords, and roles (`Member`, `Admin`, `Moderator`).
- **Role-Based Policies**:
  - `RequireAdminRole` — Admin-only endpoints (user role management).
  - `ModeratePhotoRole` — Admin or Moderator access (photo approval/rejection).
- **SignalR Auth** — JWT tokens are passed via the `access_token` query parameter for WebSocket connections.

---

## Development Guide

### Running the Backend in Watch Mode

For auto-reload during development:

```bash
cd API
dotnet watch run
```

This watches for file changes and automatically restarts the API server.

### Running the Frontend in Watch Mode

Angular's `ng serve` already includes hot module reloading:

```bash
cd client
ng serve
```

Changes to components, services, and templates are reflected instantly in the browser.

### Debugging

**Backend (Visual Studio Code):**
1. Install the C# Dev Kit extension
2. Set breakpoints in VS Code (click margin next to line number)
3. Run `dotnet run` or use `Debug > Start Debugging`

**Frontend (Browser DevTools):**
1. Open Chrome/Edge DevTools (F12)
2. Go to **Sources** tab and set breakpoints in `.ts` files
3. Angular automatically generates source maps in development mode

### Adding New Features

**Backend (Add a new API endpoint):**
1. Create an Entity class in `API/Entities/`
2. Add DbSet to `DataContext`
3. Create a migration: `dotnet ef migrations add MigrationName`
4. Create a Repository interface in `API/Interfaces/`
5. Implement it in `API/Data/`
6. Register in `ApplicationServiceExtensions.cs`
7. Create a DTO for requests/responses
8. Add the controller logic

**Frontend (Add a new component):**
1. Generate: `ng generate component components/my-component`
2. Add the route in the routing module
3. Implement the component logic
4. Add service methods as needed

---

## Troubleshooting

### Backend Won't Start

**Error:** `Unable to bind to http://localhost:5000 on the IPv4 loopback interface.`

**Solution:** The port is already in use. Either:
- Kill the process: `lsof -i :5000` then `kill -9 <PID>` (Linux/Mac) or `netstat -ano | findstr :5000` (Windows)
- Change the port in `appsettings.json` or launch settings

### Database Issues

**Error:** `SQLite database locked`

**Solution:** 
- Close all existing connections to the database
- Delete the database file (`dating.db`) and run `dotnet run` to create a fresh one
- Make sure migrations are up to date: `dotnet ef database update`

### Cloudinary Upload Fails

**Error:** `401 Unauthorized` or photo upload hangs

**Solutions:**
- Verify `appsettings.json` has correct Cloudinary credentials
- Check that the Cloudinary account is active (not trial expired)
- Ensure API Key and Secret are correct from Cloudinary dashboard

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- The API is configured to accept requests from the Angular frontend
- Ensure backend is running before frontend tries to connect
- Check `Program.cs` for CORS configuration

### SignalR Connection Issues

**Error:** `WebSocket connection failed` or real-time messages not arriving

**Solutions:**
- Ensure WebSocket protocol is supported in your network/proxy
- Clear browser cache and refresh
- Check browser DevTools Network tab for failed WebSocket upgrade
- Verify JWT token is valid and included in SignalR connection

### Port Conflicts

**Default ports:**
- Frontend: 4200
- Backend: 5000 (HTTP) / 5001 (HTTPS)

Change ports in: - `client/angular.json` → `serve` → `options` → `port`
- `API/Properties/launchSettings.json` → `applicationUrl`

---

## License

This project is for educational and portfolio purposes.

