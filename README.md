# Campaign API

A professional Node.js REST API built with Express.js, JWT authentication, and MySQL2 database for managing campaigns and channels.

## Features

- 🔐 JWT Authentication
- 📊 Campaign Management
- 🏷️ Channel Management
- 🔍 Input Validation
- 🛡️ Security Middleware
- 📝 Comprehensive Logging
- 🚀 Scalable Architecture

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL2
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env` file and configure your database settings
   - Update JWT_SECRET with a secure random string

4. Create MySQL database and run the schema:
```bash
mysql -u root -p < database/schema.sql
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (Protected)

### Campaigns
- `POST /api/v1/campaigns` - Create a new campaign (Protected)
- `GET /api/v1/campaigns` - Get all campaigns (Protected)
- `GET /api/v1/campaigns/:id` - Get campaign by ID (Protected)
- `DELETE /api/v1/campaigns/:id` - Delete campaign (Protected)

## Usage Examples

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create a campaign
```bash
curl -X POST http://localhost:3000/api/v1/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "camp_num": 12345,
    "camp_text": "Summer Sale Campaign",
    "selected_channels": ["email", "sms", "push_notification", "social_media"]
  }'
```

### 4. Get campaigns
```bash
curl -X GET http://localhost:3000/api/v1/campaigns \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Users Table
- `id` - Primary key
- `username` - User's display name
- `email` - User's email (unique)
- `password` - Hashed password
- `created_at`, `updated_at` - Timestamps

### Campaigns Table
- `id` - Primary key
- `camp_num` - Campaign number
- `camp_text` - Campaign description
- `user_id` - Foreign key to users table
- `created_at`, `updated_at` - Timestamps

### Campaign Channels Table
- `id` - Primary key
- `campaign_id` - Foreign key to campaigns table
- `channel_name` - Name of the channel
- `created_at` - Timestamp

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet
- SQL injection prevention with prepared statements

## Project Structure

```
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── campaignController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── campaignModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── campaignRoutes.js
│   └── app.js
├── database/
│   └── schema.sql
├── server.js
└── package.json
```

## Environment Variables

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=campaign_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
API_VERSION=v1
```

## License

MIT