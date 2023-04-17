const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    Schema for storing map data
    
    name: Name of the map 
    owner: Who made the map, has a type of 'Account'
    mapData: Reference to GeoJSON schema that holds map data for leaflet
    published: Boolean for if a map was published

    //TODO: Make comments a reference to comment schema
    comments: Array of Comments to hold comments
    tags: Map of Strings that owner attached to the map, for searching purposes
*/
const mapSchema = new Schema(
    {
        name: { type: String, required: true },
        owner: { type: ObjectId, ref: 'Account', required: true },
        mapData: { type: Object, required: true },
        published: {type: Boolean, required: true},
        comments: {type: [String], ref: 'Comment', required: true },
        tags: {type: Map, of: String, required: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('Map', mapSchema)
