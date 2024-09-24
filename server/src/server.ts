import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cors from "cors";
const app = express();
const server = http.createServer(app);
 
interface IMessage {
  date: number;
  message: string;
  toWhom: string;
  from: string;
}

const JWT_SECRET = "your_jwt_secret"; // Секрет для JWT
app.use(cors());
app.use(express.json());
const contacts: { [key: string]: string } = {};
const addContacts: { [key: string]: string[] } = {};
const messageRooms: { [key: string]: IMessage[] } = {};

app.post("/user/add/contacts", (req, res) => {
  const { whoAdded, whoAdds } = req.body;
  if (addContacts[whoAdded] === undefined) {
    addContacts[whoAdded] = [];
  }
  if (addContacts[whoAdds] === undefined) {
    addContacts[whoAdds] = [];
  }
  addContacts[whoAdds].push(whoAdded);
  addContacts[whoAdded].push(whoAdded);
  return res.json("ok");
});
app.post("/user/get/contacts", (req, res) => {
  const { id } = req.body;
  if (addContacts[id] === undefined) {
    return res.json([]);
  }
  return res.json(addContacts[id]);
});

app.post("/register", async (req, res) => {
  const { username } = req.body;
  contacts[username] = username;
  res.status(201).send("User registered");
});
app.get("/users", async (_, res) => {
  return res.json(contacts);
});

app.post("/login", async (req, res) => {
  const { username } = req.body;
  const user = contacts[username];
  if (user) {
    const token = jwt.sign({ username }, JWT_SECRET);
    contacts[username] = username;
    return res.json({ token });
  }

  res.status(401).send("Invalid credentials");
});
app.post("/user/get/messages", (req, res) => {
  const id = req.body.id;
  if (id === undefined) {
    return res.status(400).json("key id body is empty");
  }
  const rooms = messageRooms[id];
  if (rooms) {
    return res.json(rooms);
  } else {
    return res.json([]);
  }
});
app.post("/user/send/messages", (req, res) => {
  const { whom, from, message } = req.body;
  if (whom === undefined && from === undefined && message === undefined) {
    return res.status(400).json("body is not valid");
  }
  if (messageRooms[whom] === undefined) {
    messageRooms[whom] = [];
  }
  if (messageRooms[from] === undefined) {
    messageRooms[from] = [];
  }
  console.log(messageRooms);
  messageRooms[whom].push({
    message: message,
    from: from,
    toWhom: whom,
    date: new Date().getTime(),
  });
  messageRooms[from].push({
    message: message,
    from: from,
    toWhom: whom,
    date: new Date().getTime(),
  });
  return res.status(200).json("message write");
});
app.get("/", (req, res) => {
  res.send("Chat server is running");
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
