import { io } from "socket.io-client";
import React, { useState } from 'react';

// Component Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const socket = io("http://localhost:3000");

const Quiz = () => {
  const [code, setCode] = useState('');

  const handleInputChange = (event) => {
    setCode(event.target.value);
  };

  const handleJoinQuiz = () => {
    socket.emit("send-code", code);
    console.log("Gönderilen Kod:", code);
  };

  return (
    <>
      <div className="flex justify-center my-4"> 
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
    </>
  );
}

export default Quiz;