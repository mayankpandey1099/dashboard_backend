# Click Game Dashboard Backend

This is the backend for the Click Game Dashboard, a real-time web application where players click bananas to earn points, and admins manage users. The backend is built with Node.js, Express, Socket.IO, and MongoDB (using Mongoose), with JWT for authentication and bcrypt for password hashing. It supports user login, real-time updates via socket events, and admin actions like blocking, unblocking, deleting, updating user.

## Features
- **User Authentication**: Secure login with username/password using JWT tokens.
- **Real-Time Communication**: Socket.IO handles events for banana clicks, active users, rankings, user status.
- **Admin User Blocking**: Admins can block users, edit, delete, unblock user.
- **MongoDB Storage**: Manages user data with fields for `_id`, `username`, `isActive`, `isBlocked`, `role`, and `bananaCount`.
- **CORS Support**: Configured for the frontend at `process.env.CORS_ORIGIN`.

## Prerequisites
- **Node.js**
- **MongoDB**
- **npm**

## Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd click-game-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory with the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/click-game
   JWT_SECRET=your_jwt_secret_key
   ```
   - `PORT`: Server port (default: 5000).
   - `MONGODB_URI`: MongoDB connection string.
   - `JWT_SECRET`: A secure key for signing JWT tokens.

4. **Start MongoDB**
   - Ensure MongoDB is running locally (`mongod`) or connect to a MongoDB Atlas cluster.
   - Create a database named `click-game` (or as specified in `MONGODB_URI`).

5. **Run the Server**
   ```bash
   npm start
   ```
   The server will start at `http://localhost:5000`. You should see:
   ```
   Server running on port 5000
   ```

## Project Structure

```
click-game-backend/
├── src/
│   ├── models/                  # Mongoose schemas
│   │   └── User.ts             # User schema (_id, username, isActive, isBlocked, role, bananaCount)
│   ├── config/                 # Configuration files
│   │   └── db.ts               # MongoDB connection setup
│   ├── controllers/            # Request handlers
│   │   ├── authController.ts   # Authentication controller (login)
│   │   └── userController.ts   # User management controller (block user)
│   ├── routes/                 # Express route handlers
│   │   ├── authRoutes.ts       # Authentication routes (/auth/login)
│   │   └── userRoutes.ts       # User management routes (/users/:id/block)
│   ├── services/               # Business logic
│   │   ├── authServices.ts     # Authentication service
│   │   ├── socketServices.ts   # Socket.IO service
│   │   └── userServices.ts     # User management service
│   ├── utils/                  # Utility files
│   │   └── Types.ts            # TypeScript interfaces
│   ├── middlewares/            # Express middleware
│   │   └── Auth.ts             # Authentication middleware (JWT validation)
│   └── index.ts                # Main server file (Express, Socket.IO setup)
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

- **models/User.ts**: Defines the Mongoose schema for users.
- **routes/authRoute.ts**: Handles login endpoint.
- **routes/userRoute.ts**: Handles update, delete, block, unblock user.
- **index.ts**: Initializes Express, Socket.IO, MongoDB connection, and socket event handlers.

## API Endpoints

### POST /auth/login
Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response** (200):
  ```json
  {
    "status": 200,
    "message": "Login successful",
    "data": {
      "token": "jwt_token",
      "user": {
        "_id": "string",
        "username": "string",
        "role": "player|admin",
      }
    }
  }
  ```
- **Errors**:
  - 401: Invalid username or password.
  - 500: Server error.

### PUT /users/:id/block
Blocks a user (admin only), marking them as `isBlocked: true` and `isActive: false`.
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Request Body**: Empty
- **Response** (200):
  ```json
  {
    "status": 200,
    "message": "User blocked"
  }
  ```
- **Errors**:
  - 403: Requester is not an admin.
  - 404: User not found.
  - 500: Server error.

## Socket.IO Events

### Emitted by Server
- **bananaCount**: `{ bananaCount: number }`
  - Sent when a user clicks the banana, updating their count.
- **activeUsers**: `[{ _id: string, username: string, isActive: boolean, isBlocked: boolean, role: string, bananaCount: number }]`
  - List of non-blocked users, updated on connect/disconnect or block.
- **ranking**: `[{ _id: string, username: string, bananaCount: number }]`
  - Ordered list of users by `bananaCount`.
- **userStatus**: `{ id: string, isActive: boolean }`
  - Updates a user's active status on connect/disconnect or block.

### Listened by Server
- **bananaClick**: Triggered by a user clicking the banana, increments `bananaCount`.

## Dependencies
- **express**: Web framework for API routes.
- **socket.io**: Real-time bidirectional communication.
- **mongoose**: MongoDB object modeling.
- **jsonwebtoken**: JWT for authentication.
- **bcryptjs**: Password hashing for secure login.
- **cors**: Enables CORS for frontend communication.
- **dotenv**: Loads environment variables from `.env`.

Install with:
```bash
npm install express socket.io mongoose jsonwebtoken bcryptjs cors dotenv
```

## Usage

1. **Start the Backend**
   ```bash
   npm start
   ```
   The server listens on `http://localhost:5000`.

2. **Connect Frontend**
   - Ensure the frontend (running at `http://localhost:5173`) uses the correct backend URL (`http://localhost:5000`).
   - Login via `/sign-in` to obtain a JWT token, which is used for socket authentication.

3. **Test Socket Events**
   - Connect as a player, click the banana, and verify `bananaCount` updates.
   - Connect as an admin, block a user, and confirm the user is logged out.

4. **Monitor Logs**
   - Check server logs for:
     - MongoDB connection status.
     - Socket connections (`User connected: <id>`).
     - Event emissions (`Emitting userBlocked: ...`).

## Troubleshooting

- **MongoDB Connection Fails**:
  - Verify `MONGODB_URI` is correct and MongoDB is running.
  - Check network access for MongoDB Atlas.
- **Socket.IO Connection Errors**:
  - Ensure CORS is set to `http://localhost:5173`.
  - Verify JWT token is sent in `socket.handshake.auth.token`.
- **Login Fails**:
  - Confirm user exists in MongoDB and password is hashed with bcrypt.
  - Check `JWT_SECRET` matches frontend.
- **Blocking Not Working**:
  - Ensure requester has `role: admin` in JWT payload.
  - Verify user `_id` exists in database.
  - Check `userBlocked` event is emitted to the correct `userId`.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Commit changes (`git commit -m 'Add xyz feature'`).
4. Push to the branch (`git push origin feature/xyz`).
5. Open a pull request.

## License
MIT License. See `LICENSE` for details.