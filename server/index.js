// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
// const cookieParser = require('cookie-parser')

// CREATE OUR SERVER
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

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

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
  credentials: true
}))


app.use(express.json({limit:'2000kb'}))
// app.use(cookieParser())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const mapsRouter = require('./routes/maps-router')
app.use('/api', mapsRouter)
const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)
// INITIALIZE OUR DATABASE OBJECT
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// PUT THE SERVER IN LISTENING MODE
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// :3
