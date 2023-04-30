const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    Schema for an account

    username: username user chose
    passwordHash: password user chose, hashed for privacy
    email: email user used to signup
    firstName: first name of the user
    lastName: last name of the user
    mapsOwned: Map of ObjectID's, that have been hashed for privacy, of maps, Map schema, the user owns
    mapAccess: Map the user has access to editing, for live collaboration
*/
const accountSchema = new Schema(
    {
        username: { type: String, required: true },
        passwordHash: {type: String, required: true},
        email: { type: String,  required: true },
        firstName: { type: String,  required: true },
        lastName: { type: String,  required: true },
        mapsOwned: {type: [String], required: true},
        mapAccess: {type: [String], required: true},
        token: {type: String, requried: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Account', accountSchema)
