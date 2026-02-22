# VibeConnect

A full-stack dating/social platform built with **Angular 17** and **ASP.NET Core 8**. Users can create profiles, browse and like other members, exchange real-time messages, and upload photos — all wrapped in a responsive, modern UI.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Real-Time Communication](#real-time-communication)
- [Authentication & Authorization](#authentication--authorization)
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

## License

This project is for educational and portfolio purposes.
