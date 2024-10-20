# QuizMaster Interactive Quiz App

**QuizMaster** is an interactive quiz platform designed to enhance learning through custom quizzes, teacher analytics, and gamification. The platform allows users to sign up as either teachers or students, offering different dashboards for each role to manage quizzes, track progress, and engage with gamified learning.

---

## Table of Contents
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage Guidelines](#usage-guidelines)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Custom Quiz Creation**: Teachers can create, edit, and delete quizzes.
- **Student Progress Tracking**: Teachers can view detailed analytics about their students' quiz performance.
- **Gamification**: Students can engage in quizzes with rewards, challenges, and performance-based achievements.
- **Role-Based Dashboards**: Separate dashboards for teachers and students to suit their respective roles.
- **Responsive Design**: Optimized for mobile and desktop devices.
- **Authentication**: Secure user authentication for teachers and students with role-based access control.

---

## Project Architecture

The project is built using a **React frontend** and a **Node.js/Express backend** with MongoDB and Redis for data persistence and session management.

### High-Level Architecture:

1. **Frontend**:
   - Built using **React** for the dynamic rendering of the user interface.
   - Different role-based components (e.g., `TeacherDashboard`, `StudentDashboard`).
   - CSS for responsive design and custom styling.

2. **Backend**:
   - Built with **Node.js** and **Express** for handling API requests.
   - **MongoDB** is used for storing quiz and user data.
   - **Redis** is used for session management and caching.
   
3. **APIs**:
   - RESTful API for CRUD operations related to users, quizzes, and results.
   - Secure authentication endpoints for login and role-specific dashboard access.

---

## Tech Stack

### Frontend:
- **React.js** (JavaScript Library)
- **HTML5**, **CSS3**
- **React Router** for routing
- **Axios** for HTTP requests

### Backend:
- **Node.js** (JavaScript runtime)
- **Express.js** (Web framework)
- **MongoDB** (Database)
- **Redis** (Cache and session storage)

### Others:
- **Git** for version control
- **npm** (Node Package Manager) for package management

---

## Setup Instructions

### Prerequisites
- **Node.js** and **npm** should be installed on your system.
- **MongoDB** (local or cloud-based instance)
- **Redis** server for session storage (optional but recommended)

### Steps to Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/gameli-lab/quiz-app.git
   cd quiz-app
   ```

2. **Install Dependencies**
   Navigate to both `frontend` and `backend` directories and install dependencies:
   ```bash
   # For frontend
   cd frontend
   npm install

   # For backend
   cd ../backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory and specify the required environment variables for MongoDB and Redis. Example:
   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/quiz-app
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   ```

4. **Run the Backend**
   Start the backend server:
   ```bash
   npm start
   ```

5. **Run the Frontend**
   Navigate to the `frontend` directory and start the React development server:
   ```bash
   cd frontend
   npm start
   ```

6. **Access the App**
   Visit `http://localhost:3000` to access the app's frontend, and the backend APIs will be available at `http://localhost:5000`.

---

## Usage Guidelines

### For Teachers:
- **Create Quizzes**: Navigate to the "Create Quiz" section on your dashboard and add new quizzes.
- **Manage Quizzes**: View, edit, or delete quizzes in the "Manage Quizzes" section.
- **Track Students' Progress**: Access detailed analytics in the "Analytics" section.

### For Students:
- **Take Quizzes**: Select a subject from the dashboard and attempt quizzes.
- **View Results**: Check your quiz results in the "Results" section of your dashboard.

---

## Folder Structure

```
quizmaster-app/
├── backend/
│   ├── controllers/         # API controllers
│   ├── models/              # MongoDB models (User, Quiz, Results)
│   ├── routes/              # API routes
│   ├── utils/               # Utilities (configurations, middleware)
│   ├── app.js               # Main server file
│   └── package.json         # Backend dependencies
│
├── frontend/
│   ├── public/              # Static files (images, icons)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Pages (Home, Dashboard)
│   │   ├── App.js           # Main React app file
│   │   └── index.js         # Entry point for React
│   └── package.json         # Frontend dependencies
│
└── README.md                # Project documentation
```

---

## API Endpoints

### Authentication
- `POST /users`: Register a new user.
- `GET /connect`: Login a user with Basic Auth.
- `GET /disconnect`: Logout a user by invalidating the session.

### Quiz Management
- `POST /quizzes`: Create a new quiz (teacher-only).
- `GET /quizzes`: Fetch all quizzes.
- `GET /quizzes/:id`: Get details of a specific quiz.
- `PUT /quizzes/:id`: Edit a specific quiz (teacher-only).
- `DELETE /quizzes/:id`: Delete a quiz (teacher-only).

### User Management
- `GET /users/me`: Get current user profile.
- `PUT /users/me`: Update user profile.
- `DELETE /users/me`: Delete user profile (admin-only).

---

## Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any issues or inquiries, please contact us at [btorfu@gmail.com].

---