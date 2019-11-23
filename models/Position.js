const mongoose = require("mongoose")
const Scheme = mongoose.Schema

const positionScheme = new Scheme({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    category: {
        ref: 'categories',
        type: Scheme.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Scheme.Types.ObjectId
    }
})

module.exports = mongoose.model('positions', positionScheme)