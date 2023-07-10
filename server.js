const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require('cors');
dotenv.config();
connectDB();
const app = express();

app.use(express.json()); 

app.use(cors({
  origin:["http://localhost:3000","https://chat-app-frontend.onrender.com"]
}))

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// --------------------------deployment------------------------------



// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // create room for the user that is accessable to him only,gets data from frontend.
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on('typing',(room)=>socket.in(room).emit("typing"));
  socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    // send the message to every user in the room except the sender himself

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) {
        return;
      }
// if the user is not the sender himself , send the msg to him in the room created by his userid.
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup",()=>{
    console.log("User Disconnected");
    socket.leave(userData._id);
  })
});
