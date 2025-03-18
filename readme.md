# Project Name: LEMO BACKEND

## Overview

LEMO APP BACKEND

Currently in pprogress:
- school connect api

 Complete: 
 - user authentication with JWT and Google OAuth, and supports user roles such as super-admin, admin, school_manager, and student.

## Features

- User authentication with email/password and Google OAuth
- JWT-based session management
- Role-based access control with user roles: super-admin, admin, school_manager, student
- RESTful API for user management
- Token refresh mechanism for Google OAuth

## Technologies Used

- Node.js
- Express
- MongoDB & Mongoose
- JWT for authentication
- Passport.js for Google OAuth
- bcrypt for password hashing

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   ```

2. Navigate to the project directory:
   ```bash
   cd yourproject
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables. Create a `.env` file in the root directory and add the following:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- **GET /users/me**: Retrieve the authenticated user's information.
- **PATCH /users/me**: Update the authenticated user's information.
- **POST /auth/signup**: Register a new user.
- **POST /auth/login**: Log in an existing user.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact [your email](mailto:youremail@example.com).
