import { BrowserRouter, Route, Routes } from "react-router-dom";
import '../index.css';
import "../config/firebase-config";

import Login from './login/Login';
import Register from './register/Register';
import Quiz from './quiz/Quiz';
import Qwiz from './Qwiz';
import CheckAuth from "../controllers/CheckAuth";
import { AuthProvider } from "../contexts/authContext/page";
import Header from "@/src/Components/Header"
import Footer from "@/src/Components/Footer";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={
            <CheckAuth>
              <Qwiz />
            </CheckAuth>
          } />
        </Routes>
      </BrowserRouter>
      <Footer/ >
    </AuthProvider>
  );
}

export default App;
