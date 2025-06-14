# Interactive Quiz Platform

A real-time, multiplayer quiz platform similar to Kahoot!, built with modern web technologies. This project enables educators and students to create and participate in interactive quiz sessions with live scoring and multimedia support.

## 🎯 Project Overview

This platform was developed as a full-semester project by a three-person team, focusing on creating an engaging educational tool that combines modern web development practices with real-time interaction capabilities.

### Key Features

- **JWT-based Authentication**: Secure user registration and login system using Firebase Authentication
- **Quiz Creation**: Educators can create multiple-choice quizzes with multimedia support
- **Real-time Game Sessions**: Multi-participant live quiz sessions with Socket.io
- **Answer Submission**: Timed answer submission with countdown timer
- **Dynamic Leaderboard**: Real-time score tracking and leaderboard updates
- **Responsive Design**: Compatible with both mobile and desktop devices

### Additional Features

- **Multimedia Support**: Integration of images and videos in quiz questions
- **Background Music**: Ambient music during quiz sessions with toggle controls
- **Sound Effects**: Audio feedback for correct/incorrect answers and countdown timer
- **Admin Panel**: Game host dashboard for managing participants and quiz sessions

## 🚀 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - Database for storing users, quizzes, and results
- **JWT** - JSON Web Tokens for authentication

### Frontend
- **React** - User interface library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN** - UI component library
- **Axios** - HTTP client for API requests

### Additional Tools
- **Firebase** - Authentication services
- **Various multimedia libraries** - For audio/video support

## 📁 Project Structure

```
├── backend/
│   ├── controllers/          # Business logic controllers
│   ├── middleware/           # Authentication and validation middleware
│   ├── models/              # Database models
│   ├── routes/              # API route definitions
│   ├── socket/              # Socket.io event handlers
│   └── server.js            # Main server file
├── src/
│   ├── components/          # React components
│   │   └── ui/             # UI components
│   ├── contexts/           # React Context providers
│   ├── controllers/        # API request handlers
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   └── main.jsx            # Application entry point
├── public/                 # Static assets (audio, images)
└── test/                   # Test files
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Firebase project for authentication

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/MustafaAykut77/quiz-platfrom
cd quiz-platfrom
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file:
```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_MEASUREMENT_ID=your_measurement_id
VITE_SERVER_URL=http://localhost:5000
MONGO_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Install frontend dependencies:
```bash
cd ../
npm install
```

2. Start the development server:
```bash
npm run dev
```

## 🎮 How to Use

### For Educators (Quiz Creators)

1. **Register/Login**: Create an account or log in to the platform
2. **Create Quiz**: Use the quiz creation interface to:
   - Add quiz title and category
   - Create multiple-choice questions
   - Add multimedia content (images/videos)
   - Set correct answers
3. **Host Session**: Start a live quiz session and share the game code
4. **Monitor Progress**: Use the admin panel to see participants and control the game flow

### For Students (Participants)

1. **Join Session**: Enter the game code provided by the educator
2. **Answer Questions**: Submit answers within the time limit
3. **View Results**: See real-time leaderboard and final scores
4. **Enjoy Interactive Elements**: Experience background music and sound effects

## 🔧 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

### Quiz Management
- `GET /api/quiz` - Get all quizzes
- `POST /api/quiz` - Create new quiz
- `PUT /api/quiz/:id` - Update quiz
- `DELETE /api/quiz/:id` - Delete quiz

### Game Sessions
- `POST /api/game/start` - Start new game session
- `POST /api/game/join` - Join existing session
- `POST /api/game/answer` - Submit answer

## 🎵 Multimedia Features

### Audio Support
- Background music during quiz sessions
- Sound effects for:
  - Correct answers
  - Incorrect answers
  - Countdown timer
  - Game events

### Visual Support
- Image integration in questions
- Video embedding capability
- Responsive media display

## 🔄 Real-time Features

The platform uses Socket.io for real-time communication:

- **Live participant tracking**
- **Synchronized question display**
- **Real-time answer submission**
- **Dynamic leaderboard updates**
- **Instant result broadcasting**

## 🧪 Testing

Run the test suite:
```bash
cd test
npm test
```

Tests include:
- Socket.io connectivity
- API endpoint functionality
- Authentication flow
- Real-time event handling

## 👥 Team Members

- **Mustafa AYKUT**
- **Eren KÖSE** 
- **Eren GÜRELİ**

The team followed agile methodology principles with regular meetings and weekly checkpoints.

## 🎯 Learning Outcomes

Through this project, the team gained experience in:
- **Full-stack web development**
- **Real-time application development**
- **Modern web technology integration**
- **Team collaboration and project management**
- **User experience design**
- **Database management**
- **Authentication and security**

## 🔗 Links

- **Repository**: [GitHub](https://github.com/MustafaAykut77/quiz-platfrom)
- **Demo Video**: [YouTube](coming-soon)

## 📄 License

This project is developed as an educational assignment. Please check with the contributors before using it for commercial purposes.

## 🤝 Contributing

This project was developed as a university assignment. If you'd like to contribute or use it as a reference, please contact the team members.

## 📞 Support

For questions or support, please contact the development team through the GitHub repository issues section.
