Inventory Management System

This project is a full-stack Inventory Management application featuring:
Backend: Django + Django REST Framework + JWT authentication + PostgreSQL
Frontend: React + CoreUI Template + WebSocket for real-time updates
Real-time updates: Implemented via Django Channels and WebSockets to display inventory changes without page refreshes.
The application allows users to:
Register & Login: Create an account and obtain a JWT access token.
Manage Inventory: Create, read, update, and delete inventory items.
Real-time Notifications: See updates to the inventory in real time as items are added/edited/deleted.
UI/UX: A neat and responsive interface built with CoreUI components and React.
Key Features

Authentication & Authorization:
Uses JWT authentication. Only authenticated users can create, edit, or delete items. Unauthenticated users can view the inventory.
CRUD Operations on Items:
Add new items, edit existing ones, delete items, and view details. Items are grouped by their reorder_level and displayed in accordions.
Real-time Updates:
The application uses Django Channels and a WebSocket connection to update the inventory list automatically whenever changes occur on the backend.
Password Validation & Registration:
Password validations on both register and login ensure secure credentials (8+ chars, uppercase, lowercase, digit).
Technology Stack

Backend: Django, Django REST Framework, Django Channels, PostgreSQL
Frontend: React, CoreUI React Components, WebSockets (native WebSocket API)
Auth: JWT (using djangorestframework-simplejwt)
Real-time: Django Channels (InMemory layer or Redis for production)
Prerequisites

Backend: Python 3.x, pip, virtualenv (recommended)
Database: PostgreSQL installed and a database/user created
Frontend: Node.js & npm
Getting Started

1. Backend Setup
Clone the repository:
git clone <repository-url>
cd backend-inventory-system
Create and activate a virtual environment:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:
pip install -r requirements.txt
Configure PostgreSQL in backend/settings.py:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'inventory_db',
        'USER': 'admin',
        'PASSWORD': 'adminpassword',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
Migrate and create a superuser:
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
Run the backend server:
python manage.py runserver
Backend should be accessible at: http://127.0.0.1:8000
2. Frontend Setup
Open a new terminal, go to the frontend directory:
cd ../frontend-inventory-system
npm install
npm start
Frontend will run on: http://127.0.0.1:3000 or a port defined by Vite/CoreUI.
3. Real-time Configuration
Django Channels is set up with an InMemory channel layer by default. For testing:
The WebSocket endpoint: ws://127.0.0.1:8000/ws/items/
The frontend automatically connects upon loading the dashboard page.
If you want to run multiple workers or move to production, consider installing and configuring Redis:
pip install channels_redis
And update settings.py for CHANNEL_LAYERS accordingly.
Usage

Register a new user: Navigate to http://127.0.0.1:3000/register and create a new account.
Password must meet complexity requirements.
Login: Go to http://127.0.0.1:3000/ and login with your credentials.
On successful login, a JWT token is stored locally.
View Inventory: After login, you are redirected to the Dashboard (e.g., /dashboard).
Items are grouped by their reorder_level.
Expand an accordion to see item details.
Create, Edit, Delete Items:
Use the UI buttons to create a new item, edit an existing one (not fully implemented here, but you can add navigation or a modal), or delete an item.
When an item is created/updated/deleted on the backend, the frontend receives a WebSocket event and the UI updates automatically.
API Endpoints

Authentication:
POST /api/auth/ → { "username": "...", "password": "..." } returns { "access": "<token>" }
Items (JWT Required for write operations):
GET /api/items/ → Get all items
POST /api/items/ → Create a new item (requires Authorization: Bearer <token>)
GET /api/items/:id/ → Get item details
PUT /api/items/:id/ → Update an item
DELETE /api/items/:id/ → Delete an item
Tests

Backend Tests (Example):
python manage.py test
Add tests in inventory_app/tests/ to verify models, views, and authentication.
Frontend Tests (Optional): If time allows, add Jest + React Testing Library tests in frontend-inventory-system.
Notes & Future Improvements

Real-time Auth: Currently, the WebSocket does not handle token authentication. For more secure setups, integrate JWT authentication into Channels or use secure cookies.
Permissions & Roles: If needed, implement role-based permissions to differentiate admin and normal users.
Enhancements: Add pagination, search filters, or more complex analytics on the Dashboard.
Troubleshooting

CORS Issues: Ensure CORS_ALLOW_ALL_ORIGINS = True or properly configure allowed origins in settings.py.
Database Errors: Check if PostgreSQL is running and that DATABASES config is correct.
WebSocket not connecting: Check ws://127.0.0.1:8000/ws/items/ in browser console, verify Channels setup and asgi.py configuration.
