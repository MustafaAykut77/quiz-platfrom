import express from "express";
const app = express();
const port = 3000;
import { Server } from 'socket.io';
const io = new Server(port, {
  cors:{
    origin: ["http://localhost:5173/"],
  }
});


io.on("connection", socket => {
    console.log(socket.id);
    socket.on("send-code", (code) => {
    console.log(code); 
    })
  })


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});