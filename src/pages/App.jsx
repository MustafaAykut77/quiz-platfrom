import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import '../index.css';
import "../config/firebase-config";

import Login from './login/Login';
import Register from './register/Register';
import GameCode from './quiz/GameCode';
import Quiz from './quiz/Quiz';
import Panel from './quiz/Panel';
import Qwiz from './Qwiz';
import { CheckAuthFirebase, CheckAuth } from "../controllers/CheckAuth";
import { AuthProvider } from "../contexts/authContext/page";
import Layout from '@/src/Components/Layout';
import CreateProfile from './register/CreateProfile';
import QuizCreator from './quiz/CreateQuiz';
import QuizEditor from './quiz/UpdateQuiz';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<GameCode />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />  
            <Route path="/game/:code" element={<Quiz />} />
            <Route path="/createprofile" element={
              <CheckAuthFirebase>
                <CreateProfile />
              </CheckAuthFirebase>
              } />
            <Route path="/createquiz" element={
              <CheckAuthFirebase>
                <CheckAuth>
                  <QuizCreator />
                </CheckAuth>
              </CheckAuthFirebase>
            } />
            <Route path="/quiz/:quizId" element={
              <CheckAuthFirebase>
                <CheckAuth>
                  <QuizEditor />
                </CheckAuth>
              </CheckAuthFirebase>
            } />
            <Route path="/home" element={
              <CheckAuthFirebase>
                <CheckAuth>
                  <Qwiz />
                </CheckAuth>
              </CheckAuthFirebase>
            } />
            <Route path="/panel" element={
              <CheckAuthFirebase>
                <CheckAuth>
                  <Panel />
                </CheckAuth>
              </CheckAuthFirebase>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;