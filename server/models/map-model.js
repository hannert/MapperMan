const mongoose = require('mongoose')
const Schema = mongoose.Schema


const mapSchema = new Schema(
    {
        name: {type: String, required: true},
        mapData: {type: Object, required: true}
        
    }
)

module.exports = mongoose.model('Map', mapSchema)