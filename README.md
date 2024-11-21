# Cart Management System

A system for managing golf carts, tracking their status, and handling rentals.

## Features

- Cart management (create, update, delete, view)
- Person management (players, volunteers, admins)
- Cart status tracking (available, in-use, maintenance)
- Battery level monitoring
- Location tracking
- Checkout/return time management

## Tech Stack

- Frontend: React with TypeScript, Material-UI
- Backend: Flask with Python
- Database: MySQL
- Containerization: Docker

## Setup

1. Clone the repository
2. Install Docker and Docker Compose
3. Copy `.env.example` to `.env` and update the values
4. Run `docker-compose up --build`

## Development

### Frontend 
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
flask run
```

### Database

The database will be automatically initialized when running with Docker. For local development:

1. Create a MySQL database
2. Update the DATABASE_URL in .env
3. Run the SQL scripts in database/init.sql

## API Endpoints

### Carts

- GET /carts - List all carts
- POST /carts - Create a new cart
- PUT /carts/<id> - Update a cart
- DELETE /carts/<id> - Delete a cart

### Persons

- GET /persons - List all persons
- POST /persons - Create a new person
- PUT /persons/<id> - Update a person
- DELETE /persons/<id> - Delete a person