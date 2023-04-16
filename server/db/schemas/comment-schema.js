const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
/*
    Schema for a comment

    owner: Account of person that put the comment
    content: String storing what the comment says 
    
*/
const commentSchema = new Schema(
    {
        owner: { type: ObjectId, ref: 'Account', required: true },
        content: {type: String, required: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('Comment', commentSchema)
