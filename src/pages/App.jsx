import { BrowserRouter, Route, Routes } from "react-router-dom";
import '../index.css';
import "../config/firebase-config";

import Login from './login/Login';
import Register from './register/Register';
import QuizCode from './quiz/QuizCode';
import Quiz from './quiz/Quiz';
import Qwiz from './Qwiz';
import CheckAuth from "../controllers/CheckAuth";
import { AuthProvider } from "../contexts/authContext/page";
import Layout from '@/src/Components/Layout';
import CreateProfile from './register/CreateProfile';
import QuizCreator from './quiz/CreateQuiz';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<QuizCode />} />
            <Route path="/createProfile" element={<CreateProfile />} />
            <Route path="/createQuiz" element={<QuizCreator />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={
              <CheckAuth>
                <Qwiz />
              </CheckAuth>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;