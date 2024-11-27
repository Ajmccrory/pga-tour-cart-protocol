# Cart Management System

A modern web application for managing golf cart rentals and staff assignments.

## Features

### Cart Management
- Create, edit, and delete golf carts
- Bulk creation of multiple carts
- Real-time battery level tracking
- Automatic time management in Eastern Time
- Status tracking (Available, In-Use, Maintenance)

### Staff Management
- Manage staff members (volunteers and admins)
- Assign up to 2 staff members per cart
- Track staff assignments and cart usage

### Time Management
- Automatic checkout time setting
- Return time calculation (6 hours after checkout or end of day)
- Editable return times for in-use carts
- All times in Eastern Time zone

### Dashboard
- POS-style interface
- Filter carts by status (Available, In-Use, Maintenance)
- Quick status overview with counts
- Interactive cart cards with detailed information
- Dark/Light mode support

## Technical Details

### Frontend
- React with TypeScript
- Material-UI for components
- Real-time updates
- Responsive design
- Error handling with specific error messages
- Form validation

### Backend
- Flask Python server
- SQLAlchemy ORM
- MySQL database
- Timezone handling with pytz
- RESTful API endpoints
- Error handling middleware

## Current Status
The application is functional with:
- Complete cart CRUD operations
- Staff assignment system
- Time management system
- Status filtering
- Theme switching
- Error handling
- Data validation
- Cart usage history

## Next Steps
Potential improvements include:
- Staff scheduling
- Analytics dashboard
- Export functionality
- Mobile app version

## Setup Instructions
(TODO: Add setup instructions here)

## API Documentation
(TODO: Add API documentation here)

## Contributing
(TODO: Add contribution guidelines here)