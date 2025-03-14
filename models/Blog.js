const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    image: { type: String, required: true }, // Store image URL
    intro: { type: String, required: true },
    para1: { type: String, required: true },
    para2: { type: String, required: true },
    para3: { type: String, required: true },
    para4: { type: String, required: true },
    comments: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', BlogSchema);