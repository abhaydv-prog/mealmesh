# MealMesh

A backend system for hyperlocal food-rescue coordination — connecting food donors, volunteers, and NGOs in real time.

## Overview

MealMesh lets donors (restaurants, individuals, event organizers) post surplus food as listings. Volunteers discover nearby listings using geospatial search and claim pickups, with live status updates pushed to all parties via WebSocket subscriptions. Built as a production-shaped GraphQL API, not a CRUD demo.

## Features

- **JWT Authentication** with role-based access control (Donor, Volunteer, NGO)
- **GraphQL API** (NestJS + Apollo) — queries, mutations, and real-time subscriptions
- **Geospatial search** — PostgreSQL + PostGIS powered "nearby listings" query using `ST_DWithin`
- **Pickup lifecycle management** — claim → in-transit → delivered, with database-enforced guard logic preventing double-claiming
- **Real-time updates** — WebSocket subscriptions (`graphql-ws`) push live pickup status changes without polling
- **Containerized** — full application and database run in Docker via `docker-compose`

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | NestJS |
| API | GraphQL (Apollo Server, code-first) |
| Database | PostgreSQL + PostGIS |
| ORM | TypeORM |
| Auth | JWT, Passport, bcrypt |
| Real-time | WebSocket subscriptions (graphql-ws) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |

## Architecture

```
                    Client (GraphQL Playground)
                              │
                              ▼
              ┌───────────────────────────────┐
              │        Docker container        │
              │                                 │
              │   ┌─────────────────────┐       │
              │   │      NestJS app      │       │
              │   │   Auth · GraphQL     │       │
              │   │      WebSocket       │       │
              │   └──────────┬──────────┘       │
              │              │ TypeORM           │
              │   ┌──────────▼──────────┐       │
              │   │      PostgreSQL      │       │
              │   │       + PostGIS      │       │
              │   └─────────────────────┘       │
              │                                 │
              └───────────────────────────────┘
```

## Getting Started

### Prerequisites
- Node.js 20+
- Docker Desktop

### Setup

```bash
git clone https://github.com/abhaydv-prog/mealmesh.git
cd mealmesh
npm install
```

Create a `.env` file:
```
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=mealmesh_user
DB_PASSWORD=
DB_NAME=mealmesh
JWT_SECRET=your_secret_here
```

Start the database:
```bash
docker compose up -d postgres
```

Run the app:
```bash
npm run start:dev
```

GraphQL Playground available at `http://localhost:3000/graphql`

### Running fully in Docker

```bash
docker compose up -d --build
```

### Health check

```
GET http://localhost:3000/health
```

## Example Usage

**Register a user:**
```graphql
mutation {
  register(input: {
    name: "Jane Doe"
    email: "jane@example.com"
    password: "securepass"
    role: DONOR
  }) {
    accessToken
    user { id name role }
  }
}
```

**Find nearby listings:**
```graphql
query {
  nearbyListings(latitude: 28.6139, longitude: 77.2090, radiusKm: 5) {
    id
    title
    status
  }
}
```

**Accept a pickup:**
```graphql
mutation {
  acceptPickup(listingId: "listing-id-here") {
    id
    status
  }
}
```

**Subscribe to live pickup updates:**
```graphql
subscription {
  pickupStatusUpdated {
    id
    status
  }
}
```

## Project Status

Core backend is complete and tested: authentication, geospatial search, pickup lifecycle, and real-time subscriptions are all functional and containerized with Docker. AWS deployment and a frontend client are planned next.

## License

MIT