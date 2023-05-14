// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')

// CREATE OUR SERVER
const app = express()

const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')


// Retreive our env variables
dotenv.config()
const PORT = process.env.PORT || 4000;


// SETUP THE MIDDLEWARE

app.use(express.urlencoded({limit: '2000kb', extended: true, parameterLimit:50000}));
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next()
});

const whitelist = [process.env.FRONTEND_URL, process.env.BACKEND_URL];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

app.use(cors(corsOptions));

// app.use(cors({
//   origin: '*',
//   credentials: true
// }))

app.use(cookieParser())

app.use(session({
  name: 'token',
  keys: [process.env.JWT_SECRET],
  cookie: {
    secure: false,
    httpOnly: false,
    domain: process.env.FRONTEND_URL,
  }
}))

app.use(express.json({limit:'50mb'}))

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const mapsRouter = require('./routes/maps-router')
app.use('/api', mapsRouter)
const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)
// INITIALIZE OUR DATABASE OBJECT
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))


// Socket IO stuff
const server = require('http').createServer(app);
const { Server } = require('socket.io')
const io = new Server({
    server,
    cors:{ 
      origin: '*'
    }
}).listen(server)

io.on('connection', (socket) => {
  console.log('User connected')
  // // const roomId = socket.handshake.query['roomId']
  // // console.log('RoomId:', roomId)

  // socket.join(roomId)
  socket.emit('awesome')
  
  // socket.broadcast.emit("user connected", {
  //   userID: socket.id,
  //   username: socket.username,
  // });
  socket.on('join room', async (roomName) => {
      socket.join(roomName);
      console.log(socket.id, " joined room ", roomName)
      const allConnectedUsers = await io.in(roomName).fetchSockets()
      const connectedSockets = Object.keys(allConnectedUsers)
      console.log(connectedSockets)
      socket.emit('Successfully joined room',connectedSockets)
      socket.to(roomName).emit('other user joined', connectedSockets)
  })

  socket.on('disconnect', (socket) => {
    console.log(socket.id, ' disconnected')
  })

  socket.on('edit geoJSON', async (roomName, delta)=>{
    console.log("received edit geoJSON", roomName);
    socket.in(roomName).emit('emit delta', delta);
    console.log("emitted to ", roomName)
  })



})


io.on('disconnect', (socket) => {
  console.log('User disconnected')
})
// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   console.log("Connected user ", username)
  
//   socket.username = username;
//   next();
// });

// Logging when a room was created // Should occur when a user clicks on a shared map to edit
// io.of("/").adapter.on("create-room", (room) => {
//   console.log(`room ${room} was created`);
// });




server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`))


// :3 // Testing backend // Really cool
