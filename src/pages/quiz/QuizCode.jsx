import { io } from "socket.io-client";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

// Component Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QuizCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleInputChange = (event) => {
    setCode(event.target.value);
  };

  const handleJoinQuiz = () => {
    navigate(`/game/${code}`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center" style={{height: 'calc(100vh - 3.5rem)'}}>
        <div className="flex justify-center"> 
            <img className="w-24 h-24" draggable="false" src="\logo.png" alt="Logo" />
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2 font-bold">
          <Input
            className={"text-black border-2"}
            placeholder="Quiz Kodunu Girin"
            value={code}
            onChange={handleInputChange}
          />
          <Button
            variant="destructive"
            className={"text-white h-12 w-25"}
            type="button"
            onClick={handleJoinQuiz}
          >
            Gir
          </Button>
        </div>
      </div>
    </>
  );
}

export default QuizCode;