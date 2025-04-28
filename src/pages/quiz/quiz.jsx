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
      <div className="flex w-full max-w-sm items-center space-x-2 font-bold">

        <Button variant="destructive" className={"absolute right-5 top-20 text-amber-100 h-15 w-15 "} type="button">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>

        <div className="top-[300px] left-1/2 transform -translate-x-1/2"> 
          <img className="flex" src="\logo.png" alt="Logo" />
        </div>

        <Input
          className={"text-black"}
          placeholder="Quiz Kodunu Girin"
          value={code}
          onChange={handleInputChange}
          style={{ border: '4px solid black' }}
        />
        <Button
          variant="destructive"
          className={"text-amber-100 h-12 w-25"}
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