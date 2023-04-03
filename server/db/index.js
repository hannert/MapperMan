const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

mongoose
    .connect("mongodb+srv://hannert:Coke1235@mapperman.xdnolvq.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db

