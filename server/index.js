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

  socket.on('edit properties', async(roomName, featureIndex, key, value, type) =>{
    console.log("received edit properties in ", roomName);
    console.log("feature index: ", featureIndex);
    console.log("key: ", key);
    console.log("value: ", value)

    if(type==='edit'){
      //do something
      console.log("received an edit message")
      socket.in(roomName).emit('edited property', featureIndex, key, value);
    }

    else if(type==='delete'){
      console.log("received a delete message")
      socket.in(roomName).emit('deleted property', featureIndex, key);

    }

    else if(type==='add'){
      console.log('received an add message')
      socket.in(roomName).emit('added property', featureIndex, key, value);

    }
    })

    socket.on('create delete transaction', async(roomName, lat, lng, featureIndex, vertexIndex, shape, type)=>{
      console.log("create delete transaction from ", roomName)
      if(type==="delete vertex"){
        socket.in(roomName).emit('received delete vertex transaction', {
          lat: lat,
          lng: lng,
          featureIndex: featureIndex,
          vertexIndex: vertexIndex,
          shape: shape,
          type: "delete vertex"
        })
      }

      else if(type==="undo delete vertex"){
        socket.in(roomName).emit('received delete vertex transaction', {
          lat: lat,
          lng: lng,
          featureIndex: featureIndex,
          vertexIndex: vertexIndex,
          shape: shape,
          type: "undo delete vertex"
        })
      }
    })

    socket.on('create move vertex transaction', async(roomName, featureIndex, startLat, startLng, endLat, endLng, type)=>{
        if(type==="move vertex"){
          socket.in(roomName).emit('received move vertex transaction', {
            featureIndex: featureIndex,
            startLat: startLat,
            startLng: startLng,
            endLat: endLat,
            endLng: endLng,
            type: "move vertex"
          })
        }
        else if(type==="undo move vertex"){
          socket.in(roomName).emit('received move vertex transaction',{
            featureIndex: featureIndex,
            startLat: startLat,
            startLng: startLng,
            endLat: endLat,
            endLng: endLng,
            type: "undo move vertex"
          })
        }
    })

    socket.on('create move feature transaction', async(roomName, featureIndex, offsetX, offsetY, type)=>{
      if(type == "move feature"){
        socket.in(roomName).emit('received move feature transaction',{
          featureIndex: featureIndex,
          offsetX: offsetX,
          offsetY: offsetY,
          type: 'move feature'
        })
      }
      else if(type === "undo move feature"){
        socket.in(roomName).emit("received move feature transaction",{
          featureIndex: featureIndex,
          offsetX: offsetX,
          offsetY: offsetY,
          type: 'undo move feature'
        })
      }
    })

    socket.on('create delete feature transaction', async(roomName, featureIndex, latlngs, properties, type)=>{
      if(type == "delete feature"){
        socket.in(roomName).emit('received delete feature transaction',{
          featureIndex: featureIndex,
          latlngs: latlngs,
          properties: properties,
          type: 'delete feature'
        })
      }
      else if(type === "undo delete feature"){
        socket.in(roomName).emit("received delete feature transaction",{
          featureIndex: featureIndex,
          latlngs: latlngs,
          properties: properties,
          type: 'undo delete feature'
        })
      }
    })

    socket.on('create add polygon transaction', async(roomName, featureIndex, latlngs, properties, type)=>{
      if(type == "add polygon"){
        socket.in(roomName).emit('received add polygon transaction',{
          featureIndex: featureIndex,
          latlngs: latlngs,
          properties: properties,
          type: 'add polygon'
        })
      }
      else if(type === "undo add polygon"){
        socket.in(roomName).emit("received add polygon transaction",{
          featureIndex: featureIndex,
          latlngs: latlngs,
          properties: properties,
          type: 'undo add polygon'
        })
      }
    })

    socket.on('create add polyline transaction', async(roomName, featureIndex, latlngs, properties, type)=>{
      if(type == "add polyline"){
        socket.in(roomName).emit('received add polyline transaction',{
          featureIndex: featureIndex,
          latlngs: latlngs,
          properties: properties,
          type: 'add polyline'
        })
      }
      else if(type === "undo add polyline"){
        socket.in(roomName).emit("received add polyline transaction",{
          featureIndex: featureIndex,
          latlngs: latlngs,
          properties: properties,
          type: 'undo add polyline'
        })
      }
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
